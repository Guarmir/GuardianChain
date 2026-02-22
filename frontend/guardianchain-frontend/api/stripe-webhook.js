import Stripe from "stripe";
import { buffer } from "micro";
import { ethers } from "ethers";
import nodemailer from "nodemailer";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const CONTRACT_ADDRESS = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";
const RPC_URL = "https://polygon-rpc.com";

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
    const hash = session.metadata.hash;

    try {
      // 🔹 Registrar na blockchain
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

      const tx = await contract.registerProof("0x" + hash);
      await tx.wait();

      // 🔹 Gerar PDF
      const verificationUrl = `${process.env.BASE_URL}/verify/${hash}`;
      const doc = new jsPDF();

      const qrDataUrl = await QRCode.toDataURL(verificationUrl);

      doc.setFontSize(18);
      doc.text("GuardianChain Digital Proof Certificate", 20, 20);
      doc.setFontSize(12);
      doc.text(
        "This document certifies that a digital proof has been registered on the Polygon blockchain.",
        20,
        40
      );
      doc.text(`Transaction Hash: ${hash}`, 20, 60);
      doc.text(`Verification URL: ${verificationUrl}`, 20, 70);
      doc.addImage(qrDataUrl, "PNG", 20, 90, 50, 50);

      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

      // 🔹 Enviar email
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
        subject: "Your GuardianChain Certificate",
        text: "Your digital proof has been successfully registered.",
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