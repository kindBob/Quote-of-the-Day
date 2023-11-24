import { findTranslation, initialLocale } from "./languageManager.js";
import { manageSavedQuotes, setupFontSizes, previousQuotes } from "./quotesManager.js";

const burgerMenu = document.querySelector(".nav-bar__burger-menu");
const mainHeader = document.querySelector("#main-header");
const mainNavBar = mainHeader.querySelector(".nav-bar");
const mainNavBarList = mainHeader.querySelector(".nav-bar__list");

const savedOpenButton = document.querySelector("#saved-open-button");
const savedSection = document.querySelector("#saved-section");
const savedBackButtons = savedSection.querySelectorAll(".back-button");

const quotesSections = document.querySelectorAll(".quotes-section");
const mainSection = document.querySelector("#main-section");

const historyContainer = document.querySelector("#history-container");

const sharingCard = document.querySelector("#sharing-card");
const sharingCardQuoteOutput = document.querySelector("#sharing-card-quote");
const sharingCardAuthorOutput = document.querySelector("#sharing-card-author");
const sharingCardDateOutput = document.querySelector("#sharing-card-date");

const loadingElement = document.querySelector("#loading");
const loadingStatus = loadingElement.querySelector(".status");
const loadingStatusText = loadingStatus.querySelector(".status__text");
const loadingElementSpinner = loadingElement.querySelector(".spinner");

const emailSubForm = document.querySelector("#email-sub-form");
const emailSubEmailInput = emailSubForm.email;
const emailSubResult = emailSubForm.querySelector(".email-sub-form__result");

const submissionElement = document.querySelector("#submission");
const submissionForm = submissionElement.querySelector("form");
const submissionEmail = submissionForm.email;
const submissionAuthor = submissionForm.author;
const submissionQuote = submissionForm.quote;
const submissionCloseBtn = submissionElement.querySelector(".close-btn");
const submisssionResult = submissionElement.querySelector("#submission__result");
const actionBtn = document.querySelector("#action-btn");

const showMoreBtn = document.querySelector("#show-more");

const overlay = document.querySelector("#overlay");
const mainSectionBgBlur = document.querySelector(".bg-blur.section");
const bodyBgBlur = document.querySelector(".bg-blur.body");

const legalPolicyLink = document.querySelector("#legal-policy");
const legalTermsLink = document.querySelector("#legal-terms");

let quoteAbleToFlip = true;

const MAIN_PAGE = window.location.href;
const IMAGE_UPLOAD_API = "https://quote-of-the-day-api.up.railway.app/shareQuote";
const EMAIL_SUBSCRIPTION_API = "https://quote-of-the-day-api.up.railway.app/subscribe";
const SUBMISSIONS_API = "https://quote-of-the-day-api.up.railway.app/submission";
// const SUBMISSIONS_API = "http://localhost:3000/submission";
// const EMAIL_SUBSCRIPTION_API = "http://localhost:3000/subscribe";
// const IMAGE_UPLOAD_API_URL = "http://localhost:3000/shareQuote";

let sharingInProcess = false;
let isScreenSmall = detectSmallScreen();

const quotesSectionsTransitionTime = isScreenSmall ? 600 : 800;
const quoteFlippingLength = 600;

export let isSavedSectionOpened = false;

// Basic
document.addEventListener("DOMContentLoaded", () => {
    //Quotes
    quotesSections.forEach((section) => (section.style.transition = `transform ${quotesSectionsTransitionTime}ms`));

    savedSection.style.width = "0";

    historyContainer.style.maxHeight = `${(380 + 50) * 3}px`;

    //Links
    legalPolicyLink.setAttribute("href", `/pages/${initialLocale}/privacy-policy.html`);
    legalTermsLink.setAttribute("href", `/pages/${initialLocale}/terms-of-service.html`);
});

document.addEventListener("click", (event) => {
    if (!isScreenSmall) return;

    if (
        mainNavBar.classList.contains("--active") &&
        !burgerMenu.contains(event.target) &&
        !mainNavBarList.contains(event.target)
    )
        closeNavBarList();

    setupQuotesFlipping(event);
});

