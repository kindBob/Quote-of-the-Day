const defaultLocale = "en";
const supportedLocales = ["en", "ru", "uk"];

// const TRANSLATION_API = "http://localhost:3000/translations";
const TRANSLATION_API = "https://quote-of-the-day-api.up.railway.app/translations";

let translations = {};
export let initialLocale = null;

document.addEventListener("DOMContentLoaded", () => {
    setupInitialLocale();
});

async function setupInitialLocale() {
    const userLocales = navigator.languages.map((locale) => locale.split("-")[0]);

    initialLocale = userLocales.find((locale) => isLocaleSupported(locale)) || defaultLocale;

    translations = await fetchTranslations(initialLocale);

    document.querySelector("html").setAttribute("lang", initialLocale);

    translatePage();
}

function isLocaleSupported(locale) {
    return supportedLocales.includes(locale);
}

async function fetchTranslations() {
    const res = await fetch(TRANSLATION_API);
    if (!res.ok) return console.log("Something went wrong");

    const data = await res.json();
    return data.translations;
}

function translatePage() {
    document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
}

function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");
    const translation = translations.find((translation) => translation.keyWord === key);
    element.textContent = translation[`${initialLocale}Translation`];
}

let localizationData = null;
export async function getLocalizationData() {
    if (!localizationData) {
        let response = await fetch(`../json/languages/${initialLocale}.json`);
        localizationData = await response.json();
    }

    return localizationData;
}
