import { BaseIncentive } from "./abis/BaseIncentive.js";
import { BulkClaimer } from "./abis/BulkClaimer.js";
import { gnosis, gnosisChiado } from "viem/chains";
import { createPublicClient, createWalletClient, custom, http, getAddress } from "viem";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";

// config.js
import dotenv from "dotenv";
dotenv.config();

const account = (process.env.PRIVATE_KEY)? privateKeyToAccount(process.env.PRIVATE_KEY) : mnemonicToAccount(process.env.MNEMONIC);

const transport = http(process.env.RPC_GNOSIS);

export const client = createPublicClient({
  chain: gnosis,
  transport,
});

export const wallet = createWalletClient({
  account,
  chain: gnosis,
  transport,
});

export const [address] = await wallet.getAddresses();

// This can be an address or an ENS name
export const BaseIncentiveAddress = "0xfa255f5104f129B78f477e9a6D050a02f31A5D86";
const BulkClaimerAddress = "0xc777eb53b224ab27dd348d2a678bfd20ce913277";

const priorityFee = 1011000000n;
const gasFee = 10901000000n;

export async function getRewardsBalance(assets, userAddress) {
  return await client.readContract({
    address: BaseIncentiveAddress,
    abi: BaseIncentive,
    functionName: "getRewardsBalance",
    args: [assets, userAddress],
  });
}

export async function getRewardsBalanceBatched(assets, usersAddress) {
  let contractCalls = [];
  let output = [];
  for (let k = 0; k < usersAddress.length; k++) {
    contractCalls.push({
      address: BaseIncentiveAddress,
      abi: BaseIncentive,
      functionName: "getRewardsBalance",
      args: [assets, usersAddress[k]],
    });
    output.push("")
  }
  output = await client.multicall({
    contracts: contractCalls,
  });
  return output;
}

export function getUserData(userAddress, assetAddress) {
  return client.readContract({
    address: BaseIncentiveAddress,
    abi: BaseIncentive,
    functionName: "getUserAssetData",
    args: [userAddress, assetAddress],
  });
}

export async function getUsersData(usersAddress, assetAddress) {
  let contractCalls = [];
  let output = [];
  for (let k in usersAddress) {
    contractCalls.push({
      address: BaseIncentiveAddress,
      abi: BaseIncentive,
      functionName: "getUserAssetData",
      args: [usersAddress[k], assetAddress],
    });
    output.push("")
  }
  output = await client.multicall({
    contracts: contractCalls,
  });
  return output;
}

export async function bulkClaim(assetAddresses, usersAddresses) {
  console.log("claiming user: ", usersAddresses);
  const hash = await wallet.writeContract({
    address: BulkClaimerAddress,
    abi: BulkClaimer,
    functionName: "bulkClaimRewardsOnBehalf",
    args: [assetAddresses, usersAddresses],
    //  maxPriorityFeePerGas:  priorityFee,
  });
  return await client.waitForTransactionReceipt(
    {
      confirmations: 3,
      hash: hash
    }   
  )
}
