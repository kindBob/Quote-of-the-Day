import * as TimeMachine from "./timeMachine.js";
import { generateQuote } from "./quoteMachine.js";
import { initialLocale, getLocalizationData } from "./languageManager.js";
import { setupSharingCard } from "./userInteractions.js";

const dateOuputs = document.querySelectorAll(".quotes-element__date");

const currentQuoteOutput = document.querySelector("#current-quote");
const currentAuthorOutput = document.querySelector("#current-author");

const sharingCardQuoteOutput = document.querySelector("#sharing-card-quote");
const sharingCardAuthorOutput = document.querySelector("#sharing-card-author");

const historyContainer = document.querySelector("#history-container");
const historyQuote = document.querySelector(".history__quote-element");

const savedSection = document.querySelector("#saved-section");
const savedContainer = document.querySelector("#saved-container");

dateOuputs[0].innerHTML = TimeMachine.currentDateFormatted;
dateOuputs[1].innerHTML = TimeMachine.tomorrowsDateFormatted;
dateOuputs[2].innerHTML = TimeMachine.afterTomorrowsDayFormatted;

let previousQuotes = [];
let savedQuotes = [];

let initialLocaleAuthor = null;
let initialLocaleQuote = null;

if (!localStorage.getItem("cleared")) {
    localStorage.clear();
    localStorage.setItem("cleared", 1);
}

document.addEventListener("DOMContentLoaded", () => {
    initialLocaleAuthor = `author-${initialLocale}`;
    initialLocaleQuote = `quote-${initialLocale}`;

    getQuotes();
});

function getQuotes() {
    if (localStorage.getItem("savedQuotes")) {
        savedQuotes = JSON.parse(localStorage.getItem("savedQuotes"));
    }

    if (
        localStorage.getItem("currentQuote") == null ||
        JSON.parse(localStorage.getItem("currentQuote")).id != TimeMachine.currentDateFormatted
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

    if (quoteObjectQuote.length >= 230) {
        currentQuoteOutput.classList.add("--smaller-font-size");
        sharingCardQuoteOutput.classList.add("--smaller-font-size");
    }

    if (quoteObjectAuthor.length > 14) {
        currentAuthorOutput.classList.add("--smaller-font-size");
        sharingCardAuthorOutput.classList.add("--smaller-font-size");
    }

    currentQuoteOutput.innerHTML = quoteObjectQuote;
    currentAuthorOutput.innerHTML = quoteObjectAuthor;

    if (localStorage.getItem("previousQuotes")) {
        previousQuotes = JSON.parse(localStorage.getItem("previousQuotes"));
    }

    if (!previousQuotes[0]) {
        previousQuotes.unshift(quoteObject);
    } else {
        if (previousQuotes[0].id != quoteObject.id) {
            if (previousQuotes.length > 10) {
                previousQuotes.pop();
            }

            previousQuotes.unshift(quoteObject);
        }
    }

    localStorage.setItem("previousQuotes", JSON.stringify(previousQuotes));

    setupPreviousQuotes();
    updateQuotes();
    setupSavingButtons();
    setupSectionsContent();
    setSharingButtonsEL(document.querySelectorAll(".share-button"));
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
            const quoteElementClone = historyQuote.cloneNode(1);
            historyContainer.prepend(quoteElementClone);
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

function setupSavingButtons() {
    document.querySelectorAll(".quotes-element__saving-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            manageSavedQuotes(button, event.target.closest(".quotes-element"));
        });
    });
}

