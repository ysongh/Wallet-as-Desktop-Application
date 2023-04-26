import { Framework } from "@superfluid-finance/sdk-core";

export const initializingSuperfluid = async (signer) => {
  try{
    const sf = await Framework.create({
      chainId: 80001,
      provider: signer
    });
    console.log(sf);

    return sf;
  }
  catch(error){
    console.error(error);
  }
}

export const getfDAIxBalance = async (sf, signer, address) => {
  try{
    const daix = await sf.loadSuperToken("fDAIx");

    const balance = await daix.balanceOf({
      account: address,
      providerOrSigner: signer
    });

    return (balance / 10 ** 18);
  }
  catch(error){
    console.error(error);
  }
}