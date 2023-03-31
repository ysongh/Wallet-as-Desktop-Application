import { ethers } from 'ethers';
import Safe, { SafeFactory } from '@safe-global/safe-core-sdk';
import EthersAdapter from '@safe-global/safe-ethers-lib';

export const createSafe = async (signer, walletAddress) => {
  try{
    const ethAdapter = new EthersAdapter({ethers, signerOrProvider: signer});
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const sSdk = await safeFactory.deploySafe({ safeAccountConfig: { threshold: 1, owners: [walletAddress] }});
    const sAddress = sSdk.getAddress();
    return { sSdk, sAddress };
  }
  catch(error){
    console.error(error);
  }
}

export const getSafe = async (signer, address) => {
  try{
    const ethAdapter = new EthersAdapter({ethers, signerOrProvider: signer});
    const sSdk = await Safe.create({ ethAdapter: ethAdapter, safeAddress: address })
    const sAddress = sSdk.getAddress();
    const balance = await sSdk.getBalance();
    return { sSdk, sAddress, balance: balance.toString() };
  }
  catch(error){
    console.error(error);
  }
}

export const createSafeTransaction= async (to, amount, sSdk) => {
  try{
    const safeTransactionData = {
      to: to,
      value: amount,
      data: '0x'
    };
    const safeTransaction = await sSdk.createTransaction({ safeTransactionData });
    console.log(safeTransaction);
  }
  catch(error){
    console.error(error);
  }
}

export const executeSafeTransaction= async (to, amount, sSdk, signer, safeAddress, messageApi) => {
  try{
    const safeTransactionData = {
      to: to,
      value: ethers.utils.parseUnits(amount, "ether"),
      data: '0x'
    };
    const safeTransaction = await sSdk.createTransaction({ safeTransactionData });
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
    const safeSdk3 = await sSdk.connect({ ethAdapter: ethAdapter, safeAddress });
    console.log(safeTransactionData);

    const executeTxResponse = await safeSdk3.executeTransaction(safeTransaction);
    await executeTxResponse.transactionResponse?.wait();
    console.log(executeTxResponse);

    messageApi.open({
      type: 'success',
      content: `Send ${amount} MATIC success`,
      duration: 20,
    });
  }
  catch(error){
    console.error(error);
  }
}