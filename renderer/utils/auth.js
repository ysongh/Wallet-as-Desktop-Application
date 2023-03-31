import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";
import { ethers } from 'ethers';

import { GASLESSWALLET_KEY, RPC } from '../keys';

export const loginGasless = async () => {
  try{
    const gaslessWalletConfig = { apiKey: GASLESSWALLET_KEY };
    const loginConfig = {
      domains: [window.location.origin],
      chain: {
        // id: 5,
        // rpcUrl: RPC,
        id: 80001,
        rpcUrl: "https://rpc-mumbai.maticvigil.com/",
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

    const gaslessWallet = gaslessOnboarding.getGaslessWallet();
    setWalletAddress(gaslessWallet.getAddress());

    const signer = new ethers.providers.Web3Provider(web3AuthProvider);
    console.log(signer);

    const balance = await signer.getBalance(gaslessWallet.getAddress());
    setBalance(balance.toString());
  }
  catch(error){
    console.log(error);
  }
}

export const loginSafe = async (safeAuth) => {
  try{
    if (!safeAuth) return;

    const response = await safeAuth.signIn();
    console.log('SIGN IN RESPONSE: ', response);

    const provider = new ethers.providers.Web3Provider(safeAuth.getProvider());
    const _signer = provider.getSigner();
   
    const balance = await provider.getBalance(response.eoa);

    return { address: response.eoa, providerSafe: safeAuth.getProvider(), userSigner: _signer, ethbalance: balance.toString() };
  }
  catch(error){
    console.error(error);
  }
}

export const logoutSafe = async (safeAuth) => {
  try{
    if (!safeAuth) return;

    await safeAuth.signOut();
  }
  catch(error){
    console.error(error);
  }
}

export const sendETH = async (to, amount, walletAddress, signer, messageApi) => {
  const connection = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
  const gasPrice = await connection.getGasPrice();
  
  const tx = {
    from: walletAddress,
    to: to,
    value: ethers.utils.parseUnits(amount, "ether"),
    gasPrice: gasPrice,
    gasLimit: ethers.utils.hexlify(100000),
    nonce: await connection.getTransactionCount(
      walletAddress,
      "latest"
    )
  }

  const transaction = await signer.sendTransaction(tx);
  console.log(transaction);
  
  messageApi.open({
    type: 'success',
    content: `Send ${amount} MATIC success`,
    duration: 20,
  });
}
