import { useState, useEffect } from 'react';

import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";

const Home = () => {
  const [walletAddress, setWalletAddress] = useState();
  const [gobMethod, setGOBMethod] = useState(null);
  
  const login = async () => {
    try{
      const gaslessWalletConfig = { apikey: process.env.NEXT_PUBLIC_GASLESSWALLET_KEY };
      const loginConfig = {
        domains: [window.location.origin],
        chain: {
          id: 5,
          rpcUrl: process.env.NEXT_PUBLIC_RPC,
        }
      };
      const gaslessOnboarding = new GaslessOnboarding(
        loginConfig,
        gaslessWalletConfig
      );

      await gaslessOnboarding.init();
      setGOBMethod(gaslessOnboarding);

      const web3AuthProvider = await gaslessOnboarding.login();
      console.log("web3AuthProvider", web3AuthProvider);

      const gaslessWallet = gaslessOnboarding.getGaslessWallet()
      setWalletAddress(gaslessWallet.getAddress())
    }
    catch(error){
      console.log(error);
    }
  }

  const logout = async () => {
    await gobMethod.logout();
  }


  return (
    <div>
      <h1>Wallet as Desktop App</h1>   
      <button onClick={login}>login</button>
      {walletAddress && <p>{walletAddress}</p>}
      {walletAddress && <button onClick={logout}>logout</button>}
    </div>
  )
}

export default Home;
