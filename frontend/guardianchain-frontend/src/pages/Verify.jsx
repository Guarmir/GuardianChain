import { useParams } from "react-router-dom";

export default function Verify() {
  const { hash } = useParams();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Proof Verification</h1>
      <p>Transaction Hash:</p>
      <strong>{hash}</strong>

      <div style={{ marginTop: "30px" }}>
        <a
          href={`https://polygonscan.com/tx/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Blockchain Explorer
        </a>
      </div>
    </div>
  );
}
