A    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.28;

    contract GuardianChain {
    address public owner;
    uint256 public fee;

    enum RecordType {
        DOCUMENT,
        EVENT,
        ALERT
    }

    struct Record {
        bool exists;
        address creator;
        uint256 timestamp;
        RecordType recordType;
    }

    mapping(bytes32 => Record) private records;
    mapping(address => bytes32[]) private userRecords;

    event HashRegistered(
        bytes32 indexed hash,
        address indexed creator,
        RecordType recordType,
        uint256 timestamp
    );

    constructor(uint256 _fee) {
        owner = msg.sender;
        fee = _fee;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function registerHash(bytes32 hash, RecordType recordType) external payable {
        require(msg.value >= fee, "Insufficient fee");
        require(!records[hash].exists, "Hash already registered");

        records[hash] = Record({
            exists: true,
            creator: msg.sender,
            timestamp: block.timestamp,
            recordType: recordType
        });

        userRecords[msg.sender].push(hash);

        emit HashRegistered(hash, msg.sender, recordType, block.timestamp);
    }

    function verifyHash(bytes32 hash)
        external
        view
        returns (
            bool exists,
            address creator,
            uint256 timestamp,
            RecordType recordType
        )
    {
        Record memory r = records[hash];
        return (r.exists, r.creator, r.timestamp, r.recordType);
    }

    function getMyRecords() external view returns (bytes32[] memory) {
        return userRecords[msg.sender];
    }

    function getFee() external view returns (uint256) {
        return fee;
    }

    function setFee(uint256 newFee) external onlyOwner {
        fee = newFee;
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    }
