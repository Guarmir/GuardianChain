// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GuardianChain {
    struct Proof {
        address author;
        uint256 timestamp;
    }

    mapping(bytes32 => Proof) private proofs;

    event ProofRegistered(address indexed author, bytes32 indexed hash);

    function registerProof(bytes32 hash) external {
        require(proofs[hash].timestamp == 0, "Already registered");
        proofs[hash] = Proof(msg.sender, block.timestamp);
        emit ProofRegistered(msg.sender, hash);
    }

    function getProof(bytes32 hash) external view returns (address, uint256) {
        Proof memory p = proofs[hash];
        require(p.timestamp != 0, "Proof not found");
        return (p.author, p.timestamp);
    }
}
