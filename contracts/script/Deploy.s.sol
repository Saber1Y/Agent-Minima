// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {HonkVerifier} from "../src/UltraHonkVerifier.sol";
import {AgentAccount} from "../src/AgentAccount.sol";
import {MockToken} from "../src/MockToken.sol";

contract Deploy is Script {
    address constant ENTRY_POINT = 0x0000000071727De22E5E9d8BAf0edAc6f37da032;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        HonkVerifier verifier = new HonkVerifier();
        AgentAccount account = new AgentAccount(ENTRY_POINT, address(verifier));
        MockToken token = new MockToken(deployer, 1_000_000 * 10 ** 18);

        vm.stopBroadcast();

        console.log("UltraHonkVerifier:", address(verifier));
        console.log("AgentAccount:", address(account));
        console.log("MockToken:", address(token));
        console.log("Owner:", deployer);
    }
}
