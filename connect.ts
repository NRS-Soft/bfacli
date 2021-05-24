import Web3 from "web3";
import keystore from "./keystore.json";

async function connect(web3: Web3) {
  await web3.eth.getBlock("latest");
  return web3.eth.accounts.decrypt(keystore, "");
}

export { connect };
