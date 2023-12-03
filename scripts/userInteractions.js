import { lenis } from "./animationsManager.js";
import { findTranslation, initialLocale } from "./languageManager.js";
import { manageSavedQuotes, previousQuotes, checkPreviousQuotesReadiness } from "./quotesManager.js";

const QUOTE_FLIPPING_LENGTH = 600;
const IMAGE_UPLOAD_ENDPOINT = "https://api.imgur.com/3/image";
const EMAIL_SUBSCRIPTION_API = "https://quote-of-the-day-api.up.railway.app/subscribe";
const SUBMISSIONS_API = "https://quote-of-the-day-api.up.railway.app/submission";
// const SUBMISSIONS_API = "http://localhost:3000/submission";
// const EMAIL_SUBSCRIPTION_API = "http://localhost:3000/subscribe";

const mainPage = window.location.href;

const burgerMenu = document.querySelector(".nav-bar__burger-menu");
const mainHeader = document.querySelector("#main-header");
const mainNavBar = mainHeader.querySelector(".nav-bar");
const mainNavBarList = mainHeader.querySelector(".nav-bar__list");

const savedOpenButton = document.querySelector("#saved-open-button");
const savedSection = document.querySelector("#saved-section");
const savedCloseButtons = savedSection.querySelectorAll(".close-btn");

const aboutUsOpenButton = document.querySelector("#about-us-open-button");
const aboutUsSection = document.querySelector("#about-us-section");
const aboutUsCloseButtons = aboutUsSection.querySelectorAll(".close-btn");

const sections = document.querySelectorAll(".section");

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

const quoteHint = document.querySelector("#quote-hint");
const overlay = document.querySelector("#overlay");
const mainSectionBgBlur = document.querySelector(".bg-blur-section");
const bodyBgBlur = document.querySelector(".bg-blur-body");

const legalPolicyLink = document.querySelector("#legal-policy");
const legalTermsLink = document.querySelector("#legal-terms");

const smallScreen = detectSmallScreen();
const prefersReducedMotion = detectReducedMotion();
const shareAPINotSupported = detectShareAPISupport();

const sectionTransitionTime = smallScreen ? 600 : 800;

// Genereal
gsap.registerPlugin(ScrollToPlugin);

checkPreviousQuotesReadiness().then(() => {
    historyContainer.style.maxHeight = `${getHistoryQuoteElementsHeight(3)}px`;
});

document.addEventListener("DOMContentLoaded", () => {
    //Sections
    sections.forEach((section) => (section.style.transition = `transform ${sectionTransitionTime}ms`));

    sections.forEach((el) => !el.classList.contains("--active") && changeDisplay(el, "hide"));

    //Quotes
    if (localStorage.getItem("quoteFlipped")) quoteHint.remove();
    else quoteHint.classList.add("--active");
    //Links
    legalPolicyLink.setAttribute("href", `/pages/${initialLocale}/privacy-policy.html`);
    legalTermsLink.setAttribute("href", `/pages/${initialLocale}/terms-of-service.html`);
});

document.addEventListener("click", (event) => {
    if (!smallScreen) return;

    if (
        mainNavBar.classList.contains("--active") &&
        !burgerMenu.contains(event.target) &&
        !mainNavBarList.contains(event.target)
    )
        closeNavBar();

    setupQuotesFlipping(event);
});

function detectSmallScreen() {
    return window.screen.width <= 768;
}

function detectReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function detectShareAPISupport() {
    if (
        /CriOS/.test(navigator.userAgent) &&
        /iPhone/.test(navigator.userAgent) &&
        screen.height == 896 &&
        screen.width == 414
    )
        return true;

    return false;
}

