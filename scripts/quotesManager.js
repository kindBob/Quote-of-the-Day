import DateManager from "./dateManager.js";
import { generateQuote } from "./quoteMachine.js";
import { initialLocale, getLocalizationData } from "./languageManager.js";
import { setupSharingCard, setFlipQuoteEL, isSavedSectionOpened } from "./userInteractions.js";

const currentQuoteOutput = document.querySelector("#current-quote");
const currentAuthorOutput = document.querySelector("#current-author");
const currentDateOutput = document.querySelector("#current-date");

const inactiveQuoteDates = document.querySelectorAll(".quotes-element__date.--inactive");

const sharingCardQuoteOutput = document.querySelector("#sharing-card-quote");
const sharingCardAuthorOutput = document.querySelector("#sharing-card-author");

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

    alert(1);
    console.log(1);

    getQuotes();
});

function getQuotes() {
    if (localStorage.getItem("savedQuotes")) {
        savedQuotes = JSON.parse(localStorage.getItem("savedQuotes"));
    }

    if (
        !localStorage.getItem("currentQuote") ||
        JSON.parse(localStorage.getItem("currentQuote")).id != dateManager.getCurrentFormattedDate()
    ) {
        generateQuote().then((quoteObject) => {
            localStorage.setItem("currentQuote", JSON.stringify(quoteObject));

            setupQuotes();
        });
    } else {
        setupQuotes();
    }
}

function setupQuotes() {
    const quoteObject = JSON.parse(localStorage.getItem("currentQuote"));
    let quoteObjectQuote = null;
    let quoteObjectAuthor = null;

    quoteObjectQuote = quoteObject[initialLocaleQuote];
    quoteObjectAuthor = quoteObject[initialLocaleAuthor];

    if (initialLocale == "uk") {
        !quoteObject.hasOwnProperty("quote-uk") ? (quoteObjectQuote = quoteObject["quote-ru"]) : null;

        !quoteObject.hasOwnProperty("author-uk") ? (quoteObjectAuthor = quoteObject["author-ru"]) : null;
    }

    //setMaxValues(quoteObjectQuote, quoteObjectAuthor);

    currentQuoteOutput.innerHTML = quoteObjectQuote;
    currentAuthorOutput.innerHTML = quoteObjectAuthor;
    currentDateOutput.innerHTML = dateManager.getCurrentFormattedDate();

    inactiveQuoteDates[0].innerHTML = dateManager.getTomorrowsFormattedDate();
    inactiveQuoteDates[1].innerHTML = dateManager.getAfterTomorrowsFormattedDate();

    if (localStorage.getItem("previousQuotes")) {
        previousQuotes = JSON.parse(localStorage.getItem("previousQuotes"));
    }

    if (!previousQuotes[0]) {
        previousQuotes.unshift(quoteObject);
    } else {
        if (previousQuotes[0].id != quoteObject.id) {
            previousQuotes.unshift(quoteObject);
        }
    }

    localStorage.setItem("previousQuotes", JSON.stringify(previousQuotes));

    setupPreviousQuotes();
    updateSavedQuotes();
    setupSavingButtonsEL();
    setupSectionsContent();
    setSharingButtonsEL(document.querySelectorAll(".share-button"));
    setupFontSizes();
}

function setMaxValues(quoteObjectQuote, quoteObjectAuthor) {
    fetch("../json/quotes.json")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (quoteObjectQuote.length < data[i]["quote-en"].length) {
                    quoteObjectQuote = data[i]["quote-en"];
                    currentQuoteOutput.innerHTML = quoteObjectQuote;
                }
                if (quoteObjectAuthor.length < data[i]["author-en"].length) {
                    quoteObjectAuthor = data[i]["author-en"];
                    currentAuthorOutput.innerHTML = quoteObjectAuthor;
                }
            }

            if (quoteObjectQuote.length >= 230) {
                currentQuoteOutput.classList.add("--smaller-font-size");
                sharingCardQuoteOutput.classList.add("--smaller-font-size");
            }

            if (quoteObjectAuthor.length > 14) {
                currentAuthorOutput.classList.add("--smaller-font-size");
                sharingCardAuthorOutput.classList.add("--smaller-font-size");
            }
        });
}

