// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {IXDaiForeignBridge} from "../contract/AgaveIncentivesBulkClaimer.sol";
import "../contract/IMultiSendCallOnly.sol";
import "../contract/IBaseIncentives.sol";

contract BulkClaimScript is Script {
    IMultiSendCallOnly multisend;
    IBaseIncentives incentive;

    function run() external {
        /*//////////////////////////////////////////////////////////////
                                KEY MANAGEMENT
        //////////////////////////////////////////////////////////////*/

        uint256 deployerPrivateKey = 0;
        string memory mnemonic = vm.envString("MNEMONIC");

        if (bytes(mnemonic).length > 30) {
            deployerPrivateKey = vm.deriveKey(mnemonic, 0);
        } else {
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        }

        multisend = IMultiSendCallOnly(
            0x40A2aCCbd92BCA938b02010E17A5b8929b49130D
        );
        incentive = IBaseIncentives(0xfa255f5104f129B78f477e9a6D050a02f31A5D86);

        string memory root = vm.projectRoot();
        string memory path = string.concat(
            root,
            "users.json"
        );
        string memory json = vm.readFile(path);
        bytes memory users = vm.parseJson(json);

        /*//////////////////////////////////////////////////////////////
                                OPERATIONS
        //////////////////////////////////////////////////////////////*/

        address operator = vm.rememberKey(deployerPrivateKey);

        // Action Selection

        vm.startBroadcast(deployerPrivateKey);
        consoele2.log(users.length);
        //claimMultiple(asset, users);

        vm.stopBroadcast();
    }

    function claimable() public view returns (uint256) {
       return incentive.getUserAssetData(user, asset);
    }

    function claimMultiple(asset, users) internal {
        bulkClaimer.bulkClaimRewardsOnBehalf([asset], users);
    }

}
