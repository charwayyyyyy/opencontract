// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OpenContractRegistry.sol";

contract OpenContractRegistryTest is Test {
    OpenContractRegistry public registry;
    address public owner = address(1);
    address public officer = address(2);
    address public unauthorized = address(3);

    bytes32 public ocidHash = keccak256("ocds-demo-2026-000001");
    bytes32 public dataHash = keccak256("tender_payload_json_2026");
    bytes32 public docHash = keccak256("sha256_document_hash_final");

    function setUp() public {
        vm.prank(owner);
        registry = new OpenContractRegistry();

        vm.prank(owner);
        registry.authorizePublisher(officer);
    }

    function test_InitialOwner() public view {
        assertEq(registry.owner(), owner);
        assertTrue(registry.isAuthorizedPublisher(owner));
        assertTrue(registry.isAuthorizedPublisher(officer));
        assertFalse(registry.isAuthorizedPublisher(unauthorized));
    }

    function test_AnchorEventByOfficer() public {
        vm.prank(officer);
        uint256 index = registry.anchorEvent(
            ocidHash,
            "PROCUREMENT_CREATED",
            dataHash,
            docHash
        );

        assertEq(index, 0);
        assertEq(registry.getAnchorCount(ocidHash), 1);
        assertEq(registry.totalAnchors(), 1);

        (
            string memory eventType,
            bytes32 storedDataHash,
            bytes32 storedDocHash,
            address publisher,
            ,

        ) = registry.getAnchor(ocidHash, 0);

        assertEq(eventType, "PROCUREMENT_CREATED");
        assertEq(storedDataHash, dataHash);
        assertEq(storedDocHash, docHash);
        assertEq(publisher, officer);

        // Verify document
        (bool exists, bytes32 linkedOcid, address regBy, , ) = registry.verifyDocument(docHash);
        assertTrue(exists);
        assertEq(linkedOcid, ocidHash);
        assertEq(regBy, officer);
    }

    function test_UnauthorizedCannotAnchor() public {
        vm.prank(unauthorized);
        vm.expectRevert(AccessController.OnlyAuthorizedPublisher.selector);
        registry.anchorEvent(ocidHash, "PROCUREMENT_CREATED", dataHash, docHash);
    }

    function test_RevokePublisher() public {
        vm.prank(owner);
        registry.revokePublisher(officer);

        assertFalse(registry.isAuthorizedPublisher(officer));

        vm.prank(officer);
        vm.expectRevert(AccessController.OnlyAuthorizedPublisher.selector);
        registry.anchorEvent(ocidHash, "PROCUREMENT_CREATED", dataHash, docHash);
    }

    function test_MultipleEventsForSameOCID() public {
        vm.startPrank(officer);
        registry.anchorEvent(ocidHash, "PROCUREMENT_CREATED", dataHash, bytes32(0));
        registry.anchorEvent(ocidHash, "TENDER_PUBLISHED", keccak256("tender_data"), docHash);
        registry.anchorEvent(ocidHash, "AWARD_PUBLISHED", keccak256("award_data"), bytes32(0));
        vm.stopPrank();

        assertEq(registry.getAnchorCount(ocidHash), 3);
        assertEq(registry.totalAnchors(), 3);
    }
}
