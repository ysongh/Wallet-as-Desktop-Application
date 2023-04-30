import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from 'ethers';

import { daiABI } from "../daiABI";
import { addTransactionToPB } from "./polybase";

const DAI_ADDRESS = "0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7";
const DAIX_ADDRESS = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";

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

export const getDAIBalance = async (signer, address) => {
  try{
    const DAI = new ethers.Contract(
      DAI_ADDRESS,
      daiABI,
      signer
    );

    const balance = await DAI.balanceOf(address);
    console.log(balance);
    return (balance / 10 ** 18);
  }
  catch(error){
    console.error(error);
  }
}

export async function transferDAITokens(sf, signer, amount, to) {
  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const DAI = new ethers.Contract(
    DAI_ADDRESS,
    daiABI,
    signer
  );

  try {

    console.log(DAI);
    await DAI.transfer(
      to,
      ethers.utils.parseEther(amount.toString())
    ).then(function (tx) {
      console.log(
        `Congrats, you just transfer your DAI. You can see this tx at https://mumbai.polygonscan.com/tx/${tx.hash}`
      );
    });
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error."
    );
    console.error(error);
  }
}


export async function approveDAITokens(sf, signer, amount, messageApi) {
  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const DAI = new ethers.Contract(
    DAI_ADDRESS,
    daiABI,
    signer
  );

  try {
    console.log("approving DAI spend");
    const transaction =  await DAI.approve(
      DAIX_ADDRESS,
      ethers.utils.parseEther(amount.toString())
    )
    const tx = await transaction.wait();
    console.log(tx);
    console.log(
      `Congrats, you just approved your DAI spend. You can see this tx at https://mumbai.polygonscan.com/tx/${tx.hash}`
    );

    messageApi.open({
      type: 'success',
      content: `Approved ${amount} DAI`,
      duration: 20,
    });

    await addTransactionToPB(tx.transactionHash, tx.from, tx.to, amount, tx.blockNumber.toString(), "Approval", "DAI");
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

export const upgradeDAIToDAIx = async (sf, signer, amount, messageApi) => {
  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");

  console.log(daix);

  try {
    const upgradeOperation = daix.upgrade({
      amount: ethers.utils.parseEther(amount.toString())
    });

    console.log("Upgrading...");

    await upgradeOperation.exec(signer);

    console.log(
      `Congrats - you've just upgraded your tokens to an Index!
         Network: Mumbai
         Super Token: DAIx
         Amount: ${amount}         
      `
    );

    console.log(
      `Congrats - you've just distributed to your index!`
    );
    messageApi.open({
      type: 'success',
      content: `Upgraded ${amount} DAI to DAIx`,
      duration: 20,
    });
  } catch(error){
    console.error(error);
  }
}


export const streamDAIx = async (sf, signer, from, flowrate, to, messageApi) => {
  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");

  console.log(daix);

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: from,
      receiver: to,
      flowRate: flowrate,
      superToken: daix.address,
    });

    console.log("Creating your stream...");
    console.log(createFlowOperation);

    const result = await createFlowOperation.exec(signer);
    console.log(result);
    console.log(`See your stream at https://app.superfluid.finance/?view=${to}`);

    messageApi.open({
      type: 'success',
      content: `Stream DAIx`,
      duration: 20,
    });
  } catch(error){
    console.error(error);
  }
}
