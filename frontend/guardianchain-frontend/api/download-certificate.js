import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default async function handler(req, res) {
  try {
    const { hash } = req.query;

    if (!hash) {
      return res.status(400).json({ error: "Hash obrigatória" });
    }

    const acceptLanguage = req.headers["accept-language"] || "";
    const lang = acceptLanguage.toLowerCase().includes("pt") ? "pt" : "en";

    const texts = {
      pt: {
        title: "Certificado de Prova Digital GuardianChain",
        description:
          "Este documento certifica que a prova digital foi registrada na blockchain Polygon.",
        transaction: "Hash da Transação:",
        verification: "URL de Verificação:"
      },
      en: {
        title: "GuardianChain Digital Proof Certificate",
        description:
          "This document certifies that a digital proof has been registered on the Polygon blockchain.",
        transaction: "Transaction Hash:",
        verification: "Verification URL:"
      }
    };

    const t = texts[lang];

    const BASE_URL =
      process.env.BASE_URL || "https://guardianchain.online";

    const verificationUrl = `${BASE_URL}/verify/${hash}`;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(t.title, 20, 30);

    doc.setFontSize(12);
    doc.text(t.description, 20, 50);
    doc.text(`${t.transaction} ${hash}`, 20, 70);
    doc.text(`${t.verification} ${verificationUrl}`, 20, 90);

    const qrImage = await QRCode.toDataURL(verificationUrl);
    doc.addImage(qrImage, "PNG", 20, 110, 50, 50);

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=guardianchain-certificate.pdf"
    );

    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).json({ error: "Erro ao gerar PDF" });
  }
}
