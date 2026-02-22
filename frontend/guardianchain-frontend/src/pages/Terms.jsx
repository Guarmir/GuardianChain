import React from "react";
import { t } from "../i18n";

export default function Terms() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px", lineHeight: "1.6" }}>
      <h1>{t("terms.title")}</h1>
      <p><strong>{t("terms.updated")}</strong></p>

      <h2>{t("terms.aboutTitle")}</h2>
      <p>{t("terms.aboutText1")}</p>
      <p>{t("terms.aboutText2")}</p>

      <h2>{t("terms.eligibilityTitle")}</h2>
      <p>{t("terms.eligibilityText")}</p>

      <h2>{t("terms.natureTitle")}</h2>
      <p>{t("terms.natureText")}</p>

      <h2>{t("terms.paymentTitle")}</h2>
      <p>{t("terms.paymentText")}</p>

      <h2>{t("terms.contactTitle")}</h2>
      <p>
        suporte@guardianchain.online<br />
        contato@guardianchain.online
      </p>
    </div>
  );
}