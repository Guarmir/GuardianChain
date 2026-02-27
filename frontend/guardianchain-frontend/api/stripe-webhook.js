import Stripe from "stripe";
import { buffer } from "micro";
import { ethers } from "ethers";
import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const CONTRACT_ADDRESS = "0x243C4438841087D9bA135D7c1C7f54Ee77F2Ab20";
const RPC_URL = process.env.POLYGON_RPC_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const email = session.customer_details.email;
    const fileHash = session.metadata.hash;

    try {
      // 🔹 Conectar Polygon
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(
        process.env.GUARDIANCHAIN_PRIVATE_KEY,
        provider
      );

      const abi = [
        {
          inputs: [
            { internalType: "bytes32", name: "proofHash", type: "bytes32" }
          ],
          name: "registerProof",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ];

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      // 🔹 Registrar na blockchain
      const tx = await contract.registerProof("0x" + fileHash);
      const receipt = await tx.wait();

      const txHash = tx.hash;

      // 🔹 Timestamp real da blockchain
      const block = await provider.getBlock(receipt.blockNumber);
      const blockTimestamp = new Date(block.timestamp * 1000).toISOString();

      // 🔹 Link oficial PolygonScan
      const polygonscanUrl = `https://polygonscan.com/tx/${txHash}`;

      // 🔹 Gerar PDF institucional
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("GuardianChain Digital Proof Certificate", 20, 20);

      doc.setFontSize(12);
      doc.text(
        "This document certifies that a digital proof has been permanently recorded on the Polygon Mainnet blockchain.",
        20,
        40
      );

      doc.text(`Network: Polygon Mainnet`, 20, 60);
      doc.text(`Contract: ${CONTRACT_ADDRESS}`, 20, 70);
      doc.text(`File Hash: ${fileHash}`, 20, 80);
      doc.text(`Transaction Hash: ${txHash}`, 20, 90);
      doc.text(`Timestamp (UTC): ${blockTimestamp}`, 20, 100);

      const qrDataUrl = await QRCode.toDataURL(polygonscanUrl);
      doc.addImage(qrDataUrl, "PNG", 20, 110, 50, 50);

      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

      // 🔹 Enviar Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"GuardianChain" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your GuardianChain Blockchain Certificate",
        text: `Your digital proof has been successfully recorded on Polygon Mainnet.\n\nTransaction: ${polygonscanUrl}`,
        attachments: [
          {
            filename: "guardianchain-certificate.pdf",
            content: pdfBuffer,
          },
        ],
      });

    } catch (err) {
      console.error("Processing error:", err);
      return res.status(500).send("Internal error");
    }
  }

  res.status(200).json({ received: true });
}