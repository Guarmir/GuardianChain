import hre from "hardhat";

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("GuardianChainRegistry");

  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("===========================================");
  console.log("GuardianChainRegistry deployed successfully");
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", address);
  console.log("===========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});