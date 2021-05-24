#!/usr/bin/env node

import Web3 from "web3";
import minimist from "minimist";
import { verify } from "./verify";
import { connect } from "./connect";
import ora from "ora";

const spinner = ora({ text: "Loading..", stream: process.stderr }).start();
const argv = minimist(process.argv.slice(2));
const web3 = new Web3(argv.host || "http://0.0.0.0:8545");
const cmd = argv._[0];
connect(web3)
  .then((account) => {
    switch (cmd) {
      case "verify":
        verify(web3)(account);
        break;
      case "deploy":
        break;
      case "balance":
        web3.eth.getBalance(account.address).then((balance: string) => {
          console.log(`Address: ${account.address}`);
          console.log(`Balance: ${parseInt(balance) / 1000000000} Gwei`);
        });
        break;
      case "sync":
        web3.eth.isSyncing().then((res) => {
          if (typeof res !== "boolean") {
            console.log(
              `Node is syncing ${res.CurrentBlock} of ${res.HighestBlock} - ${
                (res.CurrentBlock / res.HighestBlock) * 100
              }% `
            );
            return;
          }
          console.log("Node is syncronized!");
        });
        break;
      default:
        console.error(`${cmd} is not a valid command!`);
        break;
    }
  })
  .catch(console.error)
  .finally(() => spinner.stop());
