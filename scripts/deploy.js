const hre = require("hardhat");

async function main() {
  const GuardianChain = await hre.ethers.getContractFactory("GuardianChain");

  const contract = await GuardianChain.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("GuardianChain deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
