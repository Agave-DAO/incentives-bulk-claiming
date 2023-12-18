import fs from "fs";
import { getRewardsBalance, getRewardsBalanceBatched } from "./web3.js";
import fetch from "node-fetch";
import { fetchAllUsers } from "./subgraph-queries.js";

const GRAPHQL_URL =
  "https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai";

let users = [];

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

async function looper() {
  users = await fetchAllUsers();
  const [unclaimedUsers, unclaimedAmounts] = await getUnclaimedUsers(users);
  fs.writeFile(
    "users.txt",
    JSON.stringify(unclaimedUsers) + "\n" + JSON.stringify(unclaimedAmounts),
    {
      encoding: "utf8",
      flag: "w",
      mode: 0o666,
    },
    (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
      }
    }
  );
}

async function getUnclaimedUsers(users) {
  const [unclaimedUsers, unclaimedAmounts] = await getUsersWithRewards(users);
  return [unclaimedUsers, unclaimedAmounts];
}

async function getUsersWithRewards(users) {
  let assets = [
    "0x291B5957c9CBe9Ca6f0b98281594b4eB495F4ec1",
    "0xa728C8f1CF7fC4d8c6d5195945C3760c87532724",
    "0xd4e420bBf00b0F409188b338c5D87Df761d6C894",
    "0xec72De30C3084023F7908002A2252a606CCe0B2c",
    "0xA26783eAd6C1f4744685c14079950622674ae8A8",
    "0x99272C6E2Baa601cEA8212b8fBAA7920A9f916F0",
    "0x4863cfaF3392F20531aa72CE19E5783f489817d6",
    "0x110C5A1494F0AB6C851abB72AA2efa3dA738aB72",
    "0x44932e3b1E662AdDE2F7bac6D5081C5adab908c6",
    "0x73Ada33D706085d6B93350B5e6aED6178905Fb8A",
    "0x5b4Ef67c63d091083EC4d30CFc4ac685ef051046",
    "0x474f83d77150bDDC6a6F34eEe4F5574EAfD05938",
    "0xEB20B07a9abE765252E6b45e8292b12CB553CcA6",
    "0xA4a45B550897dD5d8a44c68DBD245C5934EbAcd9",
    "0x606b2689ba4a9f798f449fa6495186021486dd9f",
    "0xd0b168fd6a4e220f1a8fa99de97f8f428587e178",
    "0xe1cf0d5a56c993c3c2a0442dd645386aeff1fc9a",
    "0xad15fec0026e28dfb10588fa35a383b07014e0c6",
  ];

  let output = [];
  let tempUsers = [];
  let unclaimedUsers = [];
  let unclaimedAmounts = [];
  for (let i = 0; i < users.length; i++) {
    tempUsers.push(users[i].id);
    if (tempUsers.length > 500 || i+1 >= users.length ) {
      let tempOutput = await getRewardsBalanceBatched(assets, tempUsers);
      output = tempOutput.concat(output);
      tempUsers = [];
    }
  }
  let totalAmount = 0n;
  for (let i = 0; i < users.length; i++) {
    if (output[i]["result"] > 0n) {
      unclaimedUsers.push(users[i].id.toString());
      unclaimedAmounts.push(output[i]["result"].toString());
      totalAmount += output[i]["result"];
    }
  }
  console.log(totalAmount, unclaimedUsers.length);
  return [unclaimedUsers, unclaimedAmounts];
}

try {
  looper();
} catch (err) {
  console.log(err);
}
