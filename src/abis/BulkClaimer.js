export const BulkClaimer = [
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "bulkClaimRewardsOnBehalf",
      inputs: [
        { type: "address[]", name: "assets", internalType: "address[]" },
        { type: "address[]", name: "users", internalType: "address[]" },
      ],
    },
  ];