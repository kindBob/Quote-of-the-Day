import DateManager from "./dateManager.js";
import { generateQuote } from "./quoteMachine.js";
import { initialLocale, getLocalizationData } from "./languageManager.js";
import { setFlipQuoteEL, isSavedSectionOpened, setupSavingButtonsEL, setSharingButtonsEL } from "./userInteractions.js";

const currentQuoteOutput = document.querySelector("#current-quote");
const currentAuthorOutput = document.querySelector("#current-author");
const currentDateOutput = document.querySelector("#current-date");

const inactiveQuoteDates = document.querySelectorAll(".quotes-element__date.--inactive");

const historyContainer = document.querySelector("#history-container");

const savedSection = document.querySelector("#saved-section");
const savedContainer = document.querySelector("#saved-container");

const dateManager = new DateManager();

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

        case "a":
            if (developerMode) {
                dateManager.changeCurrentDate(dateManager.currentDate.getDate() + 1);
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

    getQuotes();
});

function getQuotes() {
    const currentQuote = localStorage.getItem("currentQuote");

    if (localStorage.getItem("savedQuotes")) {
        savedQuotes = JSON.parse(localStorage.getItem("savedQuotes"));
    }

    const parsedQuote = JSON.parse(currentQuote);
    if (currentQuote && parsedQuote.id === dateManager.getCurrentFormattedDate()) return setupQuotes();

    callQuoteGeneration();
}

async function callQuoteGeneration() {
    const quoteObject = await generateQuote();
    localStorage.setItem("currentQuote", JSON.stringify(quoteObject));

    setupQuotes();
}

async function setupQuotes() {
    let quoteObjectQuote = getCurrentQuoteObjFromLS().quote;
    let quoteObjectAuthor = getCurrentQuoteObjFromLS().author;

    if (initialLocale == "uk" || initialLocale == "ru") {
        document.querySelectorAll(".quotes-element__author").forEach((element) => element.classList.add("--cyrillic"));

        !getCurrentQuoteObjFromLS().object.hasOwnProperty("quote-uk")
            ? (quoteObjectQuote = getCurrentQuoteObjFromLS().object["quote-ru"])
            : null;

        !getCurrentQuoteObjFromLS().object.hasOwnProperty("author-uk")
            ? (quoteObjectAuthor = getCurrentQuoteObjFromLS().object["author-ru"])
            : null;
    }

    //await setMaxValues(quoteObjectQuote, quoteObjectAuthor);

    currentQuoteOutput.innerHTML = quoteObjectQuote;
    currentAuthorOutput.innerHTML = quoteObjectAuthor;
    currentDateOutput.innerHTML = dateManager.getCurrentFormattedDate();

    inactiveQuoteDates[0].innerHTML = dateManager.getTomorrowsFormattedDate();
    inactiveQuoteDates[1].innerHTML = dateManager.getAfterTomorrowsFormattedDate();

    if (localStorage.getItem("previousQuotes")) {
        previousQuotes = JSON.parse(localStorage.getItem("previousQuotes"));
    }

    if (!previousQuotes[0]) {
        previousQuotes.unshift(getCurrentQuoteObjFromLS().object);
    } else {
        if (previousQuotes[0].id != getCurrentQuoteObjFromLS().id) {
            previousQuotes.unshift(getCurrentQuoteObjFromLS().object);
        }
    }

    localStorage.setItem("previousQuotes", JSON.stringify(previousQuotes));

    setupPreviousQuotes();
    setupSavingButtonsEL();
    setupSavedQuotes();
    setupSectionsContent();
    setSharingButtonsEL(document.querySelectorAll(".share-button"));
    setupFontSizes();
}

async function setMaxValues(quoteObjectQuote, quoteObjectAuthor) {
    const res = await fetch("../json/quotes.json");
    const data = await res.json();

    for (let i = 0; i < data.length; i++) {
        if (quoteObjectQuote.length < data[i][initialLocaleQuote].length) {
            quoteObjectQuote = data[i][initialLocaleQuote];
        }
        if (quoteObjectAuthor.length < data[i][initialLocaleAuthor].length) {
            quoteObjectAuthor = data[i][initialLocaleAuthor];
        }
    }

    currentQuoteOutput.textContent = quoteObjectQuote;
    currentAuthorOutput.textContent = quoteObjectAuthor;
}

function getCurrentQuoteObjFromLS() {
    const quoteObject = JSON.parse(localStorage.getItem("currentQuote"));

    const quoteObjectQuote = quoteObject[initialLocaleQuote];
    const quoteObjectAuthor = quoteObject[initialLocaleAuthor];
    const quoteObjectId = quoteObject.id;

    return {
        quote: quoteObjectQuote,
        author: quoteObjectAuthor,
        id: quoteObjectId,
        object: quoteObject,
    };
}

