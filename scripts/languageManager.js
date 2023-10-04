const defaultLocale = "en";
const supportedLocales = ["en", "ru"];

let locale = null;
let translations = {};
export let initialLocale = null;

document.addEventListener("DOMContentLoaded", () => {
  initialLocale = supportedOrDefault(browserLocales(true));

  setLocale(initialLocale);
});

async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations = await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;

  document.querySelector("html").setAttribute("lang", initialLocale);

  translatePage();
}

async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`../json/languages/${newLocale}.json`);
  return await response.json();
}

function translatePage() {
  document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
}

function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");
  const translation = translations[key];
  element.innerText = translation;
}

function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}

function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}

function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale,
  );
}