function validateEmail(email) {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function lockScrolling(element = document.body) {
    // element.style.overflowY = "hidden";
    // element.style.maxHeight = "100vh";

    lenis.stop();
}

function unlockScrolling(element = document.body) {
    // element.style.overflowY = "auto";
    // element.style.maxHeight = "auto";

    lenis.start();
}

function changeDisplay(el, act) {
    if (act == "show") {
        el.style.width = "100%";
        el.style.heigth = "100%";
    } else {
        el.style.width = "0";
        el.style.heigth = "0";
    }
}

function resetInputs(inputs) {
    inputs.forEach((input) => {
        input.blur();
        input.value = "";
    });
}

function getEmailErrorMessage(errCode) {
    let errMessage = null;

    switch (errCode) {
        case 1:
            errMessage = findTranslation("duplicate-email");
            break;

        case 2:
            errMessage = findTranslation("invalid-email");
            break;

        default:
            errMessage = findTranslation("general-error");
            break;
    }

    return errMessage;
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

        message = message;
        timeoutLength = 5000;
    } else {
        message = message + "..";
        timeoutLength = 999999;
    }

    displayElement.children[0].textContent = message;

    displayElement.classList.add("--active");

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        displayElement.classList.remove("--active");
    }, timeoutLength);
}

function scrollToPosition(cb, options) {
    window.addEventListener("scroll", checkPosition);

    checkPosition();

    function checkPosition() {
        if (options?.y && window.scrollY == options.y) {
            finish();
        } else if (window.scrollY == 0) {
            finish();
        }
    }

    function finish() {
        typeof cb === "function" && cb(options?.funcArgument !== undefined && options.funcArgument);
        window.removeEventListener("scroll", checkPosition);
    }

    gsap.to(window, {
        scrollTo: { y: options?.y || 0, offsetY: options?.offsetY || 0 },
        duration: prefersReducedMotion ? 0 : options?.speed || 0.3,
        ease: "power2.inOut",
    });
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
                message: getEmailErrorMessage(2),
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
        lang: initialLocale,
    });

    displayRequestResult({ success: null, message: findTranslation("loading"), displayElement: submisssionResult });

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

        resetInputs(submissionForm.querySelectorAll(".submission__input"));

        return;
    }

    const data = await response.json();

    displayRequestResult({
        success: false,
        message: getEmailErrorMessage(data.errCode),
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
            message: getEmailErrorMessage(2),
            displayElement: emailSubResult,
        });
    } else {
        displayRequestResult({
            success: null,
            message: findTranslation("loading"),
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
            resetInputs([emailSubEmailInput]);

            return;
        }

        const data = await response.json();

        displayRequestResult({
            success: false,
            message: getEmailErrorMessage(data.errCode),
            displayElement: emailSubResult,
        });
    }
}
// Email sub ---

// Sharing
let sharingInProcess = false;
function setupSharingCard(event) {
    const parent = event.target.closest(".quotes-element");

    const quoteOutput = parent.querySelector(".quotes-element__quote");
    const authorOutput = parent.querySelector(".quotes-element__author");
    const dateOutput = parent.querySelector(".quotes-element__date");

    sharingCardAuthorOutput.textContent = authorOutput.textContent;
    sharingCardQuoteOutput.textContent = quoteOutput.textContent;
    sharingCardDateOutput.textContent = dateOutput.textContent;

    setupSharingQuoteProcess();
}

async function setupSharingQuoteProcess() {
    try {
        const canvas = await html2canvas(sharingCard, { dpi: 600 });

        const imageDataUrl = canvas.toDataURL("image/png", 1);
        const blobImage = dataURItoBlob(imageDataUrl);

        const imageFile = new File([blobImage], "quote-card.png", {
            type: "image/png",
        });

        if (navigator.share && smallScreen && !shareAPINotSupported) {
            shareQuote_navigatorShare(imageFile);
        } else {
            shareQuote_custom(imageFile);
        }
    } catch (error) {
        manageSharingResult("error");

        console.error("Error generating or sharing image:", error);
    }
}

