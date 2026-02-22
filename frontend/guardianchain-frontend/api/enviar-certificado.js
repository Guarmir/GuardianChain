import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email, hash } = req.body;

    if (!email || !hash) {
      return res.status(400).json({ error: "Email e hash são obrigatórios" });
    }

    // 🌍 Detectar idioma automaticamente
    const acceptLanguage = req.headers["accept-language"] || "";
    const lang = acceptLanguage.toLowerCase().includes("pt") ? "pt" : "en";

    const texts = {
      pt: {
        title: "Certificado de Prova Digital GuardianChain",
        description:
          "Este documento certifica que a prova digital foi registrada na blockchain Polygon.",
        transaction: "Hash da Transação:",
        verification: "URL de Verificação:",
        subject: "Seu Certificado de Prova Digital",
        body: "Seu certificado está anexado neste email."
      },
      en: {
        title: "GuardianChain Digital Proof Certificate",
        description:
          "This document certifies that a digital proof has been registered on the Polygon blockchain.",
        transaction: "Transaction Hash:",
        verification: "Verification URL:",
        subject: "Your Digital Proof Certificate",
        body: "Your certificate is attached to this email."
      }
    };

    const t = texts[lang];

    const BASE_URL =
      process.env.BASE_URL || "https://guardianchain.online";

    const verificationUrl = `${BASE_URL}/verify/${hash}`;

    // 📄 Gerar PDF
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(t.title, 20, 30);

    doc.setFontSize(12);
    doc.text(t.description, 20, 50);
    doc.text(`${t.transaction} ${hash}`, 20, 70);
    doc.text(`${t.verification} ${verificationUrl}`, 20, 90);

    // QR Code
    const qrImage = await QRCode.toDataURL(verificationUrl);
    doc.addImage(qrImage, "PNG", 20, 110, 50, 50);

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // 📧 Configurar transporte
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 📤 Enviar email
    await transporter.sendMail({
      from: `"GuardianChain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: t.subject,
      text: t.body,
      attachments: [
        {
          filename: "guardianchain-certificate.pdf",
          content: pdfBuffer
        }
      ]
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar certificado:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
}
