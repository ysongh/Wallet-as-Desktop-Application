import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace: "desktopwallet1",
});

export const createUserWalletCollection = async () => {
  try{
    await db.applySchema(`
      @public
      collection UserWallet {
        id: string;
        safes: string[];

        constructor (id: string) {
          this.id = id;
          this.safes = [];
        }

        addSafe (safe: string) {
          this.safes.push(safe);
        }
      }
    `,
      "desktopwallet1"
    );
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const createUserWalletToPB = async (address) => {
  try{
    await db.collection("UserWallet").create([address]); 
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getSafesByUserFromPB = async (address) => {
  try{
    const data = await db.collection("UserWallet").record(address).get();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const addSafeToPB = async (address, safeAddress) => {
  try{
    const data = await db.collection("UserWallet")
      .record(address)
      .call("addSafe", [safeAddress]);
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}