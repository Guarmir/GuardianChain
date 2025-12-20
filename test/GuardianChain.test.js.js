const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GuardianChain", function () {
  it("Should deploy the contract", async function () {
    const fee = ethers.parseEther("0.01"); // taxa inicial

    const GuardianChain = await ethers.getContractFactory("GuardianChain");
    const contract = await GuardianChain.deploy(fee);
    await contract.waitForDeployment();

    expect(contract.target).to.be.properAddress;
  });
});
