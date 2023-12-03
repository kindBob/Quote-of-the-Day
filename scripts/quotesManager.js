import { initialLocale, findTranslation } from "./languageManager.js";
import { savedOpened, setupSavingButtonsEL, setupSharingButtonsEL, hideShowMoreBtn } from "./userInteractions.js";

// const QUOTES_API = "http://localhost:3000/quotes";
const QUOTES_API = "https://quote-of-the-day-api.up.railway.app/quotes";

const currentQuoteOutput = document.querySelector("#current-quote");
const currentAuthorOutput = document.querySelector("#current-author");
const currentDateOutput = document.querySelector("#current-date");

const historyContainer = document.querySelector("#history-container");

const savedSection = document.querySelector("#saved-section");
const savedContainer = document.querySelector("#saved-container");

let currentQuote = null;
let previousQuotes = [];
let savedQuotes = [];

let initialLocaleAuthor = null;
let initialLocaleQuote = null;

//Dev mode
let developerMode = null;
localStorage.getItem("developerMode") ? (developerMode = true) : (developerMode = false);
let keysPressed = {};
const keysCombination = ["Control", "b"];

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case keysCombination[0]:
            keysPressed[e.key] = true;

            break;

        case keysCombination[1]:
            keysPressed[e.key] = true;

            break;

        case "s":
            if (developerMode) {
                localStorage.clear();
                location.reload();

                break;
            }
    }

    if (keysPressed[keysCombination[0]] && keysPressed[keysCombination[1]] && !developerMode) {
        console.log("Developer mode");
        developerMode = true;
        localStorage.setItem("developerMode", developerMode);
    }
});

document.addEventListener("keyup", (e) => {
    delete keysPressed[e.key];
});
//Dev mode ---

document.addEventListener("DOMContentLoaded", () => {
    initialLocaleAuthor = `author-${initialLocale}`;
    initialLocaleQuote = `quote-${initialLocale}`;

    fetchQuotes();
});

async function fetchQuotes() {
    const response = await fetch(QUOTES_API);
    if (!response.ok) return;

    const data = await response.json();
    const quotes = data.quotes;
    currentQuote = quotes[quotes.length - 1];
    previousQuotes = quotes.slice(0, quotes.length).reverse();

    setupQuotes();
}

async function setupQuotes() {
    let quoteObjectQuote = currentQuote[initialLocaleQuote];
    let quoteObjectAuthor = currentQuote[initialLocaleAuthor];

    if (initialLocale == "uk" || initialLocale == "ru") {
        document.querySelectorAll(".quotes-element__author").forEach((element) => element.classList.add("--cyrillic"));

        !currentQuote.hasOwnProperty("quote-uk") ? (quoteObjectQuote = currentQuote["quote-ru"]) : null;

        !currentQuote.hasOwnProperty("author-uk") ? (quoteObjectAuthor = currentQuote["author-ru"]) : null;
    }

    currentQuoteOutput.textContent = quoteObjectQuote;
    currentAuthorOutput.textContent = quoteObjectAuthor;
    currentDateOutput.textContent = currentQuote.id;

    if (previousQuotes.length <= 3) hideShowMoreBtn();

    setupPreviousQuotes();
    setupSavingButtonsEL(document.querySelectorAll(".quotes-element__saving-button:not(.--dummy)"));
    setupSavedQuotes();
    setupSectionsContent();
    setupSharingButtonsEL(document.querySelectorAll(".share-button"));
    setupQuotesIds();
}

function setupPreviousQuotes() {
    if (previousQuotes.length > 1) {
        for (let i = 0; i < previousQuotes.length - 2; i++) {
            const clone = createClone(historyContainer, document.querySelector(".history-quote-element"));
        }
    }

    for (let i = 0; i < previousQuotes.length - 1; i++) {
        document.querySelectorAll(".history__quotes-element-date")[i].textContent = previousQuotes[i + 1].id;
        document.querySelectorAll(".history__quotes-element-author")[i].textContent =
            previousQuotes[i + 1][initialLocaleAuthor];
        document.querySelectorAll(".history__quotes-element-quote")[i].textContent =
            previousQuotes[i + 1][initialLocaleQuote];

        if (i == 2) {
            const elem = document.querySelectorAll(".history-quote-element")[i];

            const dummyElement = document.createElement("div");
            dummyElement.setAttribute("id", "scroll-position");

            elem.appendChild(dummyElement);

            dummyElement.style.position = "absolute";
            dummyElement.style.bottom = "-20vh";
            dummyElement.style.left = "0";
        }
    }
}

function checkPreviousQuotesReadiness() {
    return new Promise((resolve) => {
        const check = () => {
            const firstQuote = document.querySelectorAll(".history-quote-element")[0];

            if (firstQuote.getAttribute("id")?.includes("1")) resolve();
            else {
                requestAnimationFrame(check);
            }
        };

        requestAnimationFrame(check);
    });
}

function setupQuotesIds() {
    const allClickableQuotes = document.querySelectorAll(".--clickable");

    for (let i = 0; i < allClickableQuotes.length; i++) {
        if (!allClickableQuotes[i].hasAttribute("id")) allClickableQuotes[i].id = `index-${i}`;
    }
}

