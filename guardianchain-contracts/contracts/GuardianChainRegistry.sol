// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GuardianChainRegistry {

    event DocumentRegistered(
        address indexed user,
        bytes32 indexed documentHash,
        uint256 timestamp
    );

    mapping(bytes32 => uint256) private registeredDocuments;

    function registerDocument(bytes32 documentHash) external {
        require(documentHash != bytes32(0), "Invalid hash");
        require(registeredDocuments[documentHash] == 0, "Already registered");

        registeredDocuments[documentHash] = block.timestamp;

        emit DocumentRegistered(msg.sender, documentHash, block.timestamp);
    }

    function getDocumentTimestamp(bytes32 documentHash)
        external
        view
        returns (uint256)
    {
        return registeredDocuments[documentHash];
    }
}