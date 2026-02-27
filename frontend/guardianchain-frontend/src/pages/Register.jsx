import { useState } from "react";
import { ethers } from "ethers";

export default function Register() {
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const arrayBuffer = await file.arrayBuffer();
    const hash = ethers.keccak256(new Uint8Array(arrayBuffer));

    setFileHash(hash.replace("0x", ""));
  };

  const handleCheckout = async () => {
    if (!fileHash) return;

    setLoading(true);

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hash: fileHash }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erro ao iniciar pagamento.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>Registrar Prova</h1>

      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />

      {fileName && (
        <p>
          Arquivo selecionado: <strong>{fileName}</strong>
        </p>
      )}

      {fileHash && (
        <>
          <p style={{ marginTop: "10px" }}>
            Hash gerado automaticamente:
          </p>

          <textarea
            value={fileHash}
            readOnly
            rows="3"
            style={{
              width: "400px",
              marginTop: "10px",
              padding: "10px",
            }}
          />

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading ? "Redirecionando..." : "Prosseguir para pagamento"}
          </button>
        </>
      )}

      <p style={{ marginTop: "30px", opacity: 0.6 }}>
        O conteúdo não é enviado para o servidor.
        Apenas o hash criptográfico é utilizado.
      </p>
    </div>
  );
}