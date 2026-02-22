import React from "react";
import { t } from "../i18n";

export default function Privacy() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px", lineHeight: "1.6" }}>
      <h1>{t("privacy.title")}</h1>
      <p><strong>{t("privacy.updated")}</strong></p>

      <h2>{t("privacy.dataTitle")}</h2>
      <p>{t("privacy.dataText")}</p>

      <ul>
        <li>{t("privacy.email")}</li>
        <li>{t("privacy.logs")}</li>
        <li>{t("privacy.hash")}</li>
      </ul>

      <p>{t("privacy.noStore")}</p>

      <h2>{t("privacy.purposeTitle")}</h2>
      <p>{t("privacy.purposeText")}</p>

      <h2>{t("privacy.contactTitle")}</h2>
      <p>suporte@guardianchain.online</p>
    </div>
  );
}