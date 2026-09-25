// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title AccessController
 * @notice Role-based access control for OpenContract anchoring operations.
 */
contract AccessController {
    address public owner;
    mapping(address => bool) public isAuthorizedPublisher;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event IsAuthorizedPublisherUpdated(address indexed publisher, bool indexed isAuthorized);
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
        emit OwnershipTransferred(address(0), msg.sender);
        isAuthorizedPublisher[msg.sender] = true;
        emit IsAuthorizedPublisherUpdated(msg.sender, true);
        emit PublisherAuthorized(msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function authorizePublisher(address publisher) external onlyOwner {
        if (publisher == address(0)) revert InvalidAddress();
        isAuthorizedPublisher[publisher] = true;
        emit IsAuthorizedPublisherUpdated(publisher, true);
        emit PublisherAuthorized(publisher);
    }

    function revokePublisher(address publisher) external onlyOwner {
        if (publisher == address(0)) revert InvalidAddress();
        isAuthorizedPublisher[publisher] = false;
        emit IsAuthorizedPublisherUpdated(publisher, false);
        emit PublisherRevoked(publisher);
    }
}
