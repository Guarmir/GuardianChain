import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
      <h1>Proof Successfully Registered</h1>

      <p style={{ marginTop: "10px", fontSize: "18px" }}>
        Your digital proof has been permanently recorded on the Polygon
        blockchain.
      </p>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>

      <p style={{ marginTop: "20px", fontSize: "14px", opacity: 0.6 }}>
        You will be redirected automatically in 5 seconds.
      </p>
    </div>
  );
}