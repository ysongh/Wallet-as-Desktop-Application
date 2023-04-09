import { ethers } from 'ethers';

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
