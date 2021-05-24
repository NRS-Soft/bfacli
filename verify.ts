import Web3 from "web3";
import { abi } from "./abi";
import { Account } from "web3-core";

const verify = (web3: Web3) => async (account: Account) => {
  const contractInstance = new web3.eth.Contract(
    abi,
    "0xf474b880ad5a82aecc1078abe4e73ba414e8fc4a"
  );

  web3.eth.defaultAccount = account.address;
  const gas: number = await contractInstance.methods
    .proveControl("7d0cb11e-bbc6-11eb-b5bc-0050568d8904")
    .estimateGas();
  const gasPrice = await web3.eth.getGasPrice();
  const data = contractInstance.methods
    .proveControl("7d0cb11e-bbc6-11eb-b5bc-0050568d8904")
    .encodeABI();
  const rawTransaction = {
    from: account.address,
    to: "0xf474b880ad5a82aecc1078abe4e73ba414e8fc4a",
    gas,
    gasPrice,
    data,
  };
  const signedTx = await account.signTransaction(rawTransaction);
  if (signedTx.rawTransaction == undefined) {
    throw Error("Problem signing tx");
  }
  web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .on("transactionHash", console.log)
    .on("receipt", console.log);
};

export { verify };
