// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AccessController
 * @notice Role-based access control for OpenContract anchoring operations.
 */
contract AccessController {
    address public owner;
    mapping(address => bool) public isAuthorizedPublisher;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event PublisherAuthorized(address indexed publisher);
    event PublisherRevoked(address indexed publisher);

    error OnlyOwner();
    error OnlyAuthorizedPublisher();
    error InvalidAddress();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    modifier onlyPublisher() {
        if (!isAuthorizedPublisher[msg.sender] && msg.sender != owner) {
            revert OnlyAuthorizedPublisher();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
        isAuthorizedPublisher[msg.sender] = true;
        emit OwnershipTransferred(address(0), msg.sender);
        emit PublisherAuthorized(msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function authorizePublisher(address publisher) external onlyOwner {
        if (publisher == address(0)) revert InvalidAddress();
        isAuthorizedPublisher[publisher] = true;
        emit PublisherAuthorized(publisher);
    }

    function revokePublisher(address publisher) external onlyOwner {
        isAuthorizedPublisher[publisher] = false;
        emit PublisherRevoked(publisher);
    }
}
