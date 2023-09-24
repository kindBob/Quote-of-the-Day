import { generateQuote, checkForSavedQuote } from "./quoteMachine.js";

const currentDate = new Date();
const tomorrowsDate = new Date(currentDate);
tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);
const afterTomorrowsDate = new Date(currentDate);
afterTomorrowsDate.setDate(afterTomorrowsDate.getDate() + 2);

const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();

const tomorrowsMonth = tomorrowsDate.getMonth() + 1;
const tomorrowsDay = tomorrowsDate.getDate();

const afterTomorrowsMonth = afterTomorrowsDate.getMonth() + 1;
const afterTomorrowsDay = afterTomorrowsDate.getDate();

const currentDateFormatted = `${currentDay
  .toString()
  .padStart(2, "0")}.${currentMonth.toString().padStart(2, "0")}`;
const tomorrowsDateFormatted = `${tomorrowsDay
  .toString()
  .padStart(2, "0")}.${tomorrowsMonth.toString().padStart(2, "0")}`;

const afterTomorrowsDayFormatted = `${afterTomorrowsDay
  .toString()
  .padStart(2, "0")}.${afterTomorrowsMonth.toString().padStart(2, "0")}`;

const dateOuputs = document.querySelectorAll(".quotes-element__date");

const quoteOutput = document.querySelector(".quotes-element__quote");
const authorOutput = document.querySelector(".quotes-element__author");

const lineBreak = document.createElement("br");

dateOuputs[0].innerHTML = currentDateFormatted;
dateOuputs[1].innerHTML = tomorrowsDateFormatted;
dateOuputs[2].innerHTML = afterTomorrowsDayFormatted;

if (
  localStorage.getItem("currentQuote") == null ||
  localStorage.getItem("currentQuote").id != currentDate
) {
  generateQuote().then((quoteObject) => {
    
    quoteOutput.innerHTML = quoteObject.quote;
    authorOutput.innerHTML = quoteObject.author.replace(/ /, "<br>");;

    quoteOutput.appendChild(lineBreak);

    localStorage.setItem("currentQuote", JSON.stringify(quoteObject));
  });
} else {
  let quoteObject = JSON.parse(localStorage.getItem("currentQuote"));

  quoteOutput.innerHTML = quoteObject.quote;
  authorOutput.innerHTML = quoteObject.author.replace(/ /, "<br>");;
}
