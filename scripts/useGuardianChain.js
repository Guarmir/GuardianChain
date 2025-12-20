const { ethers } = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [user] = await ethers.getSigners();

  const GuardianChain = await ethers.getContractAt(
    "GuardianChain",
    CONTRACT_ADDRESS
  );

  const documentHash = ethers.keccak256(
    ethers.toUtf8Bytes("meu primeiro documento protegido")
  );

  console.log("📄 Registrando documento...");
  const tx = await GuardianChain.registerHash(documentHash, 0, {
    value: ethers.parseEther("0.01"),
  });
  await tx.wait();

  console.log("✅ Documento registrado");

  const result = await GuardianChain.verifyHash(documentHash);

  console.log("🔍 Resultado da verificação:");
  console.log("Existe:", result[0]);
  console.log("Dono:", result[1]);
  console.log("Timestamp:", Number(result[2]));
  console.log("Tipo:", Number(result[3]));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
