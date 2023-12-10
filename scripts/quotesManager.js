import { initialLocale, findTranslation } from "./languageManager.js";
import {
    savedOpened,
    setupSavingButtonsEL,
    setupSharingButtonsEL,
    hideShowMoreBtn,
    prefersReducedMotion,
} from "./userInteractions.js";

// const QUOTES_API = "http://localhost:3000/quotes";
const QUOTES_API = "https://quote-of-the-day-api.up.railway.app/quotes";

const currentQuoteElement = document.querySelector("#index-0");
const currentQuoteOutput = currentQuoteElement.querySelector(".quotes-element__quote");
const currentAuthorOutput = currentQuoteElement.querySelector(".quotes-element__author");
const currentDateOutput = currentQuoteElement.querySelector(".quotes-element__date");

const savedContainer = document.querySelector("#saved-container");
const historyContainer = document.querySelector("#history-container");

const savedSection = document.querySelector("#saved-section");

let previousQuotesElements = [];

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
async function fetchQuotes() {
    const response = await fetch(QUOTES_API);
    if (!response.ok) return;

    const data = await response.json();
    const quotes = data.quotes;
    currentQuote = quotes[quotes.length - 1];
    previousQuotes = quotes.slice(0, quotes.length - 1);

    const localStorageQuotes = JSON.parse(localStorage.getItem("savedQuotes"));
    if (localStorageQuotes) savedQuotes = localStorageQuotes;

    setupQuotes();
}

async function setupQuotes() {
    initialLocaleAuthor = `author-${initialLocale}`;
    initialLocaleQuote = `quote-${initialLocale}`;

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
    setupSharingButtonsEL(document.querySelectorAll(".share-button"));
    setupQuotesIds();
}

function setupPreviousQuotesText(element, content) {
    element.querySelector(".history__quotes-element-date").textContent = content.id;
    element.querySelector(".quotes-element__author").textContent = content.author;
    element.querySelector(".quotes-element__quote").textContent = content.quote;
}

function setupPreviousQuotes() {
    const firstPreviousQuote = document.querySelector(".history-quote-element");

    setupPreviousQuotesText(firstPreviousQuote, {
        id: previousQuotes[previousQuotes.length - 1].id,
        author: previousQuotes[previousQuotes.length - 1][initialLocaleAuthor],
        quote: previousQuotes[previousQuotes.length - 1][initialLocaleQuote],
    });

    previousQuotesElements.push(firstPreviousQuote);

    for (let i = previousQuotes.length - 2; i >= 0; i--) {
        const clone = createClone(historyContainer, document.querySelector(".history-quote-element"), { pos: "end" });

        setupPreviousQuotesText(clone, {
            id: previousQuotes[i].id,
            author: previousQuotes[i][initialLocaleAuthor],
            quote: previousQuotes[i][initialLocaleQuote],
        });

        if (i < previousQuotes.length - 3) {
            clone.classList.add("--hidden");
            clone.classList.remove("--always-shown");
        }

        previousQuotesElements.push(clone);
    }

    // for (let i = previousQuotes.length - 1; i >= 0; i--) {
    //     document.querySelectorAll(".history__quotes-element-date")[i].textContent = previousQuotes[i].id;
    //     document.querySelectorAll(".history__quotes-element-author")[i].textContent =
    //         previousQuotes[i][initialLocaleAuthor];
    //     document.querySelectorAll(".history__quotes-element-quote")[i].textContent =
    //         previousQuotes[i][initialLocaleQuote];

    //     // if(i < 2)
    // }
}

function checkPreviousQuotesReadiness() {
    let intervalId = null;
    return new Promise((resolve) => {
        const check = () => {
            const firstQuote = document.querySelectorAll(".history-quote-element")[0];

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

function setupQuotesIds() {
    const allClickableQuotes = document.querySelectorAll(".--clickable");

    for (let i = 0; i < allClickableQuotes.length; i++) {
        allClickableQuotes[i].id = `index-${i}`;
    }
}

function setupSavedQuotes() {
    const isEmpty = savedQuotes.length === 0;

    setupSavedCentering();

    if (!isEmpty) {
        savedSection.classList.remove("--is-empty");

        createSavedQuotesElements();
        setupSavingButtonsText();
        setupSavedQuotesElementsText();
        setupQuotesIds();
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
            clone.classList.add("saved__quote-element", "--clickable");

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

function createClone(parent, element, options) {
    const clone = element.cloneNode(true);

    if (options?.pos == "end") parent.append(clone);
    else parent.prepend(clone);

    return clone;
}

function setupSavedCentering() {
    savedQuotes.length <= 1
        ? savedContainer.classList.add("--content-centered", "--fixed-height")
        : savedContainer.classList.remove("--content-centered", "--fixed-height");
}

async function manageSavedQuotes(button, quoteElement) {
    // Saved quote addition
    if (button.textContent == findTranslation("save-button")) {
        const date = quoteElement.querySelector(".quotes-element__date").textContent;
        let quoteToSave = null;

        if (currentQuote.id == date) {
            quoteToSave = currentQuote;
        } else {
            for (let i = 0; i < previousQuotes.length; i++) {
                if (previousQuotes[i].id == date) {
                    quoteToSave = previousQuotes[i];
                }

                console.log(
                    `Previous quotes id - ${previousQuotes[i].id}\nQuotes element date - ${quoteElement.querySelector(
                        ".quotes-element__date"
                    )}`
                );
            }
        }

        savedQuotes.unshift(quoteToSave);
        localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));

        setupSavedQuotes();
        setupSavedCentering();

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

                        setupElementRemoval(savedQuoteElement);
                    }
                }
            }
        }
    }
}

function setupElementRemoval(element) {
    const precedingElemId = `#index-${parseInt(element.getAttribute("id").match(/[0-9]/g).join("")) + 1}`;
    const followingElemId = `#index-${parseInt(element.getAttribute("id").match(/[0-9]/g).join("")) - 1}`;
    const precedingElem = document.querySelector(`${precedingElemId}.saved__quote-element`);
    const followingElem = document.querySelector(`${followingElemId}.saved__quote-element`);

    const margin = parseFloat(getComputedStyle(element).height.replace("px", ""));
    let initialMargin = 0;

    const closeElems = [];

    precedingElem && closeElems.push(precedingElem);
    followingElem && closeElems.push(followingElem);

    if (closeElems[0]) initialMargin = parseInt(getComputedStyle(closeElems[0]).marginTop.replace("px", ""));

    const tl = gsap.timeline({ defaults: { duration: prefersReducedMotion ? 0 : 0.8, ease: "power3.inOut" } });

    tl.addLabel("curElem", 0);

    tl.to(element, {
        x: "100vw",
        height: 0,
        margin: 0,
        padding: 0,
        scaleY: 0,
        opacity: 0,
        overflow: "hidden",
        onComplete: () => finishElementRemoval(element),
    });

    // if (precedingElem) {
    //     tl.to(precedingElem, { marginTop: "+=5" }, "curElem");
    // }

    // if (followingElem) {
    //     tl.to(followingElem, { marginBottom: "+=5" }, "curElem");
    // }

    // if (closeElems.length > 0) tl.to(closeElems, { margin: "25", duration: 0.2 });

    setupSavedCentering();
}

function finishElementRemoval(element) {
    element.remove();
    setupSavedCentering();
    setupSavedQuotes();
}

export { previousQuotes, checkPreviousQuotesReadiness, manageSavedQuotes, fetchQuotes, previousQuotesElements };
