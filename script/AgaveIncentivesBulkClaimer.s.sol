// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../contract/AgaveIncentivesBulkClaimer.sol";

contract MyScript is Script {

    AgaveIncentivesBulkClaimer constant claimer = AgaveIncentivesBulkClaimer(0xc777eB53b224AB27dd348d2a678bFD20cE913277);
    address[] assets = [0x291B5957c9CBe9Ca6f0b98281594b4eB495F4ec1,0xa728C8f1CF7fC4d8c6d5195945C3760c87532724,0xd4e420bBf00b0F409188b338c5D87Df761d6C894,0xec72De30C3084023F7908002A2252a606CCe0B2c,0xa286Ce70FB3a6269676c8d99BD9860DE212252Ef,0x5b0568531322759EAB69269a86448b39B47e2AE8,0xA26783eAd6C1f4744685c14079950622674ae8A8,0x99272C6E2Baa601cEA8212b8fBAA7920A9f916F0,0x4863cfaF3392F20531aa72CE19E5783f489817d6,0x110C5A1494F0AB6C851abB72AA2efa3dA738aB72,0x44932e3b1E662AdDE2F7bac6D5081C5adab908c6,0x73Ada33D706085d6B93350B5e6aED6178905Fb8A,0x5b4Ef67c63d091083EC4d30CFc4ac685ef051046,0x474f83d77150bDDC6a6F34eEe4F5574EAfD05938,0xA916A4891D80494c6cB0B49b11FD68238AAaF617,0x7388cbdeb284902E1e07be616F92Adb3660Ed3a4];
    address[] users = [0xb77d3295f5d62328c403043e3a6f0bab125a465b,
0x03ff7f8d129cae6e43903b5d2506ee5449cc7bb6,
0xde1d6645bdc43cb26958acbfcb5d61acd2c24ac3,
0x2329243cdbae615346b20c0b2d8e67e64d273963,
0x472e624a8a210dba4f8e0aaa4ad2ed9a68f43860,
0x91d8116fa60516cf25e258ef14deaacaf7a74127,
0xd4f42a7ce74947db59678324fd3b05ac47063d1d,
0xefbbfb08115b0f6a2825a9a186baa5777f5d2494,
0x9e07ecd4f5074a2eeac9c42df6508e3ec6373ef3,
0xe4b420f15d6d878dcd0df7120ac0fc1509ee9cab,
0x4ffad6ac852c0af0aa301376f4c5dea3a928b120,
0x0a67e6af5a8516cd687dc09671b98cd5a760264d,
0xdc2514c152863f9a737129257836c9a5040bb0b6,
0x89344efa2d9953accd3e907eab27b33542ed9e25,
0x762c33949e6aa8029ac122f983de675233d446b4,
0xec80b5494e873fd9a7c7bf2368d743b38eb0b9ea,
0x101a52c72e8b48e9be5bcbb63e7c1fd140861bae,
0xe1f8afc92644bfe77080d7dcb0f936f578e00f53,
0x4a03c2a9f3a11b1fc154c8bc9b825e0ff503b028,
0x1501943d0223db29690323b99a86a6e3cefa1abc,
0x2374da9a66e6321612fb9cca715359db1ae5ee8a,
0xb4c575308221caa398e0dd2cdeb6b2f10d7b000a,
0x47aa2df36e30ada9f8ceee54b3c8a60fd4787706,
0x4d5bf1a447fe552cc352353a12c7eaa0c4cf3124,
0xcba1a275e2d858ecffaf7a87f606f74b719a8a93,
0x1d1c6be4ea347d1a684a0df351fedd8ad6771ac0,
0x399463d77b5e9667cddb83ea765de96dba7cd231,
0xc8edbbc6c01b0d1077b12ba8eb740c3b1f28566c,
0x6120f29ccb5b1ddaa5a747235f257ef6cb47970f,
0x9709173ed6f194a953a77204359dbfd0e88a54d0];

        function run() external {
        uint256 deployerPrivateKey = vm.envString("MNEMONIC");
        vm.startBroadcast(deployerPrivateKey);

        address[] users = 
        claimer.bulkClaimRewardsOnBehalf(assets, users);

        vm.stopBroadcast();
    }
}

//forge script script/AgaveIncentivesBulkClaimer.s.sol:MyScript --rpc-url $RPC --broadcast --verify -vvvv
