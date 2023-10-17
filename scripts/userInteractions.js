import { getLocalizationData } from "./languageManager.js";

const burgerMenu = document.querySelector(".nav-bar__burger-menu");
const mainHeader = document.querySelector("#main-header");
const mainNavBar = mainHeader.querySelector(".nav-bar");
const mainNavBarList = mainHeader.querySelector(".nav-bar__list");

const historyOpenButton = document.querySelector("#history-open-button");
const historyHeader = document.querySelector("#history-header");
const historySection = document.querySelector("#history-section");
const historyBackButtons = historySection.querySelectorAll(".back-button");

const savedOpenButton = document.querySelector("#saved-open-button");
const savedHeader = document.querySelector("#saved-header");
const savedSection = document.querySelector("#saved-section");
const savedBackButtons = savedSection.querySelectorAll(".back-button");

const mainSection = document.querySelector("#main-section");

const sharingCard = document.querySelector("#sharing-card");
const sharingCardQuoteOutput = document.querySelector("#sharing-card-quote");
const sharingCardAuthorOutput = document.querySelector("#sharing-card-author");
const sharingCardDateOutput = document.querySelector("#sharing-card-date");

const MAIN_PAGE = window.location.href;

let smallScreen = false;

export let isSavedSectionOpened = false;

screen.width < 768 ? (smallScreen = true) : (smallScreen = false);

setFlipQuoteEL();

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
    mainNavBar.classList.toggle("--active");
    burgerMenu.classList.toggle("--active");

    setDocumentOverflow();
});

document.addEventListener("click", (event) => {
    mainNavBar.classList.contains("--active") &&
    !burgerMenu.contains(event.target) &&
    !mainNavBarList.contains(event.target)
        ? closeNavBarList()
        : null;
});

historyOpenButton.addEventListener("click", () => {
    smallScreen ? closeNavBarList(openHistorySection) : openHistorySection();
});

function openHistorySection() {
    historyHeader.classList.add("--active");
    historySection.classList.add("--active");

    mainSection.classList.add("--inactive");

    mainHeader.classList.add("--inactive");
}

savedOpenButton.addEventListener("click", () => {
    smallScreen ? closeNavBarList(openSavedSection) : openSavedSection();
});

function openSavedSection() {
    isSavedSectionOpened = true;

    savedHeader.classList.add("--active");
    savedSection.classList.add("--active");

    mainSection.classList.add("--inactive", "--left-side");

    mainHeader.classList.add("--inactive");
}

function closeNavBarList(cb) {
    mainNavBar.classList.remove("--active");
    burgerMenu.classList.remove("--active");

    mainNavBarList.addEventListener("transitionend", cb);
    setTimeout(() => {
        mainNavBarList.removeEventListener("transitionend", cb);
        setDocumentOverflow();
    }, 500);
}

function setDocumentOverflow() {
    mainNavBar.classList.contains("--active")
        ? (document.body.style.overflowY = "hidden")
        : (document.body.style.overflowY = "auto");
}
// Header ---
// Quotes
export function setFlipQuoteEL(element) {
    if (!smallScreen) return;

    if (element) {
        element.addEventListener("click", (event) => {
            flipQuote(event);
        });

        return;
    }

    document.querySelectorAll(".quotes-element").forEach((element) => {
        let listenerType = "mouseup";

        if (smallScreen) listenerType = "touchend";

        element.addEventListener(listenerType, (event) => {
            flipQuote(event);
        });
    });
}

function flipQuote(event) {
    const target = event.target;
    const element = event.target.closest(".quotes-element");

    if (
        !target.classList.contains("quotes-element__buttons-container") &&
        !target.closest(".quotes-element__buttons-container")
    ) {
        element.classList.toggle("--flipped");
    }
}

document.addEventListener("click", (event) => {
    document.querySelectorAll(".quotes-element").forEach((element) => {
        if (!element.contains(event.target)) {
            element.classList.remove("--flipped");
        }
    });
});
// Quotes ---
// Sections
historyBackButtons.forEach((button) => button.addEventListener("click", closeHistory));

function closeHistory() {
    historyHeader.classList.remove("--active");
    historySection.classList.remove("--active");

    mainSection.classList.remove("--inactive");

    mainHeader.classList.remove("--inactive");
}

savedBackButtons.forEach((button) => button.addEventListener("click", closeSaved));

function closeSaved() {
    isSavedSectionOpened = false;

    savedHeader.classList.remove("--active");
    savedSection.classList.remove("--active");

    mainSection.classList.remove("--inactive", "--left-side");

    mainHeader.classList.remove("--inactive");
}
// Setions ---