function detectSmallScreen() {
    return window.screen.width <= 768;
}

function validateEmail(email) {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function lockScrolling(element = document.body) {
    element.style.overflowY = "hidden";
}

function unlockScrolling(element = document.body) {
    element.style.overflowY = "auto";
}

function resetInputsFocus(inputs) {
    inputs.forEach((input) => {
        input.blur();
        input.value = "";
    });
}
// Basic ---
// Genereal
function handleRequestErrors(errCode) {
    //1 - duplicate, 2- invalid, 3 - anything else
    let errMessage = null;

    switch (errCode) {
        case 1:
            errMessage = findTranslation("sub-error_1");
            break;

        case 2:
            errMessage = findTranslation("sub-error_2");
            break;

        default:
            errMessage = findTranslation("sub-error_3");
            break;
    }

    return errMessage;
}

let timeoutId = null;
function displayRequestResult(options) {
    let { success, message, displayElement } = options;

    let timeoutLength = 0;

    displayElement.classList.remove("--active", "--failure", "--success", "--loading");

    if (success !== null) {
        if (success === false) {
            displayElement.classList.add("--failure");
        } else {
            displayElement.classList.add("--success");
        }

        timeoutLength = 4000;
    } else {
        message = message + "...";
        timeoutLength = 999999;
    }

    displayElement.children[0].textContent = message;

    displayElement.classList.add("--active");

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        displayElement.classList.remove("--active");
    }, timeoutLength);
}
// General ---
// Submission
submissionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    checkSubmission();
});

submissionQuote.addEventListener("keydown", (e) => {
    if (e.keyCode == "13") {
        e.preventDefault();

        if (!submissionForm.checkValidity()) return submissionForm.reportValidity();

        checkSubmission();
    }
});

actionBtn.addEventListener("click", () => {
    openSubmission();
});

bodyBgBlur.addEventListener("click", () => {
    if (submissionElement.classList.contains("--active")) closeSubmissions();
});

submissionCloseBtn.addEventListener("click", () => {
    closeSubmissions();
});

function openSubmission() {
    submissionElement.classList.add("--active");

    bodyBgBlur.classList.add("--active");

    lockScrolling();
}

function closeSubmissions() {
    submissionElement.classList.remove("--active");

    bodyBgBlur.classList.remove("--active");

    unlockScrolling();
}

function checkSubmission() {
    if (submissionEmail.value) {
        const isEmailValid = validateEmail(submissionEmail.value);

        if (!isEmailValid) {
            displayRequestResult({
                success: false,
                message: handleRequestErrors(2),
                displayElement: submisssionResult,
            });
        }
    }

    sendSubmission();
}

async function sendSubmission() {
    const headers = new Headers();
    headers.append("content-type", "application/json");

    const body = JSON.stringify({
        email: submissionEmail.value,
        author: submissionAuthor.value,
        quote: submissionQuote.value,
    });

    displayRequestResult({ success: null, message: findTranslation("sub-loading"), displayElement: submisssionResult });

    const response = await fetch(SUBMISSIONS_API, {
        method: "POST",
        headers,
        body,
    });

    if (response.ok) {
        displayRequestResult({
            success: true,
            message: findTranslation("submission-success"),
            displayElement: submisssionResult,
        });

        resetInputsFocus(submissionForm.querySelectorAll(".submission-input"));

        return;
    }

    const data = await response.json();

    displayRequestResult({
        success: false,
        message: handleRequestErrors(data.errCode),
        displayElement: submisssionResult,
    });
}
// Submission ---
// Email sub
emailSubForm.addEventListener("submit", (e) => {
    e.preventDefault();

    subscribe();
});

