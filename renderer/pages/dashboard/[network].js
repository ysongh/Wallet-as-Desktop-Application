import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu, Button, Form, Input, Typography, Steps, Tag, message } from 'antd';
import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'

import { stepsItems } from '../../utils/antdesign';
import { loginSafe, logoutSafe } from '../../utils/auth';
import { createSafe, getSafe, createSafeTransaction } from '../../utils/safe';
import { createUserWalletCollection, createUserWalletToPB, getSafesByUserFromPB, addSafeToPB } from '../../utils/polybase';
import { initializingSuperfluid } from '../../utils/superfluid';
import { WEB3AUTH_CLIENT_ID } from '../../keys';
import { NETWORK } from '../../network';

import 'antd/dist/reset.css';
import Receive from '../../components/Receive';
import TransferForm from '../../components/TransferForm';
import Transaction from '../../components/Transaction';
import Safe from '../../components/Safe';
import Streaming from '../../components/Streaming';

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const router = useRouter();
  const { network } = router.query;

  const [messageApi, contextHolder] = message.useMessage();

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
  const [currentStep, setCurrentStep] = useState(0);
  const [to, setTo] = useState();
  const [amount, setAmount] = useState();
  const [enterOwners, setEnterOwners] = useState([]);

  useEffect(() => {
    if(!network) router.push('/');
    else createInstanceAuth();
  }, [])

  const createInstanceAuth = async () => {
    const safeAuthKit = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
      chainId: NETWORK[network].chainId,
      authProviderConfig: {
        rpcTarget: NETWORK[network].rpc, // Add your RPC e.g. https://goerli.infura.io/v3/<your project id>
        clientId: WEB3AUTH_CLIENT_ID, // Add your client id. Get it from the Web3Auth dashboard
        network: 'testnet' | 'mainnet', // The network to use for the Web3Auth modal. Use 'testnet' while developing and 'mainnet' for production use
        theme: 'light' | 'dark', // The theme to use for the Web3Auth modal
        modalConfig: {
          // The modal config is optional and it's used to customize the Web3Auth modal
          // Check the Web3Auth documentation for more info: https://web3auth.io/docs/sdk/web/modal/whitelabel#initmodal
        }
      }
    });
    setSafeAuth(safeAuthKit);
    await login(safeAuthKit);
  }

  const login = async (safeAuthKit) => {
    const { address, providerSafe, userSigner, ethbalance } = await loginSafe(safeAuthKit);
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
    router.push('/');
  }

  const makeSafe = async () => {
    const { sSdk, sAddress} = await createSafe(signer, amount, enterOwners, messageApi);
    setSafeSdk(sSdk);
    setSafeAddress(sAddress);
    await addSafeToPB(walletAddress, sAddress);
    setCurrentTab("Safe");
  }

  const handleAddOwner = async () => {
    setEnterOwners([...enterOwners, to]);
    setTo("");
  }

  const Overview = () => {
    return (
      <div id='stripe-root'>
        <Typography.Title level={2}>
          Overview
        </Typography.Title>
        <Tag color="purple" style={{ marginBottom: '1rem' }}>{NETWORK[network].networkName}</Tag>
        <p>{walletAddress}</p>
        <p>{balance / 10 ** 18} {NETWORK[network].tokenSymbol}</p>
        {/* <Button onClick={() => createUserWalletToPB("")} type="primary" style={{ marginBottom: '2rem' }}>
          Add Fund
        </Button> */}
      </div>
    )
  }

  const CreateSafe = () => {
    return (
      <>
        <Typography.Title level={2}>
          Create Safe
        </Typography.Title>
        <Steps current={currentStep} items={stepsItems} />
        {currentStep === 0 && <Step1 />}
        {currentStep === 1 && <Step2 />}
        {currentStep === 2 && <Step3 />}
      </>
    )
  }

  const Step1 = () => {
    return (
      <div style={{ marginTop: '1rem'}}>
        <Typography.Title level={4}>
          Add number of owners
        </Typography.Title>
        {enterOwners.map((o, index) => (
          <p key={index}>
            {index + 1} -
            <Tag color="cyan">
              {o}
            </Tag>
          </p>
        ))}
        <Form.Item label="Signer">
          <Input placeholder="0x0" value={to} onChange={(e) => setTo(e.target.value)} />
        </Form.Item>
        <Button onClick={handleAddOwner} type="primary">
          Add
        </Button>
        <Button onClick={() => setCurrentStep(currentStep + 1)} type="primary">
          Next
        </Button>
      </div>
    )
  }

  const Step2 = () => {
    return (
      <div style={{ marginTop: '1rem'}}>
        <Typography.Title level={4}>
          Threshold
        </Typography.Title>
        
        <Form.Item label="Threshold">
          <Input placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
        </Form.Item>

        <Button onClick={() => setCurrentStep(currentStep + 1)} type="primary">
          Next
        </Button>
        <Button onClick={() => setCurrentStep(currentStep + 1)} type="primary">
          Back
        </Button>
      </div>
    )
  }

  const Step3 = () => {
    return (
      <div style={{ marginTop: '1rem'}}>
        <Typography.Title level={4}>
          Number of Signers
        </Typography.Title>
        {enterOwners.map((o, index) => (
          <p key={index}>
            {index + 1} -
            <Tag color="cyan">
              {o}
            </Tag>
          </p>
        ))}

        <Typography.Title level={4}>
          Threshold - {amount}
        </Typography.Title>

        <Button onClick={makeSafe} type="primary">
          Create
        </Button>
        <Button onClick={() => setCurrentStep(currentStep - 1)} type="primary">
          Back
        </Button>
      </div>
    )
  }

  return (
    <Layout>
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
            {currentTab === "Send" && <TransferForm balance={balance} messageApi={messageApi} walletAddress={walletAddress} signer={signer} />}
            {currentTab === "Receive" && <Receive walletAddress={walletAddress} />}
            {currentTab === "Transaction" && <Transaction />}
            {currentTab === "Streaming" && <Streaming />}
            {currentTab === "Safe" && <Safe signer={signer} userData={userData} network={network} messageApi={messageApi}/>}
            {currentTab === "CreateSafe" && <CreateSafe />}
          </Content>
        </Layout>
      </Layout>
      {contextHolder}
    </Layout>
  )
}

export default Dashboard;
