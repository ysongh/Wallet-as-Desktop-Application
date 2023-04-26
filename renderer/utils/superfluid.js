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
