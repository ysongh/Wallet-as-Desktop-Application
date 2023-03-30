import { ethers } from 'ethers';
import { SafeFactory } from '@safe-global/safe-core-sdk';
import EthersAdapter from '@safe-global/safe-ethers-lib';

export const createSafe = async (signer, walletAddress) => {
  try{
    const ethAdapter = new EthersAdapter({ethers, signerOrProvider: signer});

    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig: { threshold: 1, owners: [walletAddress] }});
    console.log(safeSdk)
  }
  catch(error){
    console.error(error);
  }
}