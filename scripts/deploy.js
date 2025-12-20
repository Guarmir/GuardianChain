const hre = require("hardhat");

async function main() {
  const fee = hre.ethers.parseEther("0.01");

  const GuardianChain = await hre.ethers.getContractFactory("GuardianChain");
  const guardianChain = await GuardianChain.deploy(fee);

  await guardianChain.waitForDeployment();

  console.log("✅ GuardianChain deployed to:", guardianChain.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
