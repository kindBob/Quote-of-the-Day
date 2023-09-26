import { generateQuote } from "./quoteMachine.js";
import * as TimeMachine from "./timeMachine.js";

const dateOuputs = document.querySelectorAll(".quotes-element__date");

const quoteOutput = document.querySelectorAll(".quotes-element__quote");
const authorOutput = document.querySelectorAll(".quotes-element__author");

dateOuputs[0].innerHTML = TimeMachine.currentDateFormatted;
dateOuputs[1].innerHTML = TimeMachine.tomorrowsDateFormatted;
dateOuputs[2].innerHTML = TimeMachine.afterTomorrowsDayFormatted;

const quoteAuthorRegex = /(\S+)\s+([a-z]{3,})/i;
const spacesRegex = /\s[\w]/g;

if (
  localStorage.getItem("currentQuote") == null ||
  JSON.parse(localStorage.getItem("currentQuote")).id != TimeMachine.currentDay
) {
  generateQuote().then((quoteObject) => {
    if (quoteObject.author.match(spacesRegex).length > 1) {
      authorOutput[0].classList.add("--smaller-font-size");
    }

    for (let i = 0; i < quoteOutput.length; i++) {
      quoteOutput[i].innerHTML = quoteObject.quote;
      authorOutput[i].innerHTML = quoteObject.author.replace(
        quoteAuthorRegex,
        "$1<br>$2"
      );
    }

    localStorage.setItem("currentQuote", JSON.stringify(quoteObject));
  });
} else {
  let quoteObject = JSON.parse(localStorage.getItem("currentQuote"));

  if (quoteObject.author.match(spacesRegex).length > 1) {
    authorOutput[0].classList.add("--smaller-font-size");
  }

  for (let i = 0; i < quoteOutput.length; i++) {
    quoteOutput[i].innerHTML = quoteObject.quote;
    authorOutput[i].innerHTML = quoteObject.author.replace(
      quoteAuthorRegex,
      "$1<br>$2"
    );
  }
}
