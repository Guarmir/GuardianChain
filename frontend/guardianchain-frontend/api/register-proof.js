import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({ error: "Hash required" });
    }

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const abi = [
      {
        inputs: [{ internalType: "bytes32", name: "proofHash", type: "bytes32" }],
        name: "registerProof",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      abi,
      wallet
    );

    const tx = await contract.registerProof("0x" + hash);
    await tx.wait();

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Blockchain error" });
  }
}