async function subscribe() {
    const inputValue = emailSubEmailInput.value;

    if (!validateEmail(inputValue)) {
        displayRequestResult({
            success: false,
            message: handleRequestErrors(2),
            displayElement: emailSubResult,
        });
    } else {
        displayRequestResult({
            success: null,
            message: findTranslation("sub-loading"),
            displayElement: emailSubResult,
        });

        const response = await fetch(EMAIL_SUBSCRIPTION_API, {
            method: "POST",
            body: JSON.stringify({
                email: inputValue,
                lang: initialLocale,
            }),
            headers: {
                "content-type": "application/json",
            },
        });

        if (response.ok) {
            displayRequestResult({
                success: true,
                message: findTranslation("sub-success"),
                displayElement: emailSubResult,
            });
            resetInputsFocus([emailSubEmailInput]);

            return;
        }

        const data = await response.json();

        displayRequestResult({
            success: false,
            message: handleRequestErrors(data.errCode),
            displayElement: emailSubResult,
        });
    }
}
// Email sub ---
// Sharing
export function setupSharingCard(event) {
    const parent = event.target.closest(".quotes-element");

    const quoteOutput = parent.querySelector(".quotes-element__quote");
    const authorOutput = parent.querySelector(".quotes-element__author");
    const dateOutput = parent.querySelector(".quotes-element__date");

    sharingCardAuthorOutput.textContent = authorOutput.textContent;
    sharingCardQuoteOutput.textContent = quoteOutput.textContent;
    sharingCardDateOutput.textContent = dateOutput.textContent;

    setupFontSizes();

    setupSharingProcess();
}

async function setupSharingProcess() {
    html2canvas(sharingCard, { dpi: 600 }).then(async (canvas) => {
        const imageDataUrl = canvas.toDataURL("image/png", 1);

        if (navigator.share && isScreenSmall) {
            shareCard_mobiles(imageDataUrl);
        } else {
            await shareCard_notMobiles(imageDataUrl);
        }
    });
}

async function shareCard_notMobiles(imageDataUrl) {
    if (sharingInProcess) {
        return;
    }
    sharingInProcess = true;

    try {
        loadingElement.classList.add("--active");
        loadingElementSpinner.classList.add("--active");

        loadingElement.classList.remove("--success", "--error");

        const res = await fetch(`${IMAGE_UPLOAD_API}?fileName=quote-card`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageDataUrl }),
        });

        const data = await res.json();
        const quoteLink = data.link;

        await navigator.clipboard.writeText(quoteLink);

        loadingStatusText.textContent = findTranslation("saved-to-clipboard");
        loadingElement.classList.add("--success");
    } catch (error) {
        loadingStatusText.textContent = findTranslation("error-saving-to-clipboard");
        loadingElement.classList.add("--error");

        console.log(`Some error occured while sharing: ${error.message}`);
    }

    loadingElementSpinner.classList.remove("--active");
    loadingElement.style.width = loadingStatus.offsetWidth + "px";
    loadingStatus.classList.add("--active");

    setTimeout(() => {
        loadingElement.classList.remove("--active");
        loadingStatus.classList.remove("--active");
        loadingElement.style.width = "90px";
    }, 3000);
    sharingInProcess = false;
}

async function shareCard_mobiles(imageDataUrl) {
    const blobImage = dataURItoBlob(imageDataUrl);
    const imageFile = new File([blobImage], "quote-card.png", {
        type: "image/png",
    });

    const navigatorShareTitle = findTranslation("sharing-card-title");
    const navigatorShareText = findTranslation("sharing-card-text");

    navigator
        .share({
            title: navigatorShareTitle,
            text: `${navigatorShareText}: ` + MAIN_PAGE,
            files: [imageFile],
        })
        .catch((error) => console.log(`Problems occured: ${error}`));
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

    mainSectionBgBlur.classList.toggle("--active");

    mainNavBar.classList.contains("--active") ? lockScrolling() : unlockScrolling();
});

savedOpenButton.addEventListener("click", () => {
    isScreenSmall ? closeNavBarList(() => toggleSaved(1)) : toggleSaved(1);
});

function closeNavBarList(cb) {
    mainNavBar.classList.remove("--active");
    burgerMenu.classList.remove("--active");
    mainSectionBgBlur.classList.remove("--active");

    mainNavBarList.addEventListener("transitionend", cb);
    setTimeout(() => {
        mainNavBarList.removeEventListener("transitionend", cb);
        unlockScrolling();
    }, 500);
}
// Header ---
// Quotes
showMoreBtn.addEventListener("click", () => {
    if (showMoreBtn.textContent.includes(findTranslation("show-more-btn__show-more"))) {
        showMorePreviousQuotes();
        return;
    }

    showLessPreviousQuotes();
});

