import { getLocalizationData } from "./languageManager.js";

const navBar = document.querySelector(".nav-bar");
const navBarList = document.querySelector(".nav-bar__list");
const burgerMenu = document.querySelector(".nav-bar__burger-menu");
const mainHeader = document.querySelector("#main-header");

const historyOpenButton = document.querySelector("#history-open-button");
const historyHeader = document.querySelector("#history-header");
const historyBackButton = document.querySelector("#history-back-button");
const historySection = document.querySelector("#history-section");

const savedOpenButton = document.querySelector("#saved-open-button");
const savedHeader = document.querySelector("#saved-header");
const savedBackButton = document.querySelector("#saved-back-button");
const savedSection = document.querySelector("#saved-section");

const mainSection = document.querySelector("#main-section");

const quotesElements = document.querySelectorAll(".quotes-element");

const sharingCard = document.querySelector("#sharing-card");
const sharingCardQuoteOutput = document.querySelector("#sharing-card-quote");
const sharingCardAuthorOutput = document.querySelector("#sharing-card-author");
const sharingCardDateOutput = document.querySelector("#sharing-card-date");

const MAIN_PAGE = window.location.href;

// Sharing
export function setupSharingCard(event) {
  const parent = event.target.closest(".quotes-element");

  const quoteOutput = parent.querySelector(".quotes-element__quote");
  const authorOutput = parent.querySelector(".quotes-element__author");
  const dateOutput = parent.querySelector(".quotes-element__date");

  sharingCardAuthorOutput.innerHTML = authorOutput.textContent;
  sharingCardQuoteOutput.innerHTML = quoteOutput.textContent;
  sharingCardDateOutput.innerHTML = dateOutput.textContent;

  shareCard();
}

async function shareCard() {
  html2canvas(sharingCard, { dpi: 300 }).then(async (canvas) => {
    const imageDataUrl = canvas.toDataURL("image/png", 1.0);
    const localizationData = await getLocalizationData();
    const secondaryText = localizationData["sharing-card-secondary-text"];

    if (navigator.share) {
      navigator
        .share({
          title: "My quote of the Day",
          text: `${secondaryText}: ` + MAIN_PAGE,
          files: [
            new File([dataURItoBlob(imageDataUrl)], "quote-card.png", {
              type: "image/png",
            }),
          ],
        })
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

  mainHeader.classList.add("--inactive");
});

savedOpenButton.addEventListener("click", () => {
  savedHeader.classList.add("--active");
  savedSection.classList.add("--active");

  mainSection.classList.add("--inactive", "--left-side");

  mainHeader.classList.add("--inactive");
});

function closeNavBarList() {
  navBar.classList.remove("--active");
  burgerMenu.classList.remove("--active");

  navBar.classList.contains("--active")
    ? (document.body.style.overflowY = "hidden")
    : (document.body.style.overflowY = "auto");
}
// Header ---
// Quotes
if (screen.width <= 768) {
  quotesElements.forEach((element) => {
    element.addEventListener("click", (event) => {
      if (
        !event.target.classList.contains("button-list") &&
        !event.target.classList.contains("button")
      ) {
        element.classList.toggle("--flipped");
      }
    });
  });

  document.addEventListener("click", (event) => {
    quotesElements.forEach((element) => {
      if (!element.contains(event.target))
        element.classList.remove("--flipped");
    });
  });
}
// Quotes ---
// Sections
historyBackButton.addEventListener("click", closeHistory);

function closeHistory() {
  historyHeader.classList.remove("--active");
  historySection.classList.remove("--active");

  mainSection.classList.remove("--inactive");

  mainHeader.classList.remove("--inactive");
}

savedBackButton.addEventListener("click", closeSaved);

function closeSaved() {
  savedHeader.classList.remove("--active");
  savedSection.classList.remove("--active");

  mainSection.classList.remove("--inactive", "--left-side");

  mainHeader.classList.remove("--inactive");
}
// Setions ---
