import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace: "desktopwallet2",
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

      @public
      collection Transaction {
        id: string;
        from: string;
        to: string;
        amount: string;
        date: string;

        constructor (id: string, from: string, to: string, amount: string, date: string) {
          this.id = id;
          this.from = from;
          this.to = to;
          this.amount = amount;
          this.date = date;
        }
      }
    `,
      "desktopwallet2"
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