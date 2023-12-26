import { initialLocale, getTranslation } from "./languageManager.js";
import { showSplitText } from "./animationsManager.js";
import { savedOpened, prefersReducedMotion, MAIN_API_URL, setupQuoteElementButtons } from "./userInteractions.js";

// const QUOTES_API = "http://localhost:3000/quotes";
const QUOTES_API = `${MAIN_API_URL}/quotes`;

const savedContainer = document.querySelector("#saved-container");
const historyContainer = document.querySelector("#history-container");

const mainSectionQuoteElements = document.querySelectorAll(".main-section .quotes-element");

const savedSection = document.querySelector("#saved-section");

const savedPlaceholder = savedSection.querySelector("#saved-placeholder");

let mainSectionQuotes = [];
let savedQuotes = [];

let initialLocaleAuthor = null;
let initialLocaleQuote = null;

let quoteIdIndex = 0;

async function fetchQuotes() {
    const response = await fetch(QUOTES_API);
    if (!response.ok) return;

    const data = await response.json();
    mainSectionQuotes = data.quotes.reverse();

    JSON.parse(localStorage.getItem("savedQuotes")) && (savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")));

    initQuotesSetup();
}

async function initQuotesSetup() {
    initialLocaleAuthor = `author-${initialLocale}`;
    initialLocaleQuote = `quote-${initialLocale}`;

    if (initialLocale == "uk" || initialLocale == "ru") {
        document.querySelectorAll(".quotes-element__author").forEach((element) => element.classList.add("--cyrillic"));

        !mainSectionQuotes[0].hasOwnProperty("quote-uk") && (quoteObjectQuote = mainSectionQuotes[0]["quote-ru"]);

        !mainSectionQuotes[0].hasOwnProperty("author-uk") && (quoteObjectAuthor = mainSectionQuotes[0]["author-ru"]);
    }

    setupMainSectionQuoteElements();
    setupSavedQuotes();
}

function setupMainSectionQuoteElements() {
    mainSectionQuoteElements.forEach((el, i) => {
        setQuoteElementContent(el, mainSectionQuotes[i]);
        setupQuoteElementButtons(el);
        setQuoteElementId(el);

        const date = el.querySelector(".quotes-element__date").textContent;
        const saveBtn = document.querySelector(".save-button");

        savedQuotes.forEach((savedQuote) => {
            if (savedQuote.id == date) {
                el.classList.add("--saved");

                changeSaveButtonText(saveBtn, false);
            }
        });
    });
}

function setupSavedQuotes() {
    if (savedQuotes.length > 0) {
        for (let i = savedQuotes.length - 1; i >= 0; i--) {
            createSavedQuoteElement(savedQuotes[i]);
        }
    }

    setSavedContainerCentering();
}

function setQuoteElementContent(element, content) {
    element.querySelector(".quotes-element__date").textContent = content.id;
    element.querySelector(".quotes-element__author").textContent = content[initialLocaleAuthor];
    element.querySelector(".quotes-element__quote").textContent = content[initialLocaleQuote];
}

function checkPreviousQuotesReadiness() {
    let intervalId = null;
    return new Promise((resolve) => {
        const check = () => {
            const firstQuote = historyContainer.querySelectorAll(".quotes-element")[0];

            if (firstQuote.getAttribute("id")?.includes("1")) {
                clearInterval(intervalId);
                resolve();
            }
        };

        intervalId = setInterval(() => {
            check();
        }, 10);
    });
}

function setQuoteElementId(el) {
    el.id = `index-${quoteIdIndex++}`;
}

function createSavedQuoteElement(content) {
    const sample = document.querySelector("#index-0");
    const saveBtn = sample.querySelector(".save-button");

    let quoteElementClone = sample.cloneNode(true);

    savedContainer.prepend(quoteElementClone);

    quoteElementClone.style = "";
    quoteElementClone.classList.add("--saved");

    changeSaveButtonText(saveBtn, false);

    setQuoteElementContent(quoteElementClone, content);
    setupQuoteElementButtons(quoteElementClone);
    setQuoteElementId(quoteElementClone);
}

function setSavedContainerCentering() {
    savedQuotes.length > 0
        ? savedContainer.classList.add("--content-centered")
        : savedContainer.classList.remove("--content-centered");
}

function removeSavedQuote(quoteElement) {
    const date = quoteElement.querySelector(".quotes-element__date").textContent;
    const saveBtn = quoteElement.querySelector(".save-button");

    let savedQuoteIndex = 0;
    for (; savedQuoteIndex < savedQuotes.length; savedQuoteIndex++) {
        if (date == savedQuotes[savedQuoteIndex].id) {
            break;
        }
    }

    const savedQuoteElement = savedSection.querySelectorAll(".quotes-element")[savedQuoteIndex];

    mainSectionQuoteElements.forEach((el) => {
        const date = el.querySelector(".quotes-element__date").textContent;

        if (date == savedQuotes[savedQuoteIndex].id) el.classList.remove("--saved");
    });

    savedOpened ? setupSavedQuoteElementRemoval(savedQuoteElement) : finishSavedQuoteElementRemoval(savedQuoteElement);
    setSavedContainerCentering();

    if (!quoteElement.closest(".section").classList.contains("saved__section")) changeSaveButtonText(saveBtn, true);

    savedQuotes.splice(savedQuoteIndex, 1);
    localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
}

function saveQuote(quoteElement) {
    const saveBtn = quoteElement.querySelector(".save-button");
    let index = parseInt(quoteElement.id.replace("index-", ""));

    savedPlaceholder.style.display = "none";
    quoteElement.classList.add("--saved");

    changeSaveButtonText(saveBtn, false);

    createSavedQuoteElement(mainSectionQuotes[index]);
    setSavedContainerCentering();

    savedQuotes.unshift(mainSectionQuotes[index]);
    localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
}

function manageSavedQuotes(quoteElement) {
    quoteElement.classList.contains("--saved") ? removeSavedQuote(quoteElement) : saveQuote(quoteElement);
}

function changeSaveButtonText(btn, changeToSave) {
    changeToSave
        ? (btn.textContent = getTranslation("save-button"))
        : (btn.textContent = getTranslation("unsave-button"));
}

function setupSavedQuoteElementRemoval(element) {
    gsap.to(element, {
        x: "100vw",
        // yPercent: 100,
        height: 0,
        margin: 0,
        padding: 0,
        scaleY: 0,
        opacity: 0,
        overflow: "hidden",
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: "power2.inOut",
        onComplete: () => finishSavedQuoteElementRemoval(element),
    });
}

function finishSavedQuoteElementRemoval(element) {
    element.remove();

    savedQuotes.length == 0 && showSplitText(savedPlaceholder);
}

export { checkPreviousQuotesReadiness, manageSavedQuotes, fetchQuotes, savedQuotes };
