import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import {
  GUARDIANCHAIN_ADDRESS,
  GUARDIANCHAIN_ABI
} from "../contracts/GuardianChain";
import { useEffect, useState } from "react";

function Verify() {
  const { hash } = useParams();
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("Verificando...");

  useEffect(() => {
    async function fetchRecord() {
      try {
        const provider = new ethers.JsonRpcProvider(
          "https://rpc.ankr.com/eth"
        );

        const contract = new ethers.Contract(
          GUARDIANCHAIN_ADDRESS,
          GUARDIANCHAIN_ABI,
          provider
        );

        const data = await contract.verifyHash(hash);

        setResult({
          exists: data.exists,
          creator: data.creator,
          timestamp: data.timestamp,
          recordType: data.recordType,
        });

        setStatus("");
      } catch (err) {
        console.error(err);
        setStatus("Erro ao verificar");
      }
    }

    fetchRecord();
  }, [hash]);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Verificação GuardianChain</h1>

      <p><strong>Hash:</strong> {hash}</p>

      {status && <p>{status}</p>}

      {result && (
        <>
          {result.exists ? (
            <>
              <p><strong>Status:</strong> ✅ Registrado</p>
              <p><strong>Autor:</strong> {result.creator}</p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(
                  Number(result.timestamp) * 1000
                ).toLocaleString()}
              </p>
              <p>
                <strong>Tipo:</strong>{" "}
                {result.recordType === 0 ? "Documento" : "Outro"}
              </p>
            </>
          ) : (
            <p>❌ Hash não registrado</p>
          )}
        </>
      )}
    </div>
  );
}

export default Verify;