async function shareQuote_custom(imageFile) {
    if (sharingInProcess) return;

    let quoteLink = null;
    sharingInProcess = true;

    loadingElement.classList.add("--active");
    loadingElementSpinner.classList.add("--active");

    loadingElement.classList.remove("--success", "--error");

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("album", "SmFCHG8PRreakyc");

    try {
        const res = await fetch(IMAGE_UPLOAD_ENDPOINT, {
            method: "POST",
            headers: new Headers({
                Authorization: "Client-ID 1b02bab60d454de",
            }),
            body: formData,
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        quoteLink = `https://imgur.com/${data.data.id}`;

        if ((smallScreen && shareAPINotSupported) || !navigator.clipboard) {
            window.open(quoteLink, "_blank");
            manageSharingResult();

            return;
        }

        await navigator.clipboard.writeText(quoteLink);

        manageSharingResult("success");
    } catch (err) {
        manageSharingResult("error");

        console.log(`Some error occured while sharing: ${err}`);
    }

    setTimeout(() => {
        manageSharingResult();
    }, 5000);
}

async function shareQuote_navigatorShare(imageFile) {
    try {
        await navigator.share({
            text: `${mainPage}`,
            files: [imageFile],
        });
        console.log("Web share API works!");
    } catch (err) {
        console.log(err);
    }
}

function manageSharingResult(result) {
    !loadingElement.classList.contains("--active") && loadingElement.classList.add("--active");
    loadingElementSpinner.classList.remove("--active");

    switch (result) {
        case "success":
            loadingStatusText.textContent = findTranslation("saved-to-clipboard");
            loadingElement.classList.add("--success");

            loadingElement.style.width = loadingStatus.offsetWidth + "px";
            loadingStatus.classList.add("--active");
            break;

        case "error":
            loadingStatusText.textContent = findTranslation("general-error");
            loadingElement.classList.add("--error");

            loadingElement.style.width = loadingStatus.offsetWidth + "px";
            loadingStatus.classList.add("--active");
            break;

        default:
            loadingElement.classList.remove("--active");
            loadingStatus.classList.remove("--active");
            loadingElement.style.width = "90px";

            sharingInProcess = false;

            break;
    }
}
// Sharing ---

// Header
burgerMenu.addEventListener("click", () => {
    if (mainNavBar.classList.contains("--active")) closeNavBar();
    else scrollToPosition(openNavBar);
});

let savedOpened = false;
savedOpenButton.addEventListener("click", () => {
    smallScreen
        ? closeNavBar(() => toggleSection({ section: "saved" }))
        : scrollToPosition(toggleSection, { funcArgument: { section: "saved" } });

    savedOpened = true;
});

aboutUsOpenButton.addEventListener("click", () => {
    smallScreen
        ? closeNavBar(() => toggleSection({ section: "about-us" }))
        : scrollToPosition(toggleSection, { funcArgument: { section: "about-us" } });
});

savedCloseButtons.forEach((button) =>
    button.addEventListener("click", () => {
        scrollToPosition(toggleSection, { funcArgument: { section: "main" } });

        savedOpened = false;
    })
);

aboutUsCloseButtons.forEach((button) =>
    button.addEventListener("click", () => {
        scrollToPosition(toggleSection, { funcArgument: { section: "main" } });
    })
);

function closeNavBar(cb) {
    mainNavBar.classList.remove("--active");
    burgerMenu.classList.remove("--active");
    mainSectionBgBlur.classList.remove("--active");

    if (cb && typeof cb == "function") mainNavBarList.addEventListener("transitionend", finish);
    else finish();

    function finish() {
        if (cb && typeof cb == "function") cb();

        unlockScrolling();
        mainNavBarList.removeEventListener("transitionend", finish);
    }
}

function openNavBar() {
    mainNavBar.classList.add("--active");
    burgerMenu.classList.add("--active");
    mainSectionBgBlur.classList.add("--active");

    lockScrolling();
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

function getHistoryQuoteElementsHeight(number) {
    const historyQuotes = document.querySelectorAll(".history-quote-element");

    let totalHeight = 0;

    for (let i = 0; i < number; i++) {
        const computedStyles = getComputedStyle(historyQuotes[i]);
        totalHeight +=
            historyQuotes[i].offsetHeight +
            parseInt(computedStyles.marginTop) +
            parseInt(computedStyles.marginBottom) +
            15;
    }

    return totalHeight;
}

function showMorePreviousQuotes() {
    historyContainer.style.maxHeight = `${getHistoryQuoteElementsHeight(previousQuotes.length - 1)}px`;

    showMoreBtn.textContent = findTranslation("show-more-btn__show-less");
}

function showLessPreviousQuotes() {
    const screenWidth = window.screen.width;

    const y = document.querySelector("#index-3");
    const offsetY = screenWidth * (screenWidth > 768 && screenWidth <= 1620 ? 0.12 : 0.2);

    scrollToPosition(null, { speed: 1, y, offsetY });

    setTimeout(
        () => {
            historyContainer.style.maxHeight = `${getHistoryQuoteElementsHeight(3)}px`;

            showMoreBtn.textContent = findTranslation("show-more-btn__show-more");
        },
        prefersReducedMotion ? 0 : 700
    );
}

function setupSavingButtonsEL(buttons = []) {
    buttons.forEach((button) => {
        if (!button.classList.contains("--hasEL")) {
            button.addEventListener("click", (event) => {
                manageSavedQuotes(button, event.target.closest(".quotes-element"));
            });
            button.classList.add("--hasEL");
        }
    });
}

function setupSharingButtonsEL(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", (event) => {
            setupSharingCard(event);
        });
    }
}