function showMorePreviousQuotes() {
    historyContainer.style.maxHeight = `${(380 + 50) * previousQuotes.length}px`;

    showMoreBtn.textContent = findTranslation("show-more-btn__show-less");
}

function showLessPreviousQuotes() {
    const allMainPageQuotes = document.querySelectorAll(".main-page-quote");

    allMainPageQuotes[3].scrollIntoView({
        behavior: "smooth",
        block: "end",
    });

    setTimeout(() => {
        historyContainer.style.maxHeight = `${(380 + 50) * 3}px`;

        showMoreBtn.textContent = findTranslation("show-more-btn__show-more");
    }, 700);
}

export function setupSavingButtonsEL(buttons = []) {
    buttons.forEach((button) => {
        if (!button.classList.contains("--hasEL")) {
            button.addEventListener("click", (event) => {
                manageSavedQuotes(button, event.target.closest(".quotes-element"));
            });
            button.classList.add("--hasEL");
        }
    });
}

export function setSharingButtonsEL(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", (event) => {
            setupSharingCard(event);
        });
    }
}

function setupQuotesFlipping(event) {
    let allClickableQuotes = Array.from(document.querySelectorAll(".quotes-element.--clickable"));

    allClickableQuotes.forEach((element) => {
        element.querySelector(".quotes-element__inner-container").style.transition = `${quoteFlippingLength}ms`;
    });

    const clickedQuote = event.target.classList.contains("--clickable")
        ? event.target.classList.contains("--clickable")
        : event.target.closest(".quotes-element");

    allClickableQuotes = allClickableQuotes.filter((element) => element.id !== clickedQuote?.id);

    allClickableQuotes = allClickableQuotes.filter((element) => element.id !== clickedQuote?.id);

    flipQuoteBack(allClickableQuotes);

    if (event.target.classList.contains("--clickable") || event.target.closest(".quotes-element")) {
        flipQuote(event);
    }
}

function flipQuote(event) {
    const target = event.target;
    let element = event.target.closest(".quotes-element");

    if (target.classList.contains("quotes-element")) {
        element = target;
    }

    if (!quoteAbleToFlip) return console.log("returned");

    if (
        !target.classList.contains("quotes-element__buttons-container") &&
        !target.closest(".quotes-element__buttons-container")
    ) {
        element.classList.toggle("--flipped");
    }

    quoteAbleToFlip = false;
    setTimeout(() => (quoteAbleToFlip = true), quoteFlippingLength);
}

function flipQuoteBack(elements) {
    if (!quoteAbleToFlip) return;
    elements.forEach((element) => element.classList.remove("--flipped"));
}

export function hideShowMoreBtn() {
    showMoreBtn.style.display = "none";
}
// Quotes ---
// Sections
savedBackButtons.forEach((button) => button.addEventListener("click", () => toggleSaved(2)));

function toggleSaved(act) {
    //act = 1 - open, act = 2 - close

    window.scrollTo({
        behavior: "smooth",
        top: 0,
        left: 0,
    });

    if (act == 1) {
        isSavedSectionOpened = true;
        savedSection.style.width = "100%";

        savedSection.classList.add("--active");
        mainSection.classList.add("--inactive");
    } else {
        isSavedSectionOpened = false;

        mainSection.style.width = "100%";

        savedSection.classList.remove("--active");
        mainSection.classList.remove("--inactive", "--left-side");
    }

    lockScrolling();
    overlay.classList.add("--active");

    setTimeout(() => {
        act == 1 ? (mainSection.style.width = "0") : (savedSection.style.width = "0");
    }, quotesSectionsTransitionTime);

    setTimeout(() => {
        unlockScrolling();
        overlay.classList.remove("--active");
    }, quotesSectionsTransitionTime + 100);
}
// Sections ---
