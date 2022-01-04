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
    let assets =["0x2eCd3E49C65b30cF6353B928a1D18DF5951AAa3E","0x95a21fCbb57ed54D3a5a706068b06cEE8637998a","0xb5A165d9177555418796638447396377Edf4C18a","0x3B8f9Bb5AD6E699943C7e0089FbC0735b2a4f18E","0xf7a28097fDf8c323Da826A9D98617a266A73c0Ef","0x1432672eaE70B126f9d1967860409Ea04ED238F2","0x34B8d5Bb7ED171aB5CEf266030B8181304344C51","0x8be80b0B794A45d4832784C9b63352eaff2096BB","0x5901102402A4C25c10308e8C7aADd780fD94bf42","0xa9Ddaa3F02188977329F676F7ae2E00463a026aa","0xfE31f6FF4366D2E17904e474605C2c6C42323380","0xADc675C94DD7AF3b08baC0fa7A8F42e3dc3739E8"];
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


