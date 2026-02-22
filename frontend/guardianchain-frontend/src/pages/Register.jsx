import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [hash, setHash] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function register() {
    try {
      setMsg("");
      setLoading(true);

      if (!hash || hash.length < 10) {
        setMsg("Informe um hash válido.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/register-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hash })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao registrar.");
      }

      setMsg("Registro realizado com sucesso!");

      // Redireciona para verify com hash na rota correta
      navigate("/verify/" + hash);

    } catch (err) {
      console.error(err);
      setMsg("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1>Registrar Prova</h1>

      <input
        style={styles.input}
        placeholder="Cole aqui o hash do arquivo"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />

      <button
        style={styles.button}
        onClick={register}
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrar"}
      </button>

      {msg && <p style={styles.msg}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    marginTop: "15px",
    padding: "14px 24px",
    fontSize: "16px",
    backgroundColor: "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  msg: {
    marginTop: "15px",
    fontWeight: "bold"
  }
};