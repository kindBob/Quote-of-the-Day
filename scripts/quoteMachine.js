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
      quote: `"${quotes[jsonObjectIndex].quote.trim()}"`,
      author: quotes[jsonObjectIndex].author.trim(),
    };

    const previousQuotes = JSON.parse(localStorage.getItem("previousQuotes"));

    if (previousQuotes != null) {
      for (let i = 0; i < previousQuotes.length; i++) {
        if (quoteObject.quote == previousQuotes[i].quote) {
          return generateQuote();
        }
      }
    }

    return quoteObject;
  } catch (error) {
    console.error("Error loading JSON:", error.message);
  }
}
