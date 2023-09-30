import * as TimeMachine from "./timeMachine.js";

export async function generateQuote() {
  try {
    const response = await fetch("../json/quotes.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const quotes = await response.json();
    let jsonObjectIndex = Math.floor(Math.random() * quotes.length);
    let quoteObject = {
      id: TimeMachine.currentDateFormatted,
      quote: `"${quotes[jsonObjectIndex].quote}"`,
      author: quotes[jsonObjectIndex].author,
    };
    quoteObject.author[0] == "-" || quoteObject.author[0] == " "
      ? (quoteObject.author = quoteObject.author.slice(1))
      : null;
    return quoteObject;
  } catch (error) {
    console.error("Error loading JSON:", error.message);
  }
}