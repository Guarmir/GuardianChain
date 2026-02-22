import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "80px",
        padding: "30px 20px",
        borderTop: "1px solid #ddd",
        textAlign: "center",
        fontSize: "14px",
        color: "#666"
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        © {new Date().getFullYear()} GuardianChain
      </div>

      <div>
        <Link to="/terms" style={{ margin: "0 10px" }}>
          Terms
        </Link>
        |
        <Link to="/privacy" style={{ margin: "0 10px" }}>
          Privacy
        </Link>
        |
        <Link to="/refund-policy" style={{ margin: "0 10px" }}>
          Refund Policy
        </Link>
      </div>
    </footer>
  );
}