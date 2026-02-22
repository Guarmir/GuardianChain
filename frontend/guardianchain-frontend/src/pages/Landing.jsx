import { Link } from "react-router-dom";

function Landing() {
  return (
    <div style={{ padding: "3rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>GuardianChain</h1>

      <h2>Prove que seu trabalho existia antes.</h2>

      <p>
        GuardianChain é um cartório digital on-chain que permite provar
        autoria e data de criação de arquivos, sem expor o conteúdo.
      </p>

      <ul>
        <li>🔒 Conteúdo permanece privado</li>
        <li>⛓️ Registro imutável em blockchain</li>
        <li>🌐 Verificação pública por link</li>
        <li>🕒 Prova de anterioridade</li>
      </ul>

      <p>
        <strong>Custo aproximado:</strong> ~ US$2 por registro
      </p>

      <Link to="/register">
        <button style={{ marginTop: "1rem", padding: "0.7rem 1.5rem" }}>
          Registrar prova agora
        </button>
      </Link>
    </div>
  );
}

export default Landing;
