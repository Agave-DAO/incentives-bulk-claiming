import fs from "fs";
import { IncentivesContract} from './web3.js';
import fetch from "node-fetch";

const GRAPHQL_URL =
  "https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai";

let users = [];
let maxUsers = 3000;

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

async function looper() {
  let skipN = 0;
  for (skipN; skipN < maxUsers; skipN = skipN + 100) {
    const newUsers = await fetchAllUsers(skipN);
    users = users.concat(newUsers);
  }
  console.log(users.length);
  await getUnclaimedUsers(users)
  fs.writeFile(
    "users.txt",
    JSON.stringify(unclaimedUsers)+ "\n"+ JSON.stringify(unclaimedAmounts),
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

async function fetchAllUsers(skipN) {
  // Construct a schema, using GraphQL schema language
  const querySchema = `
{
    users(orderBy:id ,skip:${skipN}) {
      id
    }
  } 
`;
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: querySchema,
    }),
  });
  
  const responseBody = await response.json();
  return responseBody.data.users;
}

let unclaimedUsers = [];
let unclaimedAmounts = [];

async function getUnclaimedUsers(users){
    const finished = await recursiveWeb3Query(users,0)
    if (finished) {
        console.log(unclaimedUsers.length, unclaimedAmounts.length)
        return [unclaimedUsers, unclaimedAmounts]
    }
}

async function recursiveWeb3Query(users, i){
    let user = users[i].id
    let assets =["0x291B5957c9CBe9Ca6f0b98281594b4eB495F4ec1","0xa728C8f1CF7fC4d8c6d5195945C3760c87532724","0xd4e420bBf00b0F409188b338c5D87Df761d6C894","0xec72De30C3084023F7908002A2252a606CCe0B2c","0xa286Ce70FB3a6269676c8d99BD9860DE212252Ef","0x5b0568531322759EAB69269a86448b39B47e2AE8","0xA26783eAd6C1f4744685c14079950622674ae8A8","0x99272C6E2Baa601cEA8212b8fBAA7920A9f916F0","0x4863cfaF3392F20531aa72CE19E5783f489817d6","0x110C5A1494F0AB6C851abB72AA2efa3dA738aB72","0x44932e3b1E662AdDE2F7bac6D5081C5adab908c6","0x73Ada33D706085d6B93350B5e6aED6178905Fb8A","0xA916A4891D80494c6cB0B49b11FD68238AAaF617","0x7388cbdeb284902E1e07be616F92Adb3660Ed3a4"]
    let result = await IncentivesContract.getRewardsBalance(assets, user)
    if (!result.isZero()) {
        console.log(i,' <> ',user,result.toString())
        unclaimedUsers.push(user)
        unclaimedAmounts.push(result.toString())
    }
    if(users.length - 1 === i) return unclaimedUsers
    //sleep(500)
    await recursiveWeb3Query(users,i+1)
    
}

try {
    looper();
} catch (err) {
  console.log(err);
}


