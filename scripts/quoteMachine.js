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
        };

        if (quotes["quote-uk"]) {
            quoteObject["quote-uk"] = `"${quoteData["quote-uk"].trim()}"`;
        }

        if (quotes["author-uk"]) {
            quoteObject["author-uk"] = quoteData["author-uk"].trim();
        }

        const previousQuotes = JSON.parse(localStorage.getItem("previousQuotes"));

        if (previousQuotes) {
            for (let i = 0; i < previousQuotes.length; i++) {
                if (quoteObject["quote-en"] == previousQuotes[i]["quote-en"]) {
                    generateQuote();
                    return;
                }
            }
        }

        return quoteObject;
    } catch (error) {
        console.error("Error loading JSON:", error.message);
    }
}
