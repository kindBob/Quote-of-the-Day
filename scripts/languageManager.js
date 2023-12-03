const TRANSLATION_API = "https://quote-of-the-day-api.up.railway.app/translations";
// const TRANSLATION_API = "http://localhost:3000/translations";

const defaultLocale = "en";
const supportedLocales = ["en", "ru", "uk"];

let translations = {};
let initialLocale = null;

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

    if (key.includes("<placeholder>")) {
        element.setAttribute("placeholder", translation[initialLocale]);
    } else element.innerHTML = translation[initialLocale].replace("<n>", "<br />");
}

function findTranslation(keyWord) {
    const translation = translations.find((translation) => translation.keyWord === keyWord);
    return translation[initialLocale];
}

export { initialLocale, findTranslation };
