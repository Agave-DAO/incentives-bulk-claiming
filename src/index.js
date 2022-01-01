import fs from "fs";
import { IncentivesContract} from './web3.js';
import fetch from "node-fetch";

const GRAPHQL_URL =
  "https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai";

let users = [];

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

async function looper() {
  let skipN = 0;
  for (skipN; skipN < 1200; skipN = skipN + 100) {
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
    let assets =["0x2ecd3e49c65b30cf6353b928a1d18df5951aaa3e","0x34b8d5bb7ed171ab5cef266030b8181304344c51","0x95a21fcbb57ed54d3a5a706068b06cee8637998a","0x8be80b0b794a45d4832784c9b63352eaff2096bb","0x3b8f9bb5ad6e699943c7e0089fbc0735b2a4f18e","0xa9ddaa3f02188977329f676f7ae2e00463a026aa","0xb5a165d9177555418796638447396377edf4c18a","0x5901102402a4c25c10308e8c7aadd780fd94bf42","0xf7a28097fdf8c323da826a9d98617a266a73c0ef","0xfe31f6ff4366d2e17904e474605c2c6c42323380"]
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


