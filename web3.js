
import ethers from "ethers";
require('dotenv').config();;


const abi = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "rewardToken", internalType: "contract IERC20" },
      { type: "address", name: "emissionManager", internalType: "address" },
    ],
  },
  {
    type: "event",
    name: "AssetConfigUpdated",
    inputs: [
      {
        type: "address",
        name: "asset",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "emission",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetIndexUpdated",
    inputs: [
      {
        type: "address",
        name: "asset",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "index",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimerSet",
    inputs: [
      { type: "address", name: "user", internalType: "address", indexed: true },
      {
        type: "address",
        name: "claimer",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DistributionEndUpdated",
    inputs: [
      {
        type: "uint256",
        name: "newDistributionEnd",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardsAccrued",
    inputs: [
      { type: "address", name: "user", internalType: "address", indexed: true },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardsClaimed",
    inputs: [
      { type: "address", name: "user", internalType: "address", indexed: true },
      { type: "address", name: "to", internalType: "address", indexed: true },
      {
        type: "address",
        name: "claimer",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardsVaultUpdated",
    inputs: [
      {
        type: "address",
        name: "vault",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UserIndexUpdated",
    inputs: [
      { type: "address", name: "user", internalType: "address", indexed: true },
      {
        type: "address",
        name: "asset",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "index",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "DISTRIBUTION_END",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "EMISSION_MANAGER",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint8", name: "", internalType: "uint8" }],
    name: "PRECISION",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "REVISION",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "REWARD_TOKEN",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint104", name: "emissionPerSecond", internalType: "uint104" },
      { type: "uint104", name: "index", internalType: "uint104" },
      { type: "uint40", name: "lastUpdateTimestamp", internalType: "uint40" },
    ],
    name: "assets",
    inputs: [{ type: "address", name: "", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "claimRewards",
    inputs: [
      { type: "address[]", name: "assets", internalType: "address[]" },
      { type: "uint256", name: "amount", internalType: "uint256" },
      { type: "address", name: "to", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "claimRewardsOnBehalf",
    inputs: [
      { type: "address[]", name: "assets", internalType: "address[]" },
      { type: "uint256", name: "amount", internalType: "uint256" },
      { type: "address", name: "user", internalType: "address" },
      { type: "address", name: "to", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "configureAssets",
    inputs: [
      { type: "address[]", name: "assets", internalType: "address[]" },
      {
        type: "uint256[]",
        name: "emissionsPerSecond",
        internalType: "uint256[]",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256", name: "", internalType: "uint256" },
      { type: "uint256", name: "", internalType: "uint256" },
      { type: "uint256", name: "", internalType: "uint256" },
    ],
    name: "getAssetData",
    inputs: [{ type: "address", name: "asset", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "getClaimer",
    inputs: [{ type: "address", name: "user", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getDistributionEnd",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getRewardsBalance",
    inputs: [
      { type: "address[]", name: "assets", internalType: "address[]" },
      { type: "address", name: "user", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "getRewardsVault",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getUserAssetData",
    inputs: [
      { type: "address", name: "user", internalType: "address" },
      { type: "address", name: "asset", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getUserUnclaimedRewards",
    inputs: [{ type: "address", name: "_user", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "handleAction",
    inputs: [
      { type: "address", name: "user", internalType: "address" },
      { type: "uint256", name: "totalSupply", internalType: "uint256" },
      { type: "uint256", name: "userBalance", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "initialize",
    inputs: [
      { type: "address", name: "rewardsVault", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setClaimer",
    inputs: [
      { type: "address", name: "user", internalType: "address" },
      { type: "address", name: "caller", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setDistributionEnd",
    inputs: [
      { type: "uint256", name: "distributionEnd", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setRewardsVault",
    inputs: [
      { type: "address", name: "rewardsVault", internalType: "address" },
    ],
  },
];

// This can be an address or an ENS name
const address = "0xfa255f5104f129b78f477e9a6d050a02f31a5d86";

// Read-Only; By connecting to a Provider, allows:
// - Any constant function
// - Querying Filters
// - Populating Unsigned Transactions for non-constant methods
// - Estimating Gas for non-constant (as an anonymous sender)
// - Static Calling non-constant methods (as anonymous sender)

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC) 

export const IncentivesContract = new ethers.Contract(address, abi, provider);

