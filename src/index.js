import fs from "fs";
import { IncentivesContract } from "./web3.js";
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
  await getUnclaimedUsers(users);
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

async function getUnclaimedUsers(users) {
  const finished = await recursiveWeb3Query(users, 0);
  if (finished) {
    console.log(unclaimedUsers.length, unclaimedAmounts.length);
    return [unclaimedUsers, unclaimedAmounts];
  }
}

async function recursiveWeb3Query(users, i) {
  let user = users[i].id;
  let assets = [
    "0x291b5957c9cbe9ca6f0b98281594b4eb495f4ec1",
    "0xa728c8f1cf7fc4d8c6d5195945c3760c87532724",
    "0xd4e420bbf00b0f409188b338c5d87df761d6c894",
    "0xec72de30c3084023f7908002a2252a606cce0b2c",
    "0xa286ce70fb3a6269676c8d99bd9860de212252ef",
    "0x5b0568531322759eab69269a86448b39b47e2ae8",
    "0xa26783ead6c1f4744685c14079950622674ae8a8",
    "0x99272c6e2baa601cea8212b8fbaa7920a9f916f0",
    "0x4863cfaf3392f20531aa72ce19e5783f489817d6",
    "0x110c5a1494f0ab6c851abb72aa2efa3da738ab72",
    "0x44932e3b1e662adde2f7bac6d5081c5adab908c6",
    "0x73ada33d706085d6b93350b5e6aed6178905fb8a",
    "0xa916a4891d80494c6cb0b49b11fd68238aaaf617",
    "0x7388cbdeb284902e1e07be616f92adb3660ed3a4",
  ];
  let result = await IncentivesContract.getRewardsBalance(assets, user);
  if (!result.isZero()) {
    console.log(i, " <> ", user, result.toString());
    unclaimedUsers.push(user);
    unclaimedAmounts.push(result.toString());
  }
  if (users.length - 1 === i) return unclaimedUsers;
  //sleep(500)
  await recursiveWeb3Query(users, i + 1);
}

try {
  looper();
} catch (err) {
  console.log(err);
}