function setupPreviousQuotes() {
    if (previousQuotes.length > 1) {
        for (let i = 0; i < previousQuotes.length - 1; i++) {
            const clone = createClone(historyContainer, document.querySelector(".history__quote-element"));
            setFlipQuoteEL(clone);
        }
    }

    for (let i = 0; i < previousQuotes.length; i++) {
        document.querySelectorAll(".history__quotes-element-date")[i].innerHTML = previousQuotes[i].id;
        document.querySelectorAll(".history__quotes-element-author")[i].innerHTML =
            previousQuotes[i][initialLocaleAuthor];
        document.querySelectorAll(".history__quotes-element-quote")[i].innerHTML =
            previousQuotes[i][initialLocaleQuote];
    }
}

export function setupFontSizes() {
    const quoteOutputs = document.querySelectorAll(".quotes-element__quote");
    const authorOutputs = document.querySelectorAll(".quotes-element__author");

    quoteOutputs.forEach((output) => {
        output.textContent.length >= 230
            ? output.classList.add("--smaller-font-size")
            : output.classList.remove("--smaller-font-size");

        output.textContent.length <= 55
            ? output.classList.add("--bigger-font-size")
            : output.classList.remove("--bigger-font-size");

        output.textContent.length <= 75
            ? output.classList.add("--medium-bigger-font-size")
            : output.classList.remove("--medium-bigger-font-size");
    });

    authorOutputs.forEach((output) => {
        output.textContent.length >= 20
            ? output.classList.add("--smaller-font-size")
            : output.classList.remove("--smaller-font-size");
        output.textContent.length <= 15 && output.textContent.split(" ").length > 1
            ? output.classList.add("--bigger-font-size")
            : output.classList.remove("--bigger-font-size");
    });
}

function setupSavedQuotes() {
    const isEmpty = savedQuotes.length === 0;

    if (!isEmpty) {
        savedSection.classList.remove("--is-empty");

        createSavedQuotesElements();
        setupSavingButtonsText();
        setupSavedQuotesElementsText();
        setupFontSizes();
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

            if (!savingButton.classList.contains("hasEL"))
                savingButton.addEventListener("click", () => {
                    manageSavedQuotes(savingButton, clone);
                });

            setSharingButtonsEL([clone.querySelector(".share-button")]);
            setFlipQuoteEL(clone);
        }
    }
}

async function setupSavingButtonsText() {
    const data = await getLocalizationData();
    for (let i = 0; i < savedQuotes.length; i++) {
        document.querySelectorAll(".quotes-element__saving-button").forEach((buttonText) => {
            if (
                savedQuotes[i].id ==
                buttonText.closest(".quotes-element").querySelector(".quotes-element__date").textContent
            ) {
                buttonText.textContent = data["unsave-button"];
            }
        });
    }
}

function setupSavedQuotesElementsText() {
    for (let i = 0; i < savedQuotes.length; i++) {
        const element = document.querySelectorAll(".saved__quote-element")[i];

        element.querySelector(".saved__quotes-element-date").innerHTML = savedQuotes[i].id;
        element.querySelector(".saved__quotes-element-author").innerHTML = savedQuotes[i][initialLocaleAuthor];
        element.querySelector(".saved__quotes-element-quote").innerHTML = savedQuotes[i][initialLocaleQuote];
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
    previousQuotes.length == 1
        ? historyContainer.classList.add("--content-centered")
        : historyContainer.classList.remove("--content-centered");

    savedQuotes.length <= 1
        ? savedContainer.classList.add("--content-centered", "--fixed-height")
        : savedContainer.classList.remove("--content-centered", "--fixed-height");
}

export async function manageSavedQuotes(button, quoteElement) {
    const localizationData = await getLocalizationData();

    if (button.textContent == localizationData["save-button"]) {
        for (let i = 0; i < previousQuotes.length; i++) {
            if (previousQuotes[i].id == quoteElement.querySelector(".quotes-element__date").innerHTML) {
                savedQuotes.unshift(previousQuotes[i]);
                localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
            }
        }

        setupSavedQuotes();
        setupSectionsContent();
    } else {
        let dates = document.querySelectorAll(".quotes-element__date:not(.--sharing-card, .--dummy)");

        for (let i = 0; i < savedQuotes.length; i++) {
            if (savedQuotes[i].id == quoteElement.querySelector(".quotes-element__date").innerHTML) {
                const currentQuote = savedQuotes[i];

                savedQuotes.splice(i, 1);
                localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));

                for (let j = 0; j < dates.length; j++) {
                    if (currentQuote.id == dates[j].innerHTML) {
                        dates[j].closest(".quotes-element").querySelector(".quotes-element__saving-button").innerHTML =
                            localizationData["save-button"];
                        if (dates[j].closest(".saved__quote-element")) {
                            if (!isSavedSectionOpened) {
                                finishElementRemoval(dates[j].closest(".saved__quote-element"));
                            } else {
                                callElementRemoval(dates[j].closest(".saved__quote-element"));
                            }
                        }
                    }
                }
            }
        }
    }
}

async function callElementRemoval(element) {
    element.classList.add("--hiding-animation");
    elementRemovalCheck(element);

    setupSectionsContent();
}

function elementRemovalCheck(element) {
    if (element.offsetHeight <= 0) {
        finishElementRemoval(element);
        return;
    }

    window.requestAnimationFrame(() => elementRemovalCheck(element));
}

function finishElementRemoval(element) {
    element.remove();
    setupSectionsContent();
    setupSavedQuotes();
}
