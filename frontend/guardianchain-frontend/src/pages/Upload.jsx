import { useState } from "react";

const BACKEND_URL = "https://guardianchain-backend.onrender.com";

async function generateHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function payWithStripe() {
    if (!file) {
      setMsg("Selecione um arquivo primeiro.");
      return;
    }

    try {
      setLoading(true);
      setMsg("Gerando hash do arquivo...");

      const proofHash = await generateHash(file);

      setMsg("Redirecionando para pagamento seguro (Pix / Cartão)...");

      const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofHash })
      });

      const data = await res.json();
      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      setMsg("Erro ao iniciar pagamento.");
    } finally {
      setLoading(false);
    }
  }

  function payWithCrypto() {
    if (!file) {
      setMsg("Selecione um arquivo primeiro.");
      return;
    }

    setMsg("Pagamento com Cripto será ativado em breve.");
    // aqui entra MetaMask no próximo passo
  }

  return (
    <div style={styles.container}>
      <h1>Register Digital Proof</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: 10 }}
      />

      <p style={styles.status}>
        {file ? (
          <>Arquivo selecionado: <b>{file.name}</b></>
        ) : (
          "Nenhum arquivo escolhido"
        )}
      </p>

      <div style={styles.buttons}>
        <button
          onClick={payWithStripe}
          style={styles.stripeButton}
          disabled={loading}
        >
          {loading ? "Processando..." : "Pagar com Pix / Cartão – $3"}
        </button>

        <button
          onClick={payWithCrypto}
          style={styles.cryptoButton}
          disabled={loading}
        >
          Pagar com Cripto – $3
        </button>
      </div>

      {msg && <p style={styles.msg}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 520,
    margin: "80px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif"
  },
  status: {
    margin: "12px 0",
    color: "#444"
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16
  },
  stripeButton: {
    padding: "14px 22px",
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    background: "#1e40af",
    color: "#fff",
    cursor: "pointer"
  },
  cryptoButton: {
    padding: "14px 22px",
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    background: "#065f46",
    color: "#fff",
    cursor: "pointer"
  },
  msg: {
    marginTop: 16,
    fontWeight: "bold"
  }
};
