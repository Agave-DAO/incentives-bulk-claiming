import dotenv from "dotenv";
import { users } from "../users.js";
import {
  getUserData,
  getUsersData,
  bulkClaim,
  client,
  address,
} from "./web3.js";

dotenv.config();

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

let borrowAssets = [
  //"0x291B5957c9CBe9Ca6f0b98281594b4eB495F4ec1", usdc
  "0xa728C8f1CF7fC4d8c6d5195945C3760c87532724",
  //"0xd4e420bBf00b0F409188b338c5D87Df761d6C894", wxdai
  "0xec72De30C3084023F7908002A2252a606CCe0B2c",
  //"0xA26783eAd6C1f4744685c14079950622674ae8A8", gno
  "0x99272C6E2Baa601cEA8212b8fBAA7920A9f916F0",
  //"0x4863cfaF3392F20531aa72CE19E5783f489817d6", wbtc
  "0x110C5A1494F0AB6C851abB72AA2efa3dA738aB72",
  //"0x44932e3b1E662AdDE2F7bac6D5081C5adab908c6", weth
  "0x73Ada33D706085d6B93350B5e6aED6178905Fb8A",
  //"0x5b4Ef67c63d091083EC4d30CFc4ac685ef051046", usdt
  "0x474f83d77150bDDC6a6F34eEe4F5574EAfD05938",
  //"0xEB20B07a9abE765252E6b45e8292b12CB553CcA6", eure
  "0xA4a45B550897dD5d8a44c68DBD245C5934EbAcd9",
  //"0x606b2689ba4a9f798f449fa6495186021486dd9f", wsteth
  "0xd0b168fd6a4e220f1a8fa99de97f8f428587e178",
  //"0xe1cf0d5a56c993c3c2a0442dd645386aeff1fc9a", sdai
  "0xad15fec0026e28dfb10588fa35a383b07014e0c6",
];

let depositAssets = [
  "0x291B5957c9CBe9Ca6f0b98281594b4eB495F4ec1",
  //"0xa728C8f1CF7fC4d8c6d5195945C3760c87532724",
  "0xd4e420bBf00b0F409188b338c5D87Df761d6C894",
  //"0xec72De30C3084023F7908002A2252a606CCe0B2c",
  "0xA26783eAd6C1f4744685c14079950622674ae8A8",
  //"0x99272C6E2Baa601cEA8212b8fBAA7920A9f916F0",
  "0x4863cfaF3392F20531aa72CE19E5783f489817d6",
  //"0x110C5A1494F0AB6C851abB72AA2efa3dA738aB72",
  "0x44932e3b1E662AdDE2F7bac6D5081C5adab908c6",
  //"0x73Ada33D706085d6B93350B5e6aED6178905Fb8A",
  "0x5b4Ef67c63d091083EC4d30CFc4ac685ef051046",
  //"0x474f83d77150bDDC6a6F34eEe4F5574EAfD05938",
  "0xEB20B07a9abE765252E6b45e8292b12CB553CcA6",
  //"0xA4a45B550897dD5d8a44c68DBD245C5934EbAcd9",
  "0x606b2689ba4a9f798f449fa6495186021486dd9f",
  //"0xd0b168fd6a4e220f1a8fa99de97f8f428587e178",
  "0xe1cf0d5a56c993c3c2a0442dd645386aeff1fc9a",
  //"0xad15fec0026e28dfb10588fa35a383b07014e0c6",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loopAsset() {
  for (let j = 0; j < assets.length; j++) {
    let count = 0;
    let tempUsers = [];
    for (let i = 0; i < users.length; i++) {
      let result = await getUserData(users[i].user, assets[j]);
      if (result > 0) {
        count++;
        tempUsers.push(users[i].user);
      }
      if (count >= 200 || i + 1 === users.length) {
        await bulkClaim([assets[j]], tempUsers);
        let x = [];
        tempUsers = x;
        count = 0;
      }
    }
  }
}

async function loopUsersWithDebt() {
  let tempUsers = [];
  for (let j = 0; j < users.length; j++) {
    if(users[j].totalDebtETH > 100000000000000000n){
      tempUsers.push(users[j].user);
    }
    if (tempUsers.length >= 16 || j+1 >= users.length) {
      await bulkClaim(assets, tempUsers);
      await sleep(25000);
      let x = [];
      tempUsers = x;
    }
  }
}

async function loopUsersWithoutDebt() {
  let tempUsers = [];
  for (let j = 0; j < users.length; j++) {
    if(users[j].totalDebtETH < 100000000000000000n && users[j].totalCollateralETH > 100000000000000000n){
      tempUsers.push(users[j].user);
    }
    if (tempUsers.length >= 25 || j+1 >= users.length) {
      await bulkClaim(depositAssets, tempUsers);
      await sleep(20000);
      let x = [];
      tempUsers = x;
    }
  }
}

async function loopAssetMulticall() {
  for (let j = 0; j < assets.length; j++) {
    let tempUsers = [];
    let assetUsers = await getUsersWithAsset(assets[j]);
    for (let i = 0; i < assetUsers.length; i++) {
      tempUsers.push(assetUsers[i]);
      if (tempUsers.length >= 150 || i + 1 === assetUsers.length) {
        await bulkClaim([assets[j]], tempUsers);
        await sleep(35000);
        let x = [];
        tempUsers = x;
      }
    }
  }
}

async function getUsersWithAsset(asset) {
  let output = [];
  let tempUsers = [];
  let relevantUsers = [];
  for (let i = 0; i < users.length; i++) {
    tempUsers.push(users[i].user);
    if (tempUsers.length > 500 || i+1 >= users.length ) {
      let tempOutput = await getUsersData(tempUsers, asset);
      output = tempOutput.concat(output);
      tempUsers = [];
    }
  }
  console.log(output[1]["result"])
  for (let i = 0; i < users.length; i++) {
    if (output[i]["result"] > 0n) {
      relevantUsers.push(users[i].user);
    }
  }
  console.log("asset: ",asset)
  console.log("relevant users: ", relevantUsers.length)
  console.log("last user: ", relevantUsers[relevantUsers.length-1])
  return relevantUsers;
}

//loopUsersWithoutDebt();
//loopAssetMulticall();
