import React from "react";
import { t } from "../i18n";

export default function RefundPolicy() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px", lineHeight: "1.6" }}>
      <h1>{t("refund.title")}</h1>
      <p><strong>{t("refund.updated")}</strong></p>

      <p>{t("refund.text1")}</p>
      <p>{t("refund.text2")}</p>
    </div>
  );
}