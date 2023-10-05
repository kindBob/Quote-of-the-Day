import { generateQuote } from "./quoteMachine.js";
import * as TimeMachine from "./timeMachine.js";
import { initialLocale } from "./languageManager.js";

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
  console.log("cleared");
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
    JSON.parse(localStorage.getItem("currentQuote")).id !=
      TimeMachine.currentDateFormatted
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
    !quoteObject.hasOwnProperty("quote-uk")
      ? (quoteObjectQuote = quoteObject["quote-ru"])
      : null;

    !quoteObject.hasOwnProperty("author-uk")
      ? (quoteObjectAuthor = quoteObject["author-ru"])
      : null;
  }

  if (quoteObjectQuote.length >= 230) {
    currentQuoteOutput.classList.add("--smaller-font-size");
  }

  if (quoteObjectAuthor.split(" ").length > 2) {
    currentAuthorOutput.classList.add("--smaller-font-size");
  }

  currentQuoteOutput.innerHTML = quoteObjectQuote;
  currentAuthorOutput.innerHTML = quoteObjectAuthor;

  sharingCardQuoteOutput.innerHTML = quoteObjectQuote;
  sharingCardAuthorOutput.innerHTML = quoteObjectAuthor;

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
}

function setupPreviousQuotes() {
  if (previousQuotes.length > 1) {
    for (let i = 0; i < previousQuotes.length - 1; i++) {
      const quoteElementClone = historyQuote.cloneNode(1);
      historyContainer.prepend(quoteElementClone);
    }
  }

  for (let i = 0; i < previousQuotes.length; i++) {
    document.querySelectorAll(".history__quotes-element-date")[i].innerHTML =
      previousQuotes[i].id;
    document.querySelectorAll(".history__quotes-element-author")[i].innerHTML =
      previousQuotes[i][initialLocaleAuthor];
    document.querySelectorAll(".history__quotes-element-quote")[i].innerHTML =
      previousQuotes[i][initialLocaleQuote];
  }
}

function setupSavingButtons() {
  document
    .querySelectorAll(".quotes-element__saving-button")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        manageSavedQuotes(button, event.target.closest(".quotes-element"));
      });
    });
}

function updateQuotes(act) {
  if (savedQuotes.length == 0) {
    document
      .querySelectorAll(".saved__quote-element")[0]
      .classList.add("--hidden");
    savedSection.classList.add("--is-empty");
  } else {
    document
      .querySelectorAll(".saved__quote-element")[0]
      .classList.remove("--hidden");
    savedSection.classList.remove("--is-empty");

    if (act !== "unsave") {
      for (let i = 0; i < savedQuotes.length; i++) {
        document
          .querySelectorAll(".quotes-element__saving-button")
          .forEach((button) => {
            if (
              savedQuotes[i].id ===
              button
                .closest(".quotes-element")
                .querySelector(".quotes-element__date").innerHTML
            ) {
              getLocalizationContent().then((content) => {
                button.innerHTML = content["unsave-button"];
              });
            }
          });
      }

      for (let i = 0; i < savedQuotes.length - 1; i++) {
        if (
          savedQuotes.length >
          document.querySelectorAll(".saved__quote-element").length
        ) {
          let clone = createClone(
            savedContainer,
            document.querySelectorAll(".saved__quote-element")[i]
          );
          clone.addEventListener("click", (event) => {
            manageSavedQuotes(clone, event.target.closest(".quotes-element"));
          });
        }
      }

      for (let i = 0; i < savedQuotes.length; i++) {
        const element = document.querySelectorAll(".saved__quote-element")[i];

        element.querySelector(".saved__quotes-element-date").innerHTML =
          savedQuotes[i].id;
        element.querySelector(".saved__quotes-element-author").innerHTML =
          savedQuotes[i][initialLocaleAuthor];
        element.querySelector(".saved__quotes-element-quote").innerHTML =
          savedQuotes[i][initialLocaleQuote];
      }
    }
  }

  // setupSavingButtons();
}

function createClone(parent, element) {
  const clone = element.cloneNode(true);
  parent.prepend(clone);
  return clone;
}

async function getLocalizationContent() {
  let response = await fetch(`../json/languages/${initialLocale}.json`);
  let localizationContent = await response.json();
  return localizationContent;
}

async function manageSavedQuotes(button, quoteElement) {
  let response = await fetch(`../json/languages/${initialLocale}.json`);
  let localizationContent = await response.json();

  if (button.innerHTML == localizationContent["save-button"]) {
    for (let i = 0; i < previousQuotes.length; i++) {
      if (
        previousQuotes[i].id ==
        quoteElement.querySelector(".quotes-element__date").innerHTML
      ) {
        savedQuotes.unshift(previousQuotes[i]);
        localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
      }
    }
  } else {
    for (let i = 0; i < savedQuotes.length; i++) {
      if (
        savedQuotes[i].id ==
        quoteElement.querySelector(".quotes-element__date").innerHTML
      ) {
        for (
          let j = 0;
          j < document.querySelectorAll(".quotes-element__date").length;
          j++
        ) {
          if (
            savedQuotes[i].id ==
            document.querySelectorAll(".quotes-element__date")[j].innerHTML
          ) {
            document
              .querySelectorAll(".quotes-element__date")
              [j].closest(".quotes-element")
              .querySelectorAll(".quotes-element__button")[1].innerHTML =
              localizationContent["save-button"];

            if (
              document
                .querySelectorAll(".quotes-element__date")
                [j].closest(".saved__quote-element") &&
              savedQuotes.length > 1
            ) {
              document
                .querySelectorAll(".quotes-element__date")
                [j].closest(".saved__quote-element")
                .remove();
            }
          }
        }

        savedQuotes.splice(i, 1);
        localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
      }
    }
    updateQuotes("unsave");
    return;
  }

  updateQuotes();
}

setupSavingButtons();
