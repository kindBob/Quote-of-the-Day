const navBar = document.querySelector(".nav-bar");
const navBarList = document.querySelector(".nav-bar__list");
const burgerMenu = document.querySelector(".nav-bar__burger-menu");
const historyOpenButton = document.querySelector("#history-open-button");
const historyHeader = document.querySelector(".history-header");
const historyBackButton = document.querySelector("#history__back-button");
const historySection = document.querySelector("#history-section");
const mainSection = document.querySelector("#main-section");

const quoteElement = document.querySelector(".quotes-element");

const sharingCard = document.querySelector("#sharing-card");
const shareButtons = document.querySelectorAll(".share-button");
const sharingCardQuoteOutput = document.querySelector("#sharing-card-quote");
const sharingCardAuthorOutput = document.querySelector("#sharing-card-author");
const sharingCardDateOutput = document.querySelector("#sharing-card-date");

const MAIN_PAGE = window.location.href;

// Sharing
function setupSharingCard(event){
  const parent = event.target.closest(".quotes-element");
  
  const quoteOutput = parent.querySelector(".quotes-element__quote");
  const authorOutput = parent.querySelector(".quotes-element__author");
  const dateOutput = parent.querySelector(".quotes-element__date");

  sharingCardAuthorOutput.innerHTML = authorOutput.textContent;
  sharingCardQuoteOutput.innerHTML = quoteOutput.textContent;
  sharingCardDateOutput.innerHTML = dateOutput.textContent;

  shareCard();
}

function shareCard() {
  html2canvas(sharingCard, { dpi: 300 }).then((canvas) => {
    const imageDataUrl = canvas.toDataURL("image/png", 1.0);

    if (navigator.share) {
      navigator
        .share({
          title: "My quote of the Day",
          text:
            "Check out my quote of the day. You can find yours here: " +
            MAIN_PAGE,
          files: [
            new File([dataURItoBlob(imageDataUrl)], "quote-card.png", {
              type: "image/png",
            }),
          ],
        })
        .then(() => console.log("Sharing works!"))
        .catch((error) => console.log(`Problems occured: ${error}`));
    } else {
      alert("Your browser doesn't support sharing yet");
    }
  });
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
// Sharing ---
// Header
burgerMenu.addEventListener("click", () => {
  navBar.classList.toggle("--active");
  burgerMenu.classList.toggle("--active");

  navBar.classList.contains("--active")
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");
});

document.addEventListener("click", (event) => {
  if (
    navBar.classList.contains("--active") &&
    !burgerMenu.contains(event.target)
  )
    closeNavBarList();
});

for (let i = 0; i < navBar.children.length; i++) {
  navBarList.children[i].addEventListener("click", closeNavBarList);
}

historyOpenButton.addEventListener("click", () => {
  historyHeader.classList.add("--active");
  historySection.classList.add("--active");

  mainSection.classList.add("--inactive");
});

function closeNavBarList() {
  navBar.classList.remove("--active");
  burgerMenu.classList.remove("--active");

  navBar.classList.contains("--active")
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");
}
// Header ---
// Quotes
quoteElement.addEventListener("click", (event) => {
  if (event.target.id != "quotes-element__share-button")
    quoteElement.classList.toggle("--flipped");
});

document.addEventListener("click", (event) => {
  if (!quoteElement.contains(event.target))
    quoteElement.classList.remove("--flipped");
});
// Quotes ---
// Sections
historyBackButton.addEventListener("click", closeHistory);

function closeHistory() {
  historyHeader.classList.remove("--active");
  historySection.classList.remove("--active");

  mainSection.classList.remove("--inactive");
}
// Setions ---