let quoteAbleToFlip = true;
function setupQuotesFlipping(event) {
    let allClickableQuotes = Array.from(document.querySelectorAll(".quotes-element.--clickable"));

    allClickableQuotes.forEach((element) => {
        element.querySelector(".quotes-element__inner-container").style.transition = `${QUOTE_FLIPPING_LENGTH}ms`;
    });

    const clickedQuote = event?.target.classList.contains("--clickable")
        ? event?.target.classList.contains("--clickable")
        : event?.target.closest(".quotes-element");

    allClickableQuotes = allClickableQuotes.filter((element) => element.id !== clickedQuote?.id);

    allClickableQuotes = allClickableQuotes.filter((element) => element.id !== clickedQuote?.id);

    flipQuotesBack(allClickableQuotes);

    if (event?.target.classList.contains("--clickable") || event?.target.closest(".quotes-element")) {
        flipQuote(event);
    }
}

function flipQuote(event) {
    const target = event.target;
    let element = event.target.closest(".quotes-element");

    if (target.classList.contains("quotes-element")) {
        element = target;
    }

    if (!quoteAbleToFlip) return;

    if (
        !target.classList.contains("quotes-element__buttons-container") &&
        !target.closest(".quotes-element__buttons-container")
    ) {
        element.classList.toggle("--flipped");
    }

    quoteAbleToFlip = false;
    setTimeout(() => (quoteAbleToFlip = true), QUOTE_FLIPPING_LENGTH);

    if (quoteHint) {
        localStorage.setItem("quoteFlipped", true);

        quoteHint.style.opacity = "0";
    }
}

function flipQuotesBack(elements) {
    if (!quoteAbleToFlip) return;
    elements.forEach((element) => element.classList.remove("--flipped"));
}

function hideShowMoreBtn() {
    showMoreBtn.style.display = "none";
}
// Quotes ---

// Sections
function toggleSection(options) {
    const { section } = options;

    for (let i = 0; i < sections.length; i++) {
        if (sections[i].getAttribute("id") == `${section}-section`) {
            changeDisplay(sections[i], "show");

            sections[i].classList.add("--active");

            sections[i].classList.contains("--right-side") && sections[i].classList.remove("--right-side");
        } else {
            if (sections[i].getAttribute("id") == "main-section") {
                if (section == "about-us") sections[i].classList.add("--right-side");
            }

            sections[i].classList.remove("--active");

            setTimeout(() => {
                changeDisplay(sections[i], "hide");
            }, sectionTransitionTime);
        }
    }

    lockScrolling();

    overlay.classList.add("--active");

    setTimeout(() => {
        unlockScrolling();

        overlay.classList.remove("--active");
    }, sectionTransitionTime + 100);
}
// Sections ---

export { hideShowMoreBtn, setupSavingButtonsEL, setupSharingButtonsEL, savedOpened, prefersReducedMotion };
