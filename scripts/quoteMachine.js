export function generateQuote(quote) {
  return fetch("../json/quotes.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((quotes) => {
      let jsonObjectIndex = Math.floor(Math.random() * quotes.length);
      let quoteObject = {
        id: new Date().getDate(),
        quote: `"${quotes[jsonObjectIndex].quote}"`,
        author: quotes[jsonObjectIndex].author,
      };
      quoteObject.author[0] == "-" || quoteObject.author[0] == " "
        ? (quoteObject.author = quoteObject.author.slice(1))
        : null;

      return quoteObject; 
    })
    .catch((error) => {
      console.error("Error loading JSON:", error.message);
    });
}

export function checkForSavedQuote(saveName){
  if(localStorage.getItem(saveName) != null){
    return localStorage.getItem(saveName);
  }
  else{
    return false;
  }
  
}
