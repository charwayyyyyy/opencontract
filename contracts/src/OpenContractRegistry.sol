// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./AccessController.sol";

/**
 * @title OpenContractRegistry
 * @notice Immutable EVM registry for public procurement event anchoring and document verification.
 * Public money should leave a public trail.
 */
contract OpenContractRegistry is AccessController {
    struct AnchorRecord {
        bytes32 ocidHash;
        string eventType;
        bytes32 dataHash;
        bytes32 documentHash;
        address publisher;
        uint256 timestamp;
        uint256 blockNumber;
    }

    struct DocumentRecord {
        bytes32 ocidHash;
        address registeredBy;
        uint256 registeredAt;
        uint256 blockNumber;
        bool exists;
    }

    // ocidHash => array of AnchorRecord
    mapping(bytes32 => AnchorRecord[]) private _anchors;

    // documentHash (SHA-256) => DocumentRecord
    mapping(bytes32 => DocumentRecord) public registeredDocuments;

    // Total anchors counter
    uint256 public totalAnchors;

    event EventAnchored(
        bytes32 indexed ocidHash,
        string eventType,
        bytes32 dataHash,
        bytes32 indexed documentHash,
        address indexed publisher,
        uint256 timestamp,
        uint256 blockNumber
    );

    event DocumentRegistered(
        bytes32 indexed documentHash,
        bytes32 indexed ocidHash,
        address indexed publisher,
        uint256 timestamp
    );

    error InvalidDataHash();
    error AnchorIndexOutOfBounds();

    /**
     * @notice Anchors a procurement lifecycle event to the blockchain.
     * @param ocidHash Cryptographic keccak256 hash of the OCID.
     * @param eventType Lifecycle stage (e.g. PROCUREMENT_CREATED, TENDER_PUBLISHED, AWARD_PUBLISHED, etc.).
     * @param dataHash Cryptographic hash of the canonical event payload.
     * @param documentHash Optional SHA-256 hash of an associated document (0 if none).
     */
    function anchorEvent(
        bytes32 ocidHash,
        string calldata eventType,
        bytes32 dataHash,
        bytes32 documentHash
    ) external onlyPublisher returns (uint256 anchorIndex) {
        if (dataHash == bytes32(0)) revert InvalidDataHash();

        AnchorRecord memory record = AnchorRecord({
            ocidHash: ocidHash,
            eventType: eventType,
            dataHash: dataHash,
            documentHash: documentHash,
            publisher: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        _anchors[ocidHash].push(record);
        anchorIndex = _anchors[ocidHash].length - 1;
        totalAnchors++;

        emit EventAnchored(
            ocidHash,
            eventType,
            dataHash,
            documentHash,
            msg.sender,
            block.timestamp,
            block.number
        );

        if (documentHash != bytes32(0) && !registeredDocuments[documentHash].exists) {
            registeredDocuments[documentHash] = DocumentRecord({
                ocidHash: ocidHash,
                registeredBy: msg.sender,
                registeredAt: block.timestamp,
                blockNumber: block.number,
                exists: true
            });

            emit DocumentRegistered(
                documentHash,
                ocidHash,
                msg.sender,
                block.timestamp
            );
        }
    }

    /**
     * @notice Verifies whether a document SHA-256 hash was anchored.
     * @param documentHash The SHA-256 fingerprint of the document.
     */
    function verifyDocument(bytes32 documentHash)
        external
        view
        returns (
            bool exists,
            bytes32 ocidHash,
            address registeredBy,
            uint256 registeredAt,
            uint256 blockNumber
        )
    {
        DocumentRecord memory doc = registeredDocuments[documentHash];
        return (
            doc.exists,
            doc.ocidHash,
            doc.registeredBy,
            doc.registeredAt,
            doc.blockNumber
        );
    }

    /**
     * @notice Retrieves the number of anchored events for a given OCID hash.
     */
    function getAnchorCount(bytes32 ocidHash) external view returns (uint256) {
        return _anchors[ocidHash].length;
    }

    /**
     * @notice Retrieves a specific anchor record by OCID hash and index.
     */
    function getAnchor(bytes32 ocidHash, uint256 index)
        external
        view
        returns (
            string memory eventType,
            bytes32 dataHash,
            bytes32 documentHash,
            address publisher,
            uint256 timestamp,
            uint256 blockNumber
        )
    {
        if (index >= _anchors[ocidHash].length) revert AnchorIndexOutOfBounds();
        AnchorRecord memory r = _anchors[ocidHash][index];
        return (
            r.eventType,
            r.dataHash,
            r.documentHash,
            r.publisher,
            r.timestamp,
            r.blockNumber
        );
    }
}
