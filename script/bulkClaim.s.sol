// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {AgaveIncentivesBulkClaimer} from "../contract/AgaveIncentivesBulkClaimer.sol";
import "../contract/IMultiSendCallOnly.sol";
import "../contract/IBaseIncentives.sol";

contract BulkClaimScript is Script {
    IMultiSendCallOnly multisend;
    IBaseIncentives incentive;
    AgaveIncentivesBulkClaimer bulkClaimer;

    address[] assets = [
        0x291B5957c9CBe9Ca6f0b98281594b4eB495F4ec1,
        0xa728C8f1CF7fC4d8c6d5195945C3760c87532724,
        0xd4e420bBf00b0F409188b338c5D87Df761d6C894,
        0xec72De30C3084023F7908002A2252a606CCe0B2c,
        0xa286Ce70FB3a6269676c8d99BD9860DE212252Ef,
        0x5b0568531322759EAB69269a86448b39B47e2AE8,
        0xA26783eAd6C1f4744685c14079950622674ae8A8,
        0x99272C6E2Baa601cEA8212b8fBAA7920A9f916F0,
        0x4863cfaF3392F20531aa72CE19E5783f489817d6,
        0x110C5A1494F0AB6C851abB72AA2efa3dA738aB72,
        0x44932e3b1E662AdDE2F7bac6D5081C5adab908c6,
        0x73Ada33D706085d6B93350B5e6aED6178905Fb8A,
        0xA916A4891D80494c6cB0B49b11FD68238AAaF617,
        0x7388cbdeb284902E1e07be616F92Adb3660Ed3a4
    ];
    uint256 deployerPrivateKey = 0;

    function run() external {
        /*//////////////////////////////////////////////////////////////
                                KEY MANAGEMENT
        //////////////////////////////////////////////////////////////*/

        string memory mnemonic = vm.envString("MNEMONIC");

        if (bytes(mnemonic).length > 30) {
            deployerPrivateKey = vm.deriveKey(mnemonic, 0);
        } else {
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        }
        vm.rememberKey(deployerPrivateKey);

        incentive = IBaseIncentives(0xfa255f5104f129B78f477e9a6D050a02f31A5D86);
        bulkClaimer = AgaveIncentivesBulkClaimer(incentive.BULK_CLAIMER());

        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/users.json");
        string memory json = vm.readFile(path);
        bytes memory usersP = vm.parseJson(json);
        address[] memory users = abi.decode(usersP, (address[]));

        /*//////////////////////////////////////////////////////////////
                                OPERATIONS
        //////////////////////////////////////////////////////////////*/
        vm.startBroadcast(deployerPrivateKey);
        console2.log("Users: %s", users.length);
        claimableUsers(users);

        vm.stopBroadcast();
    }

    function claimableUsers(
        address[] memory users
    ) public {
        uint256 i = 0;
        uint256 n = 0;
        address[] memory cUsers = new address[](30);
        while (n < users.length) {
            cUsers[i] = users[n];
            i++;
            n++;
            if (i >= 30 || n == users.length) {
                claimMultiple(cUsers);
                i = 0;
            }
        }
    }

    function claimMultiple(
        address[] memory users
    ) internal {
        bulkClaimer.bulkClaimRewardsOnBehalf(assets, users);
    }
}