function updateQuotes(act) {
    const dummyElement = document.querySelector(".quotes-element.--dummy");

    if (savedQuotes.length == 0) {
        savedSection.classList.add("--is-empty");
    } else {
        savedSection.classList.remove("--is-empty");

        if (act != "unsave") {
            for (let i = 0; i < savedQuotes.length; i++) {
                if (savedQuotes.length > document.querySelectorAll(".saved__quote-element").length) {
                    let clone = createClone(savedContainer, dummyElement);
                    clone.classList.remove("--dummy");
                    clone.classList.add("saved__quote-element");
                    clone.querySelector(".quotes-element__saving-button").addEventListener("click", () => {
                        manageSavedQuotes(clone.querySelector(".quotes-element__saving-button"), clone);
                    });
                    setSharingButtonsEL(clone.querySelector(".share-button"));
                }
            }

            for (let i = 0; i < savedQuotes.length; i++) {
                document.querySelectorAll(".quotes-element__saving-button").forEach((button) => {
                    if (
                        savedQuotes[i].id ==
                        button.closest(".quotes-element").querySelector(".quotes-element__date").innerHTML
                    ) {
                        getLocalizationData().then((content) => {
                            button.innerHTML = content["unsave-button"];
                        });
                    }
                });
            }

            for (let i = 0; i < savedQuotes.length; i++) {
                const element = document.querySelectorAll(".saved__quote-element")[i];

                element.querySelector(".saved__quotes-element-date").innerHTML = savedQuotes[i].id;
                element.querySelector(".saved__quotes-element-author").innerHTML = savedQuotes[i][initialLocaleAuthor];
                element.querySelector(".saved__quotes-element-quote").innerHTML = savedQuotes[i][initialLocaleQuote];
            }
        }
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

    savedQuotes.length == 1
        ? savedContainer.classList.add("--content-centered")
        : savedContainer.classList.remove("--content-centered");
}

async function manageSavedQuotes(button, quoteElement) {
    const localizationData = await getLocalizationData();

    if (button.innerHTML == localizationData["save-button"]) {
        for (let i = 0; i < previousQuotes.length; i++) {
            if (previousQuotes[i].id == quoteElement.querySelector(".quotes-element__date").innerHTML) {
                quoteElement.classList.remove("--hiding-animation");
                savedQuotes.unshift(previousQuotes[i]);
                localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
            }
        }
    } else {
        for (let i = 0; i < savedQuotes.length; i++) {
            if (savedQuotes[i].id == quoteElement.querySelector(".quotes-element__date").innerHTML) {
                let allDOMDates = document.querySelectorAll(".quotes-element__date");
                let dates = [];
                for (let i = 0; i < allDOMDates.length; i++) {
                    if (allDOMDates[i].closest(".quotes-element").classList.contains("--sharing-card")) {
                        continue;
                    }

                    dates.push(allDOMDates[i]);
                }

                for (let j = 0; j < dates.length; j++) {
                    if (savedQuotes[i].id == dates[j].innerHTML) {
                        dates[j].closest(".quotes-element").querySelector(".quotes-element__saving-button").innerHTML =
                            localizationData["save-button"];
                        if (dates[j].closest(".saved__quote-element")) {
                            // dates[j].closest(".saved__quote-element").classList.add("--hiding-animation");
                            // dates[j].closest(".saved__quote-element").addEventListener("transitionend", () => {
                            //     dates[j].closest(".saved__quote-element").remove();
                            // });
                            //dates[j].closest(".saved__quote-element").remove();
                            callElementRemoval(dates[j].closest(".saved__quote-element"));
                        }
                    }
                }

                savedQuotes.splice(i, 1);
                localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
            }
        }
        //updateQuotes("unsave");
        //setupSectionsContent();
        return;
    }

    updateQuotes();
    setupSectionsContent();
}

function finishElementRemoval(element) {
    element.remove();
    updateQuotes("unsave");
    setupSectionsContent();
}

function callElementRemoval(element) {
    let start = null;
    let startHeight = parseInt(window.getComputedStyle(element, null).height);

    element.querySelector(".quotes-element__inner-container").style.padding = 0 + "px";

    element.classList.add("--hiding-animation");

    window.requestAnimationFrame((timestamp) => {
        elementRemoval(timestamp, element, 10, start, startHeight);
    });
}

function elementRemoval(timestamp, element, duration, start, startHeight) {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    // Calculate the percentage of time elapsed
    const percentage = Math.min(1, progress / duration);

    // Calculate the new height based on the percentage
    const newHeight = startHeight * (1 - percentage);

    element.style.height = newHeight + "px";

    if (element.offsetHeight == 0) {
        finishElementRemoval(element);
    } else {
        window.requestAnimationFrame((timestamp) => {
            elementRemoval(timestamp, element, duration, start, startHeight);
        });
    }
}
