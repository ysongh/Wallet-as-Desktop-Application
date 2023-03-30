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
    return { sSdk, sAddress };
  }
  catch(error){
    console.error(error);
  }
}