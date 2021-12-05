import fetch from "node-fetch";
import fs from "fs";
import { IncentivesContract} from './web3.js';
import BigNumber from 'ethers'

const GRAPHQL_URL =
  "https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai";

let users = [];

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

async function looper() {
  let skipN = 0;
  for (skipN; skipN < 799; skipN = skipN + 100) {
    const newUsers = await fetchAllUsers(skipN);
    users = users.concat(newUsers);
  }
  console.log(users.length);
  await getUnclaimedUsers(users)
  fs.writeFile(
    "users.txt",
    JSON.stringify(JSON.stringify(unclaimedUsers)),
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

async function getUnclaimedUsers(users){
    const finished = await recursiveWeb3Query(users,0)
    if (finished) {
        console.log(unclaimedUsers.length)
        return unclaimedUsers
    }
}

async function recursiveWeb3Query(users, i){
    let user = users[i].id
    let result = await IncentivesContract.getUserUnclaimedRewards(user)
    if (!result.isZero()) {
        console.log(i,' <> ',user,result.toString())
        unclaimedUsers.push({"user": user, "amount":result.toString()})
    }
    if(users.length - 1 === i) return unclaimedUsers
    sleep(500)
    await recursiveWeb3Query(users,i+1)
    
}

try {
  looper();
} catch (err) {
  console.log(err);
}


