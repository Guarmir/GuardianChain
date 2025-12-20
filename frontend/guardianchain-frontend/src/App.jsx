import { useState } from "react";
import { ethers } from "ethers";
import {
  GUARDIANCHAIN_ADDRESS,
  GUARDIANCHAIN_ABI
} from "./contracts/GuardianChain";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [fee, setFee] = useState(null);

  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState("");

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("MetaMask não encontrada");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setStatus("Carteira conectada");

      const contract = new ethers.Contract(
        GUARDIANCHAIN_ADDRESS,
        GUARDIANCHAIN_ABI,
        signer
      );

      const f = await contract.getFee();
      setFee(f);
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar MetaMask");
    }
  }

  async function registerHash() {
    try {
      if (!input && !file) {
        alert("Digite um texto ou selecione um arquivo");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        GUARDIANCHAIN_ADDRESS,
        GUARDIANCHAIN_ABI,
        signer
      );

      let hash;
      if (file) {
        const buffer = await file.arrayBuffer();
        hash = ethers.keccak256(new Uint8Array(buffer));
      } else {
        hash = ethers.keccak256(
          ethers.toUtf8Bytes(input)
        );
      }

      const currentFee = fee ?? await contract.getFee();

      setStatus("Enviando transação...");

      const tx = await contract.registerHash(hash, 0, {
        value: currentFee
      });

      await tx.wait();

      setStatus("Hash registrado com sucesso!");
    } catch (err) {
      console.error(err);
      setStatus("Erro ao registrar hash");
    }
  }

  async function verifyHash() {
    try {
      if (!input && !file) {
        alert("Digite um texto ou selecione um arquivo");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        GUARDIANCHAIN_ADDRESS,
        GUARDIANCHAIN_ABI,
        provider
      );

      let hash;
      if (file) {
        const buffer = await file.arrayBuffer();
        hash = ethers.keccak256(new Uint8Array(buffer));
      } else {
        hash = ethers.keccak256(
          ethers.toUtf8Bytes(input)
        );
      }

      setVerifyStatus("Verificando...");

      const result = await contract.verifyHash(hash);

      setVerifyResult({
        exists: result.exists,
        creator: result.creator,
        timestamp: result.timestamp,
        recordType: result.recordType,
      });

      setVerifyStatus("");
    } catch (err) {
      console.error(err);
      setVerifyStatus("Erro ao verificar hash");
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>GuardianChain</h1>
      <p>
        Prova de existência e autoria on-chain.  
        Seu conteúdo permanece privado.
      </p>

      {!account ? (
        <button onClick={connectWallet}>
          Conectar carteira
        </button>
      ) : (
        <>
          <p><strong>Carteira:</strong> {account}</p>

          {fee && (
            <p>
              <strong>Custo por registro:</strong>{" "}
              {ethers.formatEther(fee)} ETH
            </p>
          )}

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: "1rem" }}
          />

          <input
            type="text"
            placeholder="Ou digite um texto"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <button onClick={registerHash}>
            Registrar Hash
          </button>

          <button
            onClick={verifyHash}
            style={{ marginLeft: "1rem" }}
          >
            Verificar Hash
          </button>

          <p>{status}</p>

          {verifyStatus && <p>{verifyStatus}</p>}

          {verifyResult && (
            <div style={{ marginTop: "1rem" }}>
              {verifyResult.exists ? (
                <>
                  <p><strong>Autor:</strong> {verifyResult.creator}</p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(
                      Number(verifyResult.timestamp) * 1000
                    ).toLocaleString()}
                  </p>
                  <p>
                    <strong>Tipo:</strong>{" "}
                    {verifyResult.recordType === 0 ? "Documento" : "Outro"}
                  </p>
                </>
              ) : (
                <p>❌ Hash não registrado</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
