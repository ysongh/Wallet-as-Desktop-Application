import { useState, useEffect } from 'react';
import { Button, Typography } from 'antd';
import { ethers } from 'ethers';

// import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";
// import { GASLESSWALLET_KEY, RPC } from '../keys';

import 'antd/dist/reset.css';
import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'
import { WEB3AUTH_CLIENT_ID, RPC } from '../keys';

const Home = () => {
  const [walletAddress, setWalletAddress] = useState();
  const [balance, setBalance] = useState();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState(
    null
  );
  const [safeAuth, setSafeAuth] = useState();
  const [provider, setProvider] = useState(null);

  // const [gobMethod, setGOBMethod] = useState(null);
  
  // const login = async () => {
  //   try{
  //     const gaslessWalletConfig = { apiKey: GASLESSWALLET_KEY };
  //     const loginConfig = {
  //       domains: [window.location.origin],
  //       chain: {
  //         // id: 5,
  //         // rpcUrl: RPC,
  //         id: 80001,
  //         rpcUrl: "https://rpc-mumbai.maticvigil.com/",
  //       }
  //     };
  //     const gaslessOnboarding = new GaslessOnboarding(
  //       loginConfig,
  //       gaslessWalletConfig
  //     );

  //     await gaslessOnboarding.init();
  //     setGOBMethod(gaslessOnboarding);

  //     const web3AuthProvider = await gaslessOnboarding.login();
  //     console.log("web3AuthProvider", web3AuthProvider);

  //     const gaslessWallet = gaslessOnboarding.getGaslessWallet();
  //     setWalletAddress(gaslessWallet.getAddress());

  //     const signer = new ethers.providers.Web3Provider(web3AuthProvider);
  //     console.log(signer);

  //     const balance = await signer.getBalance(gaslessWallet.getAddress());
  //     setBalance(balance.toString());
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // }

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
    try{
      if (!safeAuth) return;

      const response = await safeAuth.signIn();
      console.log('SIGN IN RESPONSE: ', response);
      setWalletAddress(response.eoa);
  
      setSafeAuthSignInResponse(response);
      setProvider(safeAuth.getProvider());

      const provider = new ethers.providers.Web3Provider(safeAuth.getProvider());
      const signer = provider.getSigner();
      console.log(signer);

      const balance = await provider.getBalance(response.eoa);
      console.log(balance);
      setBalance(balance.toString());
    }
    catch(error){
      console.error(error);
    }
  }

  const logout = async () => {
    try{
      if (!safeAuth) return;

      await safeAuth.signOut();

      setProvider(null);
      setSafeAuthSignInResponse(null);
    }
    catch(error){
      console.error(error);
    }
  }


  return (
    <div style={{ padding: "1rem" }}>
      <Typography.Title level={2}>Wallet as Desktop App</Typography.Title>   
      <Button onClick={login} type="primary">
        login
      </Button>
      <br />
      <br />
      {walletAddress && <p>{walletAddress}</p>}
      <p>{balance / 10 ** 18} MATIC</p>
      {walletAddress && <Button onClick={logout} type="primary">logout</Button>}
    </div>
  )
}

export default Home;
