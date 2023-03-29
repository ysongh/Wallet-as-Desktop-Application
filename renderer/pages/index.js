import { useState, useEffect } from 'react';
import { Button, Input, Typography } from 'antd';

import { loginSafe, logoutSafe, sendETH } from '../utils/auth';

import 'antd/dist/reset.css';
import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'
import { WEB3AUTH_CLIENT_ID, RPC } from '../keys';

const Home = () => {
  const [walletAddress, setWalletAddress] = useState();
  const [balance, setBalance] = useState();
  const [safeAuth, setSafeAuth] = useState();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  
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
  }
  
  return (
    <div style={{ padding: "1rem" }}>
      <Typography.Title level={2}>Wallet as Desktop App</Typography.Title>
      <Button onClick={login} type="primary">
        Login
      </Button>
      <br />
      <br />
      {walletAddress && <p>{walletAddress}</p>}
      <p>{balance / 10 ** 18} MATIC</p>
      {walletAddress && <Button onClick={logout} type="primary">logout</Button>}
      <Typography.Title level={2}>
        Transfer MATIC
      </Typography.Title>
      <Input placeholder="To" onChange={(e) => setTo(e.target.value)}/>
      <Input placeholder="Amount" onChange={(e) => setAmount(e.target.value)}/>
      <Button onClick={() => sendETH(to, amount, walletAddress, signer)} type="primary">
        Send
      </Button>
    </div>
  )
}

export default Home;
