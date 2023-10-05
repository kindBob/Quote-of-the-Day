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
      "quote-en": `"${quotes[jsonObjectIndex]["quote-en"].trim()}"`,
      "author-en": quotes[jsonObjectIndex]["author-en"].trim(),
      "quote-ru": `"${quotes[jsonObjectIndex]["quote-ru"].trim()}"`,
      "author-ru": quotes[jsonObjectIndex]["author-ru"].trim(),
      "quote-uk": (quotes[jsonObjectIndex]["quote-uk"] = quotes[
        jsonObjectIndex
      ]["quote-uk"]
        ? `${quotes[jsonObjectIndex]["quote-uk"].trim()}`
        : undefined),
      "author-uk": (quotes[jsonObjectIndex]["author-uk"] = quotes[
        jsonObjectIndex
      ]["author-uk"]
        ? quotes[jsonObjectIndex]["author-uk"].trim()
        : undefined),
    };

    const previousQuotes = JSON.parse(localStorage.getItem("previousQuotes"));

    if (previousQuotes != null) {
      for (let i = 0; i < previousQuotes.length; i++) {
        if (quoteObject["quote-en"] == previousQuotes[i]["quote-en"]) {
          return generateQuote();
        }
      }
    }

    return quoteObject;
  } catch (error) {
    console.error("Error loading JSON:", error.message);
  }
}
