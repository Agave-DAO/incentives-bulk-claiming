// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract AgaveIncentivesBulkClaimer {
    address public incentivesContract =
        0xfa255f5104f129B78f477e9a6D050a02f31A5D86;

    uint256 MAX_INT =
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    constructor() {}

    function bulkClaimRewardsOnBehalf(
        address[] calldata assets,
        address[] calldata users
    ) public {

        for (uint256 j = 0; j < users.length; j++) {
            (bool success,) = incentivesContract.call(
                abi.encodeWithSignature(
                    "bulkClaimRewardsOnBehalf(address[],uint256,address,address)",
                    assets,
                    MAX_INT,
                    users[j],
                    users[j]
                )
            );
            require(success);
        }
    }
}