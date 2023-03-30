import { useState, useEffect } from 'react';
import { Layout, Menu,Button, Form, Input, Typography, QRCode } from 'antd';

import { loginSafe, logoutSafe, sendETH } from '../utils/auth';
import { createSafe } from '../utils/safe';

import 'antd/dist/reset.css';
import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'
import { WEB3AUTH_CLIENT_ID, RPC } from '../keys';

const { Header, Content, Sider } = Layout;

const Home = () => {
  const [walletAddress, setWalletAddress] = useState();
  const [balance, setBalance] = useState();
  const [safeAuth, setSafeAuth] = useState();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  
  const [currentTab, setCurrentTab] = useState("Overview")
  const [to, setTo] = useState();
  const [amount, setAmount] = useState();

  useEffect(() => {
    ;(async () => {
      setSafeAuth(
        await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
          chainId: '0x13881',
          authProviderConfig: {
            rpcTarget: RPC, // Add your RPC e.g. https://goerli.infura.io/v3/<your project id>
            clientId: WEB3AUTH_CLIENT_ID, // Add your client id. Get it from the Web3Auth dashboard
            network: 'testnet' | 'mainnet', // The network to use for the Web3Auth modal. Use 'testnet' while developing and 'mainnet' for production use
            theme: 'light' | 'dark', // The theme to use for the Web3Auth modal
            modalConfig: {
              // The modal config is optional and it's used to customize the Web3Auth modal
              // Check the Web3Auth documentation for more info: https://web3auth.io/docs/sdk/web/modal/whitelabel#initmodal
            }
          }
        })
      )
    })()
  }, [])

  const login = async () => {
    const { address, providerSafe, userSigner, ethbalance } = await loginSafe(safeAuth);
    console.log(address, providerSafe, userSigner, ethbalance)

    setWalletAddress(address);
    setProvider(providerSafe);
    setSigner(userSigner);
    setBalance(ethbalance);
  }

  const logout = async () => {
    await logoutSafe(safeAuth);
    setProvider(null);
  }

  const UnauthenticatedState = () => {
    return (
      <center>
        <Typography.Title level={2} style={{ marginTop: '10rem', marginBottom: '2rem' }}>
          Wallet as Desktop App
        </Typography.Title>
        <Button onClick={login} type="primary" size='large'>
          Login
        </Button>
      </center>
    )
  }

  const Overview = () => {
    return (
      <>
        <Typography.Title level={2}>
          Overview
        </Typography.Title>
        <p>{walletAddress}</p>
        <p>{balance / 10 ** 18} MATIC</p>
      </>
    )
  }

  const TransferForm = () => {
    return (
      <>
        <Typography.Title level={2}>
          Transfer MATIC
        </Typography.Title>
        <p>Balance {balance / 10 ** 18} MATIC</p>
        <Form layout="vertical" >
          <Form.Item label="To">
            <Input placeholder="0x0" value={to} onChange={(e) => setTo(e.target.value)} />
          </Form.Item>
          <Form.Item label="Amount">
            <Input placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
          </Form.Item>
          
          
          <Button onClick={() => sendETH(to, amount, walletAddress, signer)} type="primary">
            Send
          </Button>
        </Form>
        
      </>
    )
  }

  const Receive = () => {
    return (
      <>
        <Typography.Title level={2}>
          Receive
        </Typography.Title>
       
        <QRCode
          value={walletAddress}
          color="blue"
          style={{
            marginBottom: 16,
          }}
        />
        
        <p>{walletAddress}</p>
      </>
    )
  }

  const Safe = () => {
    return (
      <>
        <Typography.Title level={2}>
          Safe
        </Typography.Title>
       
        <Button onClick={() => createSafe(signer, walletAddress)} type="primary">
          Create
        </Button>
      </>
    )
  }

  const AuthedState = () => {
    return (
      <Layout>
        <Header className="header" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Welcome</h1>
          <Button onClick={logout} type="primary">logout</Button>
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
              <Menu.Item key="Safe">
                Safe
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              style={{
                padding: 20,
                margin: 0,
                minHeight: 480,
              }}
            >
              {currentTab === "Overview" && <Overview />}
              {currentTab === "Send" && <TransferForm />}
              {currentTab === "Receive" && <Receive />}
              {currentTab === "Safe" && <Safe />}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }

  return (
    <div>
      {provider
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  )
}

export default Home;