function setupSavedQuotes() {
    const isEmpty = savedQuotes.length === 0;

    if (!isEmpty) {
        savedSection.classList.remove("--is-empty");

        createSavedQuotesElements();
        setupSavingButtonsText();
        setupSavedQuotesElementsText();
    } else {
        savedSection.classList.add("--is-empty");
    }
}

function createSavedQuotesElements() {
    const dummyElement = document.querySelector(".quotes-element.--dummy");

    for (let i = 0; i < savedQuotes.length; i++) {
        if (savedQuotes.length > document.querySelectorAll(".saved__quote-element").length) {
            let clone = createClone(savedContainer, dummyElement);
            removeClassRecursively(clone, "--dummy");
            clone.classList.add("saved__quote-element");
            const savingButton = clone.querySelector(".quotes-element__saving-button");

            setupSavingButtonsEL([savingButton]);

            setupSharingButtonsEL([clone.querySelector(".share-button")]);
        }
    }
}

async function setupSavingButtonsText() {
    for (let i = 0; i < savedQuotes.length; i++) {
        document.querySelectorAll(".quotes-element__saving-button").forEach((buttonText) => {
            if (
                savedQuotes[i].id ==
                buttonText.closest(".quotes-element").querySelector(".quotes-element__date").textContent
            ) {
                buttonText.textContent = findTranslation("unsave-button");
            }
        });
    }
}

function setupSavedQuotesElementsText() {
    for (let i = 0; i < savedQuotes.length; i++) {
        const element = document.querySelectorAll(".saved__quote-element")[i];

        element.querySelector(".saved__quotes-element-date").textContent = savedQuotes[i].id;
        element.querySelector(".saved__quotes-element-author").textContent = savedQuotes[i][initialLocaleAuthor];
        element.querySelector(".saved__quotes-element-quote").textContent = savedQuotes[i][initialLocaleQuote];
    }
}

function removeClassRecursively(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }

    const children = element.children;
    for (let i = 0; i < children.length; i++) {
        removeClassRecursively(children[i], className);
    }
}

function createClone(parent, element) {
    const clone = element.cloneNode(true);
    parent.prepend(clone);
    return clone;
}

function setupSectionsContent() {
    savedQuotes.length <= 1
        ? savedContainer.classList.add("--content-centered", "--fixed-height")
        : savedContainer.classList.remove("--content-centered", "--fixed-height");
}

async function manageSavedQuotes(button, quoteElement) {
    // Saved quote addition
    if (button.textContent == findTranslation("save-button")) {
        for (let i = 0; i < previousQuotes.length; i++) {
            if (previousQuotes[i].id == quoteElement.querySelector(".quotes-element__date").textContent) {
                savedQuotes.unshift(previousQuotes[i]);
                localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
            }
        }

        setupSavedQuotes();
        setupSectionsContent();

        return;
    }
    // Saved quote removal
    let dates = document.querySelectorAll(".quotes-element__date:not(.--sharing-card, .--dummy)");

    for (let i = 0; i < savedQuotes.length; i++) {
        if (savedQuotes[i].id == quoteElement.querySelector(".quotes-element__date").textContent) {
            const currentQuote = savedQuotes[i];

            savedQuotes.splice(i, 1);
            localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));

            for (let j = 0; j < dates.length; j++) {
                if (currentQuote.id == dates[j].textContent) {
                    const element = dates[j].closest(".quotes-element:not(.saved__quote-element)");
                    if (element) {
                        const savingButton = element.querySelector(".quotes-element__saving-button");
                        if (savingButton) {
                            savingButton.textContent = findTranslation("save-button");
                        }
                    }

                    const savedQuoteElement = dates[j].closest(".saved__quote-element");
                    if (savedQuoteElement) {
                        if (!savedOpened) return finishElementRemoval(savedQuoteElement);

                        callElementRemoval(savedQuoteElement);

                        // finishElementRemoval(savedQuoteElement);
                    }
                }
            }
        }
    }
}

function callElementRemoval(element) {
    element.style.height = getComputedStyle(element).height;
    // element.style.height = 0;
    element.classList.add("--hiding-animation");

    elementRemovalCheck(element);
    setupSectionsContent();
    // const state = Flip.getState(".saved__quote-element");
    // const state = Flip.getState(element);
    // element.classList.toggle("--hiding-animation");

    // gsap.set(element, { height: 0, x: 100, overflow: "hidden" });

    // Flip.from(state, {
    //     duration: 0.4,
    //     ease: "power2.inOut",
    //     absolute: true,
    //     onComplete: () => finishElementRemoval(element),
    // });
}

function elementRemovalCheck(element) {
    if (element.offsetHeight <= 0) {
        finishElementRemoval(element);
        return;
    }

    // console.log(element.offsetHeight);

    window.requestAnimationFrame(() => elementRemovalCheck(element));
}

function finishElementRemoval(element) {
    element.remove();
    setupSectionsContent();
    setupSavedQuotes();
}

export { previousQuotes, checkPreviousQuotesReadiness, manageSavedQuotes };
