import en from "./locales/en.json";
import pt from "./locales/pt.json";

const translations = { en, pt };

export function getDefaultLanguage() {
  const savedLang = localStorage.getItem("guardianchain_lang");
  if (savedLang) return savedLang;

  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith("pt") ? "pt" : "en";
}

export function setLanguage(lang) {
  localStorage.setItem("guardianchain_lang", lang);
  window.location.reload();
}

export function t(key) {
  const lang = getDefaultLanguage();
  return translations[lang][key] || key;
}
