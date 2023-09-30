import { generateQuote } from "./quoteMachine.js";
import * as TimeMachine from "./timeMachine.js";

const dateOuputs = document.querySelectorAll(".quotes-element__date");

const currentQuoteOutput = document.querySelector("#current-quote");
const currentAuthorOutput = document.querySelector("#current-author");

const sharingCardQuoteOutput = document.querySelector("#sharing-card-quote");
const sharingCardAuthorOutput = document.querySelector("#sharing-card-author");

const historyContainer = document.querySelector("#history-container");
const historyQuote = document.querySelector(".history__quote-element");

dateOuputs[0].innerHTML = TimeMachine.currentDateFormatted;
dateOuputs[1].innerHTML = TimeMachine.tomorrowsDateFormatted;
dateOuputs[2].innerHTML = TimeMachine.afterTomorrowsDayFormatted;

let previousQuotes = [];

if (
  localStorage.getItem("currentQuote") == null ||
  JSON.parse(localStorage.getItem("currentQuote")).id !=
    TimeMachine.currentDateFormatted
) {
  generateQuote().then((quoteObject) => {
    if (quoteObject.quote.length >= 230) {
      currentQuoteOutput.classList.add("--smaller-font-size");
    }
  
    if (quoteObject.author.split(" ").length > 2) {
      currentAuthorOutput.classList.add("--smaller-font-size");
    }

    currentQuoteOutput.innerHTML = quoteObject.quote;
    currentAuthorOutput.innerHTML = quoteObject.author;

    sharingCardQuoteOutput.innerHTML = quoteObject.quote;
    sharingCardAuthorOutput.innerHTML = quoteObject.author;

    localStorage.setItem("currentQuote", JSON.stringify(quoteObject));

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

    if (previousQuotes.length > 1) {
      for (let i = 0; i < previousQuotes.length - 1; i++) {
        const quoteElementClone = historyQuote.cloneNode(1);
        historyContainer.prepend(quoteElementClone);
      }
    }

    for (let i = 0; i < previousQuotes.length; i++) {
      document.querySelectorAll(".history__quotes-element-date")[i].innerHTML =
        previousQuotes[i].id;
      document.querySelectorAll(".history__quotes-element-author")[
        i
      ].innerHTML = previousQuotes[i].author;
      document.querySelectorAll(".history__quotes-element-quote")[i].innerHTML =
        previousQuotes[i].quote;
    }
  });
} else {
  let quoteObject = JSON.parse(localStorage.getItem("currentQuote"));

  if (quoteObject.quote.length >= 230) {
    currentQuoteOutput.classList.add("--smaller-font-size");
  }

  if (quoteObject.author.split(" ").length > 2) {
    currentAuthorOutput.classList.add("--smaller-font-size");
  }

  currentQuoteOutput.innerHTML = quoteObject.quote;
  currentAuthorOutput.innerHTML = quoteObject.author;

  sharingCardQuoteOutput.innerHTML = quoteObject.quote;
  sharingCardAuthorOutput.innerHTML = quoteObject.author;

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
      previousQuotes[i].author;
    document.querySelectorAll(".history__quotes-element-quote")[i].innerHTML =
      previousQuotes[i].quote;
  }
}
