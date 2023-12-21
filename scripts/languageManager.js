import { hideLoadingSpinner } from "./animationsManager.js";
import { fetchQuotes } from "./quotesManager.js";
import { initialSetup, MAIN_API_URL } from "./userInteractions.js";

const TRANSLATION_API = `${MAIN_API_URL}/translations`;
// const TRANSLATION_API = "http://localhost:3000/translations";

const overlay = document.querySelector("#overlay");
const overlayText = overlay.querySelector("p");

const defaultLocale = "en";
const supportedLocales = ["en", "ru", "uk"];

let translations = [];
let initialLocale = null;

document.addEventListener("DOMContentLoaded", () => {
    setupInitialLocale();
});

async function setupInitialLocale() {
    translations = await fetchTranslations(initialLocale);

    if (!translations) return;

    const userLocales = navigator.languages.map((locale) => locale.split("-")[0]);
    initialLocale = userLocales.find((locale) => isLocaleSupported(locale)) || defaultLocale;

    document.querySelector("html").setAttribute("lang", initialLocale);

    translatePage();
    callAwaitingFunctions();
}

function isLocaleSupported(locale) {
    return supportedLocales.includes(locale);
}

async function fetchTranslations() {
    const maxRetries = 3;
    const delay = 1000;
    let retries = 0;

    while (retries <= maxRetries) {
        try {
            const res = await fetch(TRANSLATION_API);
            if (!res.ok) throw new Error("Bad response.");

            const data = await res.json();
            return data.translations;
        } catch (err) {
            console.log("An error occured fetching quotes. Retrying...");

            retries++;

            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    overlayText.textContent = "Something went wrong. Check your Internet connection.";
    overlayText.classList.add("--active");

    hideLoadingSpinner();

    return null;
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

function getTranslation(keyWord) {
    const translation = translations.find((translation) => translation.keyWord === keyWord);
    return translation[initialLocale];
}

function callAwaitingFunctions() {
    fetchQuotes();
    initialSetup();
}

export { initialLocale, getTranslation };