function setSharingButtonsEL(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", (event) => {
            setupSharingCard(event);
        });
    }
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

function setupFontSizes() {
    const quoteOutputsList = document.querySelectorAll(".quotes-element__quote");
    const authorOutputsList = document.querySelectorAll(".quotes-element__author");

    quoteOutputsList.forEach((output) => {
        output.textContent.length >= 230
            ? output.classList.add("--smaller-font-size")
            : output.classList.remove("--smaller-font-size");
        output.textContent.length <= 40
            ? output.classList.add("--bigger-font-size")
            : output.classList.remove("--bigger-font-size");
    });

    authorOutputsList.forEach((output) => {
        output.textContent.length >= 18
            ? output.classList.add("--smaller-font-size")
            : output.classList.remove("--smaller-font-size");
        output.textContent.length <= 12
            ? output.classList.add("--bigger-font-size")
            : output.classList.remove("--bigger-font-size");
    });
}

function setupSavingButtonsEL() {
    document.querySelectorAll(".quotes-element__saving-button:not(.--dummy)").forEach((button) => {
        button.addEventListener("click", (event) => {
            manageSavedQuotes(button, event.target.closest(".quotes-element"));
        });
    });
}

function updateSavedQuotes(act) {
    const isEmpty = savedQuotes.length == 0;

    if (!isEmpty) {
        savedSection.classList.remove("--is-empty");

        if (act != "unsave") {
            createSavedQuotesElements();
            setupSavingButtonsText();
            setupSavedQuotesElementsText();
            setupFontSizes();
        }
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
            clone.querySelector(".quotes-element__saving-button").addEventListener("click", () => {
                manageSavedQuotes(clone.querySelector(".quotes-element__saving-button"), clone);
            });

            setSharingButtonsEL([clone.querySelector(".share-button")]);
            setFlipQuoteEL(clone);
        }
    }
}

async function setupSavingButtonsText() {
    const data = await getLocalizationData();
    for (let i = 0; i < savedQuotes.length; i++) {
        document.querySelectorAll(".quotes-element__saving-button").forEach((button) => {
            if (
                savedQuotes[i].id == button.closest(".quotes-element").querySelector(".quotes-element__date").innerHTML
            ) {
                button.innerHTML = data["unsave-button"];
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

async function manageSavedQuotes(button, quoteElement) {
    const localizationData = await getLocalizationData();

    if (button.innerHTML == localizationData["save-button"]) {
        for (let i = 0; i < previousQuotes.length; i++) {
            if (previousQuotes[i].id == quoteElement.querySelector(".quotes-element__date").innerHTML) {
                savedQuotes.unshift(previousQuotes[i]);
                localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
            }
        }

        updateSavedQuotes();
        setupSectionsContent();
    } else {
        let dates = document.querySelectorAll(".quotes-element__date:not(.--sharing-card, .--dummy)");

        for (let i = 0; i < savedQuotes.length; i++) {
            if (savedQuotes[i].id == quoteElement.querySelector(".quotes-element__date").innerHTML) {
                let currentSavedQuote = savedQuotes[i];

                savedQuotes.splice(i, 1);
                localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));

                for (let j = 0; j < dates.length; j++) {
                    if (currentSavedQuote.id == dates[j].innerHTML) {
                        dates[j].closest(".quotes-element").querySelector(".quotes-element__saving-button").innerHTML =
                            localizationData["save-button"];
                        if (dates[j].closest(".saved__quote-element")) {
                            if (!isSavedSectionOpened) {
                                finishElementRemoval(dates[j].closest(".saved__quote-element"));
                                return;
                            }

                            callElementRemoval(dates[j].closest(".saved__quote-element"));
                        }
                    }
                }
            }
        }
    }
}

function callElementRemoval(element) {
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
    updateSavedQuotes("unsave");
}
