import { useParams } from "react-router-dom";
import { useEffect } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";

export default function Success() {
  const hash = "0x123TEST"; // depois vamos puxar real

  const generateAndSendPDF = async () => {
    const doc = new jsPDF();

    const verificationUrl = `http://localhost:5173/verify/${hash}`;

    const qrDataUrl = await QRCode.toDataURL(verificationUrl);

    doc.setFontSize(18);
    doc.text("GuardianChain Digital Proof Certificate", 20, 20);

    doc.setFontSize(12);
    doc.text("This document certifies that a digital proof has been registered on the Polygon blockchain.", 20, 40);

    doc.text(`Transaction Hash: ${hash}`, 20, 60);
    doc.text(`Verification URL: ${verificationUrl}`, 20, 70);

    doc.addImage(qrDataUrl, "PNG", 20, 90, 50, 50);

    const pdfBlob = doc.output("blob");

    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);

    reader.onloadend = async () => {
      const base64data = reader.result.split(",")[1];

      await fetch("/api/send-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "SEU_EMAIL_AQUI@gmail.com",
          pdfBase64: base64data
        })
      });
    };
  };

  useEffect(() => {
    generateAndSendPDF();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Proof Successfully Registered</h1>
      <p>Your digital proof has been permanently recorded.</p>
      <button onClick={generateAndSendPDF}>
        Download Certificate & Send Email
      </button>
    </div>
  );
}
