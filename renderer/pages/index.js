import { useState, useEffect } from 'react';
import { Layout, Menu,Button, Form, Input, Typography, Divider, Steps, QRCode, Tag, message } from 'antd';

import { stepsItems } from '../utils/antdesign';
import { loginSafe, logoutSafe, sendETH } from '../utils/auth';
import { fundWallet } from '../utils/onramp';
import { createSafe, getSafe, createSafeTransaction, executeSafeTransaction } from '../utils/safe';
import { getSafesByUserFromPB, addSafeToPB } from '../utils/polybase';

import 'antd/dist/reset.css';
import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'
import { WEB3AUTH_CLIENT_ID, RPC } from '../keys';

const { Header, Content, Sider } = Layout;

const Home = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [walletAddress, setWalletAddress] = useState();
  const [balance, setBalance] = useState();
  const [safeBalance, setSafeBalance] = useState(0);
  const [safeAuth, setSafeAuth] = useState();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [safeSdk, setSafeSdk] = useState(null);
  const [safeAddress, setSafeAddress] = useState();
  const [userData, setUserData] = useState();
  
  const [currentTab, setCurrentTab] = useState("Overview");
  const [currentStep, setCurrentStep] = useState(0);
  const [to, setTo] = useState();
  const [amount, setAmount] = useState();
  const [enterSafeAddress, setEnterSafeAddress] = useState();
  const [enterOwners, setEnterOwners] = useState([]);

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
    const data = await getSafesByUserFromPB(address);
    setUserData(data);
  }

  const logout = async () => {
    await logoutSafe(safeAuth);
    setProvider(null);
  }

  const makeSafe = async () => {
    const { sSdk, sAddress} = await createSafe(signer, amount, enterOwners, messageApi);
    setSafeSdk(sSdk);
    setSafeAddress(sAddress);
    await addSafeToPB(walletAddress, sAddress);
    setCurrentTab("Safe");
  }

  const findSafe = async (safeAddress) => {
    const { sSdk, sAddress, balance, ownerAddresses } = await getSafe(signer, safeAddress);
    setSafeSdk(sSdk);
    setSafeAddress(sAddress);
    setSafeBalance(balance);
    setEnterOwners(ownerAddresses);
  }

  const handleAddOwner = async () => {
    setEnterOwners([...enterOwners, to]);
    setTo("");
  }

  const UnauthenticatedState = () => {
    return (
      <center>
        <Typography.Title level={2} style={{ marginTop: '10rem', marginBottom: '2rem' }}>
          Desktop Safe Wallet
        </Typography.Title>
        <Button onClick={login} type="primary" size='large'>
          Login
        </Button>
      </center>
    )
  }

  const Overview = () => {
    return (
      <div id='stripe-root'>
        <Typography.Title level={2}>
          Overview
        </Typography.Title>
        <p>{walletAddress}</p>
        <p>{balance / 10 ** 18} MATIC</p>
        <Button onClick={() => fundWallet(walletAddress)} type="primary" style={{ marginBottom: '2rem' }}>
          Add Fund
        </Button>
      </div>
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
          
          <Button onClick={() => sendETH(to, amount, walletAddress, signer, messageApi)} type="primary">
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Title level={2}>
            Safe
          </Typography.Title>
          {safeAddress && <Button onClick={() => setSafeAddress(null)} type="primary" style={{ marginBottom: '2rem' }}>
            Exit
          </Button>}
        </div>
        
        
        {safeAddress
          ? <>
              <p>{safeAddress}</p>
              <p>{safeBalance / 10 ** 18} MATIC</p>
              <Button onClick={() => fundWallet(safeAddress)} type="primary" style={{ marginBottom: '2rem' }}>
                Add Fund
              </Button>
              <div id='stripe-root'></div>
              <Typography.Title level={4}>
                Owners
              </Typography.Title>
              {enterOwners.map((o, index) => (
                <p key={index}>
                  {index + 1} -
                  <Tag color="cyan">
                    {o}
                  </Tag>
                </p>
              ))}
              <Divider orientation="left">Transfer</Divider>
              <Form layout="vertical" >
                <Form.Item label="To">
                  <Input placeholder="0x0" value={to} onChange={(e) => setTo(e.target.value)} />
                </Form.Item>
                <Form.Item label="Amount">
                  <Input placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                </Form.Item>
                <Button onClick={() => executeSafeTransaction(to, amount, safeSdk, signer, safeAddress, messageApi)} type="primary">
                  Send
                </Button>
              </Form>
            </>
          : <>
              <Divider orientation="left">Existing Safes</Divider>
              {userData?.safes?.map(s => (
                <Tag key={s} color="cyan" onClick={() => findSafe(s)} style={{ cursor: "pointer" }}>
                  {s}
                </Tag>
              ))}
              <Divider orientation="left">Search for Safes</Divider>
              <Form.Item label="Safe Address">
                <Input placeholder="0x0" value={enterSafeAddress} onChange={(e) => setEnterSafeAddress(e.target.value)}/>
              </Form.Item>
              <Button onClick={() => findSafe(enterSafeAddress)} type="primary">
                Find
              </Button>
              <Divider orientation="left">Don't have one?</Divider>
              <Button onClick={() => setCurrentTab("CreateSafe")} type="primary">
                Create
              </Button>
            </>
        }
      </>
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
                paddingTop: 10,
                margin: 0,
                minHeight: 480,
              }}
            >
              {currentTab === "Overview" && <Overview />}
              {currentTab === "Send" && <TransferForm />}
              {currentTab === "Receive" && <Receive />}
              {currentTab === "Safe" && <Safe />}
              {currentTab === "CreateSafe" && <CreateSafe />}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }

  return (
    <div>
      {contextHolder}
      {provider
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  )
}

export default Home;
