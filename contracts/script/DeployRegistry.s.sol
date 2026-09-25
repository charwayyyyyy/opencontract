// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {OpenContractRegistry} from "../src/OpenContractRegistry.sol";

contract DeployRegistryScript is Script {
    function run() external returns (OpenContractRegistry registry) {
        vm.startBroadcast();
        registry = new OpenContractRegistry();
        vm.stopBroadcast();
    }
}
