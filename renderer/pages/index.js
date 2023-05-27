import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Tag, message } from 'antd';
import { SafeAuthKit, Web3AuthModalPack } from '@safe-global/auth-kit'
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

import { loginSafe, logoutSafe } from '../utils/auth';
import { createUserWalletCollection, createUserWalletToPB, getSafesByUserFromPB, addSafeToPB } from '../utils/polybase';
import { initializingSuperfluid } from '../utils/superfluid';
import { WEB3AUTH_CLIENT_ID } from '../keys';
import { NETWORK } from '../network';

import 'antd/dist/reset.css';
import Receive from '../components/Receive';
import TransferForm from '../components/TransferForm';
import Transaction from '../components/Transaction';
import Safe from '../components/Safe';
import Streaming from '../components/Streaming';
import Landing from '../components/Landing';
import CreateSafe from '../components/create-safe/CreateSafe';

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [network, setNetwork] = useState("");
  const [walletAddress, setWalletAddress] = useState();
  const [balance, setBalance] = useState();
  const [safeAuth, setSafeAuth] = useState();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [safeSdk, setSafeSdk] = useState(null);
  const [safeAddress, setSafeAddress] = useState();
  const [userData, setUserData] = useState();
  const [sfSdk, setSfSdk] = useState(null);
  
  const [currentTab, setCurrentTab] = useState("Overview");

  useEffect(() => {
    if(network) createInstanceAuth();
  }, [network])

  const createInstanceAuth = async () => {
    // https://web3auth.io/docs/sdk/web/modal/initialize#arguments
    const options = {
      clientId: WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: 'testnet',
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: NETWORK[network]?.chainId,
        // https://chainlist.org/
        rpcTarget: NETWORK[network]?.rpc
      },
      uiConfig: {
        theme: 'light',
        loginMethodsOrder: ['google', 'facebook']
      }
    };

    // https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters
    const modalConfig = {}

    // https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization
    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: 'none'
      },
      adapterSettings: {
        uxMode: 'popup',
        whiteLabel: {
          name: 'Safe'
        }
      }
    });

    const pack = new Web3AuthModalPack(options, [openloginAdapter], modalConfig);

    const safeAuthKit = await SafeAuthKit.init(pack);

    setSafeAuth(safeAuthKit);
  }

  const login = async () => {
    const { address, providerSafe, userSigner, ethbalance } = await loginSafe(safeAuth);
    console.log(address, providerSafe, userSigner, ethbalance)

    setWalletAddress(address);
    setProvider(providerSafe);
    setSigner(userSigner);
    setBalance(ethbalance);
    const data = await getSafesByUserFromPB(address);
    setUserData(data);
    const sf = await initializingSuperfluid(userSigner);
    setSfSdk(sf);
  }

  const logout = async () => {
    //await logoutSafe(safeAuth);
    setProvider(null);
    setWalletAddress(null);
  }

  const Overview = () => {
    return (
      <div id='stripe-root'>
        <Typography.Title level={2}>
          Overview
        </Typography.Title>
        <Tag color="purple" style={{ marginBottom: '1rem' }}>{NETWORK[network]?.networkName}</Tag>
        <p>{walletAddress}</p>
        <p>{balance / 10 ** 18} {NETWORK[network]?.tokenSymbol}</p>
        {/* <Button onClick={() => createUserWalletToPB("")} type="primary" style={{ marginBottom: '2rem' }}>
          Add Fund
        </Button> */}
      </div>
    )
  }

  return (
    <>
      { !walletAddress
        ? <Landing login={login} network={network} setNetwork={setNetwork} />
        : <Layout>
          <Header className="header" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Welcome</h1>
            <Button onClick={logout} type="primary">Logout</Button>
          </Header>
          <Layout>
            <Sider width={150} style={{ backgroundColor: 'white' }}>
              <Menu
                onClick={(e) => setCurrentTab(e.key)}
                selectedKeys={[currentTab]}
                defaultOpenKeys={['Overview']}
                mode="inline"
              >
                <Menu.Item key="Overview">
                  Overview
                </Menu.Item>
                <Menu.Item key="Send">
                  Send
                </Menu.Item>
                <Menu.Item key="Receive">
                  Receive
                </Menu.Item>
                <Menu.Item key="Streaming">
                  Streaming
                </Menu.Item>
                <Menu.Item key="Transaction">
                  Transaction
                </Menu.Item>
                <Menu.Item key="Safe">
                  Safe
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Content
                style={{
                  paddingTop: 10,
                  margin: 0,
                  minHeight: 480,
                }}
              >
                {currentTab === "Overview" && <Overview />}
                {currentTab === "Send" && <TransferForm balance={balance} messageApi={messageApi} walletAddress={walletAddress} signer={signer} network={network} />}
                {currentTab === "Receive" && <Receive walletAddress={walletAddress} />}
                {currentTab === "Transaction" && <Transaction />}
                {currentTab === "Streaming" && <Streaming sfSdk={sfSdk} signer={signer} walletAddress={walletAddress} messageApi={messageApi} />}
                {currentTab === "Safe" && <Safe signer={signer} userData={userData} network={network} setCurrentTab={setCurrentTab} messageApi={messageApi}/>}
                {currentTab === "CreateSafe" && <CreateSafe signer={signer} walletAddress={walletAddress} setSafeSdk={setSafeSdk} setCurrentTab={setCurrentTab} messageApi={messageApi} setSafeAddress={setSafeAddress} />}
              </Content>
            </Layout>
          </Layout>
          {contextHolder}
        </Layout>
      }
    </>
    
  )
}

export default Dashboard;
