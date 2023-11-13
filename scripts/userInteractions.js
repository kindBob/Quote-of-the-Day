import { findTranslation } from "./languageManager.js";
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
const emailSubResultText = emailSubForm.querySelector(".email-sub-form__result-text");

const overlay = document.querySelector("#overlay");

const showMoreBtn = document.querySelector("#show-more");

const MAIN_PAGE = window.location.href;
const IMAGE_UPLOAD_API = "https://quote-of-the-day-api.up.railway.app/shareQuote";
const EMAIL_SUBSCRIPTION_API = "https://quote-of-the-day-api.up.railway.app/subscribe";
// const EMAIL_SUBSCRIPTION_API = "http://localhost:3000/subscribe";
// const IMAGE_UPLOAD_API_URL = "http://localhost:3000/shareQuote";

let sharingInProcess = false;
let isMobile = detectMobile();

const quotesSectionsTransitionTime = isMobile ? 600 : 800;
const transitionTime = 600;

export let isSavedSectionOpened = false;

document.addEventListener("DOMContentLoaded", () => {
    setFlipQuoteEL(document.querySelectorAll(".quotes-element:not(.--inactive)"));

    quotesSections.forEach((section) => (section.style.transition = `transform ${quotesSectionsTransitionTime}ms`));

    savedSection.style.width = "0";

    historyContainer.style.maxHeight = `${(380 + 50) * 5}px`;

    // if (previousQuotes.length <= 5) showMoreBtn.style.display = "none";
});

emailSubForm.addEventListener("submit", (e) => {
    e.preventDefault();

    subscribe();
});

// Basic
document.addEventListener("click", (event) => {
    mainNavBar.classList.contains("--active") &&
    !burgerMenu.contains(event.target) &&
    !mainNavBarList.contains(event.target)
        ? closeNavBarList()
        : null;

    document.querySelectorAll(".quotes-element").forEach((element) => {
        if (!element.contains(event.target)) {
            element.classList.remove("--flipped");
        }
    });
});

function detectMobile() {
    const devicesRegex =
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
    const devicesModelsRegex =
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

    let check = false;
    ((a) => {
        if (devicesRegex.test(a) || devicesModelsRegex.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
// Basic ---

// Email sub
async function subscribe() {
    const inputValue = emailSubEmailInput.value;

    if (!validateEmail(inputValue)) {
        handleSubErrors(2);
    } else {
        displaySubResult(null, findTranslation("sub-loading"));

        const response = await fetch(EMAIL_SUBSCRIPTION_API, {
            method: "POST",
            body: JSON.stringify({
                email: inputValue,
            }),
            headers: {
                "content-type": "application/json",
            },
        });

        if (response.ok) {
            displaySubResult(true, findTranslation("sub-success"));
            emailSubEmailInput.value = "";
            emailSubEmailInput.blur();

            return;
        }

        const data = await response.json();

        handleSubErrors(data.errCode);
    }
}

function handleSubErrors(errCode) {
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

    displaySubResult(false, errMessage);
}

let timeoutId = null;
function displaySubResult(success, message) {
    let timeoutLength = 0;

    emailSubResult.classList.remove("--active", "--failure", "--success", "--loading");

    if (success !== null) {
        if (success === false) {
            emailSubResult.classList.add("--failure");
        } else {
            emailSubResult.classList.add("--success");
        }

        timeoutLength = 4000;
    } else {
        message = message + "...";
        timeoutLength = 999999;
    }

    emailSubResultText.textContent = message;

    emailSubResult.classList.add("--active");

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        emailSubResult.classList.remove("--active");
    }, timeoutLength);
}

function validateEmail(email) {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
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

        if (navigator.share && isMobile) {
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

    mainNavBar.classList.contains("--active") ? lockScrolling() : unlockScrolling();
});

savedOpenButton.addEventListener("click", () => {
    isMobile ? closeNavBarList(openSavedSection) : openSavedSection();
});

function closeNavBarList(cb) {
    mainNavBar.classList.remove("--active");
    burgerMenu.classList.remove("--active");

    mainNavBarList.addEventListener("transitionend", cb);
    setTimeout(() => {
        mainNavBarList.removeEventListener("transitionend", cb);
        unlockScrolling();
    }, 500);
}

function lockScrolling(element = document.body) {
    element.style.overflowY = "hidden";
}

function unlockScrolling(element = document.body) {
    element.style.overflowY = "auto";
}
// Header ---
// Quotes
showMoreBtn.addEventListener("click", () => {
    if (showMoreBtn.textContent.includes("Show more")) {
        showMorePreviousQuotes();
        return;
    }

    showLessPreviousQuotes();
});

function showMorePreviousQuotes() {
    historyContainer.style.maxHeight = `${(380 + 50) * previousQuotes.length}px`;

    showMoreBtn.textContent = "Show less";
}

function showLessPreviousQuotes() {
    // window.scrollTo({
    //     top: 400,
    //     behavior: "smooth",
    // });

    historyContainer.style.maxHeight = `${(380 + 50) * 5}px`;

    showMoreBtn.textContent = "Show more";
}

export function setFlipQuoteEL(elements) {
    if (!isMobile) return;

    elements.forEach((element) => {
        element.addEventListener("click", (event) => {
            element.querySelector(".quotes-element__inner-container").style.transition = `${transitionTime}ms`;

            flipQuote(event);
        });
    });
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

let isAbleToFlip = true;
function flipQuote(event) {
    const target = event.target;
    const element = event.target.closest(".quotes-element");

    if (!isAbleToFlip) return;

    if (
        !target.classList.contains("quotes-element__buttons-container") &&
        !target.closest(".quotes-element__buttons-container")
    ) {
        element.classList.toggle("--flipped");
    }

    isAbleToFlip = false;
    setTimeout(() => (isAbleToFlip = true), transitionTime);
}
// Quotes ---
// Sections
savedBackButtons.forEach((button) => button.addEventListener("click", closeSaved));

function closeSaved() {
    isSavedSectionOpened = false;

    mainSection.style.width = "100%";

    savedSection.classList.remove("--active");
    mainSection.classList.remove("--inactive", "--left-side");

    lockScrolling();
    overlay.classList.add("--active");

    setTimeout(() => {
        savedSection.style.width = "0";
    }, quotesSectionsTransitionTime);

    setTimeout(() => {
        unlockScrolling();
        overlay.classList.remove("--active");
    }, quotesSectionsTransitionTime + 100);
}

function openSavedSection() {
    isSavedSectionOpened = true;

    savedSection.style.width = "100%";

    savedSection.classList.add("--active");
    mainSection.classList.add("--inactive");

    lockScrolling();
    overlay.classList.add("--active");

    setTimeout(() => {
        mainSection.style.width = "0";
    }, quotesSectionsTransitionTime);

    setTimeout(() => {
        unlockScrolling();
        overlay.classList.remove("--active");
    }, quotesSectionsTransitionTime + 100);
}
// Sections ---
