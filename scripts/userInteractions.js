import {
  scrollToPosition,
  setupMainHeaderAnimation,
  mainHeaderTl,
  showModal,
  hideModals,
  modalOpened,
  startSecondarySectionAnimations,
} from "./animationsManager.js";
import { getTranslation, initialLocale } from "./languageManager.js";
import { manageSavedQuotes, checkPreviousQuotesReadiness } from "./quotesManager.js";

const MAIN_API_URL = "https://quote-of-the-day-api.onrender.com";
const IMAGE_UPLOAD_ENDPOINT = "https://api.imgur.com/3/image";
const EMAIL_SUBSCRIPTION_API = `${MAIN_API_URL}/subscribe`;
const SUBMISSIONS_API = `${MAIN_API_URL}/submission`;

const burgerMenu = document.querySelector("#main-burger-menu");
const mainHeader = document.querySelector("#main-header");
const mainLogo = mainHeader.querySelector(".logo");
const mainNavBar = mainHeader.querySelector(".nav-bar");
const mainNavBarList = mainNavBar.querySelector(".nav-bar__list");

const aboutUsSection = document.querySelector("#about-us-section");
const savedSection = document.querySelector("#saved-section");
const mainSection = document.querySelector("#main-section");

const savedCloseButtons = savedSection.querySelectorAll(".close-btn");
const savedOpenButton = document.querySelector("#saved-open-button");
const aboutUsOpenButton = document.querySelector("#about-us-open-button");
const aboutUsCloseButtons = aboutUsSection.querySelectorAll(".close-btn");

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
const mainSectionBgBlur = document.querySelector("#main-section__bg-blur");
const bodyBgBlur = document.querySelector("#body__bg-blur");

const modals = document.querySelectorAll(".modal");
const sharingModal = document.querySelector("#sharing-modal");
const sharingModalBtn = sharingModal.querySelector(".button");

const historyContainer = document.querySelector("#history-container");
const mainSectionMainContainer = document.querySelector("#main-section-container");

const legalPolicyLink = document.querySelector("#legal-policy");
const legalTermsLink = document.querySelector("#legal-terms");

const timer = document.querySelector("#timer");

const prefersReducedMotion = detectReducedMotion();

const isMobile = detectMobile();
let withMouse = detectMouse();
let smallScreen = detectSmallScreen();
let smallScreenInitially = detectSmallScreen();
let screenWidth = window.innerWidth || document.documentElement.clientWidth;

let quoteInnerContainerTransitionTime = 0;
let navBarListTransitionTime = 0;
let sectionsTranstionTime = 0;

// General
gsap.registerPlugin(ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
  lockScrolling();

  mainSectionMainContainer.style.minHeight =
    document.documentElement.clientHeight - mainHeader.clientHeight + "px";
});

window.addEventListener("resize", handleWindowResize);

document.addEventListener("click", (event) => {
  if (!smallScreen) return;

  if (
    mainNavBarList.classList.contains("--active") &&
    !burgerMenu.contains(event.target) &&
    !mainNavBarList.contains(event.target)
  )
    closeNavBar();

  setupQuotesFlipping(event);
});

checkPreviousQuotesReadiness().then(() => {
  historyContainer.style.maxHeight = `${getHistoryQuoteElementsHeight(3)}px`;
});

function handleWindowResize() {
  const updatedScreenWidth = window.innerWidth || document.documentElement.clientWidth;

  if (screenWidth == updatedScreenWidth) return;

  screenWidth = updatedScreenWidth;
  smallScreen = detectSmallScreen();

  sharingResultShowed && (loadingElement.style.width = loadingStatus.offsetWidth + "px");

  mainSectionMainContainer.style.minHeight =
    document.documentElement.clientHeight - mainHeader.clientHeight + "px";

  if (!smallScreen) {
    closeNavBar(null, { withTimeout: false });

    mainNavBarList.style.opacity = "1";
  } else {
    mainNavBarList.style.opacity = "0";
  }

  if (smallScreen != smallScreenInitially) {
    setupMainHeader();
    smallScreenInitially = !smallScreenInitially;
  }

  historyContainer.style.maxHeight = `${getHistoryQuoteElementsHeight(3)}px`;
}

function initialSetup() {
  //Quotes
  if (localStorage.getItem("quoteFlipped")) quoteHint.remove();
  else quoteHint.classList.add("--active");

  quoteInnerContainerTransitionTime =
    parseFloat(
      getComputedStyle(
        document.querySelector(".quotes-element.--clickable .quotes-element__inner-container")
      ).transitionDuration
    ) * 1000;

  navBarListTransitionTime = parseFloat(
    getComputedStyle(document.body).getPropertyValue("--navBarListTransitionTime")
  );

  sectionsTranstionTime =
    parseFloat(getComputedStyle(document.querySelector(".section")).transitionDuration) * 1000;

  //Links
  legalPolicyLink.setAttribute("href", `/pages/${initialLocale}/privacy-policy.html`);
  legalTermsLink.setAttribute("href", `/pages/${initialLocale}/terms-of-service.html`);
  legalPolicyLink.setAttribute("hreflang", initialLocale);
  legalTermsLink.setAttribute("hreflang", initialLocale);

  //Timer
  getTimeLeftTillNextQuote();

  //Header
  setupMainHeader();
}

function detectSmallScreen() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  return screenWidth < 769;
}

function detectMouse() {
  return window.matchMedia("(pointer: fine)").matches;
}

function detectMobile() {
  return Boolean("ontouchstart" in window || (navigator.maxTouchPoints && window.innerWidth < 769));
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
    return false;

  return true;
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
      errMessage = getTranslation("duplicate-email");
      break;

    case 2:
      errMessage = getTranslation("invalid-email");
      break;

    default:
      errMessage = getTranslation("general-error");
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

let requestResultMessageTimeoutId = null;
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

    message = message.replace(".", "");
    timeoutLength = 5000;
  } else {
    message = message + "..";
    timeoutLength = 999999;
  }

  displayElement.children[0].textContent = message;

  displayElement.classList.add("--active");

  if (requestResultMessageTimeoutId) clearTimeout(requestResultMessageTimeoutId);

  requestResultMessageTimeoutId = setTimeout(() => {
    displayElement.classList.remove("--active");
  }, timeoutLength);
}
// General
//-------
// Features
window.addEventListener("wheel", handleScrollOrSwipeToTop);
window.addEventListener("touchmove", handleScrollOrSwipeToTop);

function handleScrollOrSwipeToTop() {
  if (modalOpened || navBarOpened) return;
  if ((withMouse && window.scrollY == 0) || (!withMouse && window.scrollY <= 1)) {
    timer.classList.add("--active");

    mainSectionMainContainer.style.paddingTop = `${timer.clientHeight * 1.2}px`;
  } else {
    timer.classList.remove("--active");

    mainSectionMainContainer.style.paddingTop = 0;
  }
}

let timeLeft = null;
async function getTimeLeftTillNextQuote() {
  try {
    const res = await fetch(`${MAIN_API_URL}/timeTillTomorrow`);

    if (!res.ok) throw new Error("Bad response.");

    const data = await res.json();
    timeLeft = data.timeLeft;

    updateTimer();
    setInterval(updateTimer, 1000);
  } catch (err) {
    console.log(`An error occured while fetching time left till tomorrow: ${err}`);
  }
}

function updateTimer() {
  if (timeLeft <= 0) location.reload();

  timeLeft -= 1000;

  let seconds = Math.floor(timeLeft / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = (seconds % 60).toString().padStart(2, "0");
  minutes = (minutes % 60).toString().padStart(2, "0");
  hours = (hours % 24).toString().padStart(2, "0");

  timer.textContent = `${hours}:${minutes}:${seconds}`;
}
// Features
// ------
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
  hideModals(modals);
});

submissionCloseBtn.addEventListener("click", () => {
  closeSubmissions();
});

function openSubmission() {
  showModal(submissionElement);
}

function closeSubmissions() {
  hideModals([submissionElement]);
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

  displayRequestResult({
    success: null,
    message: getTranslation("loading"),
    displayElement: submisssionResult,
  });

  const response = await fetch(SUBMISSIONS_API, {
    method: "POST",
    headers,
    body,
  });

  if (response.ok) {
    displayRequestResult({
      success: true,
      message: getTranslation("submission-success"),
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
// Submission
//-------
// Email sub
emailSubForm.addEventListener("submit", (e) => {
  e.preventDefault();

  subscribeToNewsletter();
});

async function subscribeToNewsletter() {
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
      message: getTranslation("loading"),
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
        message: getTranslation("sub-success"),
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
// Email sub
//-------
// Sharing
const shareAPISupported = detectShareAPISupport();
let sharingInProcess = false;
let sharingImageFile = null;

sharingModalBtn.addEventListener("click", () => shareQuoteNavigatorShare(sharingImageFile));

function setupSharingCard(el) {
  const dateOutput = el.querySelector(".quotes-element__date").textContent;
  const authorOutput = el.querySelector(".quotes-element__author").textContent;
  const quoteOutput = el.querySelector(".quotes-element__quote").textContent;

  sharingCardAuthorOutput.textContent = authorOutput;
  sharingCardQuoteOutput.textContent = quoteOutput;
  sharingCardDateOutput.textContent = dateOutput;

  setupSharingQuoteProcess();
}
//REMOVE SMALL SCREEN CHECK
async function setupSharingQuoteProcess() {
  try {
    const canvas = await html2canvas(sharingCard, { scale: 2 });

    const imageDataUrl = canvas.toDataURL("image/png", 1);
    const blobImage = dataURItoBlob(imageDataUrl);

    const imageFile = new File([blobImage], "quote-card.png", {
      type: "image/png",
    });

    sharingImageFile = imageFile;

    if (navigator.share && shareAPISupported && isMobile) {
      shareQuoteNavigatorShare(imageFile);
    } else {
      shareQuoteCustom(imageFile);
    }

    // console.clear();
  } catch (error) {
    manageSharingResult("error");

    console.error("Error generating or sharing image:", error);
  }
}

//Doesn't work on localhost
async function shareQuoteCustom(imageFile) {
  if (sharingInProcess) return;

  let quoteLink = null;
  sharingInProcess = true;

  loadingElement.classList.add("--active");
  loadingElementSpinner.classList.add("--active");

  loadingElement.classList.remove("--success", "--error");

  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("album", "RjJ0L6QBBeESsCn");
  try {
    const res = await fetch(IMAGE_UPLOAD_ENDPOINT, {
      method: "POST",
      headers: new Headers({
        Authorization: "Client-ID 1b02bab60d454de",
      }),
      body: formData,
    });

    if (!res.ok) throw new Error("Bad response");

    const data = await res.json();

    quoteLink = `https://imgur.com/${data.data.id}`;

    if (!shareAPISupported && !navigator.clipboard && !navigator.share) {
      manageSharingResult("error");

      return;
    }

    if ((!shareAPISupported || !navigator.clipboard) && navigator.share) {
      manageSharingResult();

      showModal(sharingModal);

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

async function shareQuoteNavigatorShare(imageFile) {
  try {
    await navigator.share({
      files: [imageFile],
    });

    hideModals([sharingModal]);
  } catch (err) {
    console.log(err);
  }
}

let sharingResultShowed = false;
function manageSharingResult(result) {
  !loadingElement.classList.contains("--active") && loadingElement.classList.add("--active");
  loadingElementSpinner.classList.remove("--active");

  switch (result) {
    case "success":
      sharingResultShowed = true;

      loadingStatusText.textContent = getTranslation("saved-to-clipboard").replace(".", "");
      loadingElement.classList.add("--success");

      loadingElement.style.width = loadingStatus.offsetWidth + "px";
      loadingStatus.classList.add("--active");
      break;

    case "error":
      sharingResultShowed = true;

      loadingStatusText.textContent = getTranslation("general-error").replace(".", "");
      loadingElement.classList.add("--error");

      loadingElement.style.width = loadingStatus.offsetWidth + "px";
      loadingStatus.classList.add("--active");
      break;

    default:
      loadingElement.classList.remove("--active");

      loadingElement.style.width = "90px";

      setTimeout(() => {
        loadingStatus.classList.remove("--active");

        sharingResultShowed = false;
      }, parseFloat(getComputedStyle(loadingElement).transitionDuration) * 1000);

      sharingInProcess = false;

      break;
  }
}
// Sharing
//-------
// Header
const passiveHeaderTimeoutTime = 3500;
let passiveHeaderTimeoutId = null;
mainLogo.addEventListener("mouseenter", () => {
  if (!smallScreen) {
    setActiveMainHeader();

    !withMouse &&
      (passiveHeaderTimeoutId = setTimeout(setPassiveMainHeader, passiveHeaderTimeoutTime));
  }
});

mainLogo.addEventListener("click", () => {
  if (!smallScreen) {
    setActiveMainHeader();

    passiveHeaderTimeoutId = setTimeout(setPassiveMainHeader, passiveHeaderTimeoutTime);
  }
});

mainNavBarList.addEventListener("mouseenter", () => {
  if (!smallScreen) passiveHeaderTimeoutId != null && clearTimeout(passiveHeaderTimeoutId);
});

mainNavBarList.addEventListener("mouseleave", () => {
  if (!smallScreen)
    passiveHeaderTimeoutId = setTimeout(setPassiveMainHeader, passiveHeaderTimeoutTime);
});

mainNavBar.addEventListener("mouseleave", () => {
  if (!smallScreen)
    passiveHeaderTimeoutId = setTimeout(setPassiveMainHeader, passiveHeaderTimeoutTime);
});

burgerMenu.addEventListener("click", () => {
  if (navBarIsMoving) return;

  if (mainNavBarList.classList.contains("--active")) closeNavBar();
  else scrollToPosition(openNavBar);
});

let savedOpened = false;
savedOpenButton.addEventListener("click", () => {
  savedOpened = true;

  smallScreen
    ? closeNavBar(() => toggleSection({ section: "saved" }))
    : scrollToPosition(toggleSection, { funcArgument: { section: "saved" } });
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

function setupMainHeader() {
  passiveHeaderTimeoutId != null && clearTimeout(passiveHeaderTimeoutId);
  resetHeaderElements();

  if (!smallScreen) {
    setupMainHeaderAnimation();

    passiveHeaderTimeoutId = setTimeout(setPassiveMainHeader, passiveHeaderTimeoutTime);
  } else {
    mainHeaderTl && mainHeaderTl.revert();
  }
}

function resetHeaderElements() {
  mainNavBar.style = "";
  mainLogo.style = "";
  mainNavBarList.children[0].style = "";
  mainNavBarList.children[2].style = "";
}

function setActiveMainHeader() {
  mainHeaderTl.reverse();
}

function setPassiveMainHeader() {
  const progress = mainHeaderTl.progress();

  mainHeaderTl.restart().progress(progress);
}

let navBarIsMoving = false;
let navBarOpened = false;
function closeNavBar(cb, options) {
  mainNavBarList.classList.remove("--active");
  burgerMenu.classList.remove("--active");
  mainSectionBgBlur.classList.remove("--active");

  navBarOpened = false;

  if (options?.withTimeout === false) {
    unlockScrolling();

    return;
  }

  navBarIsMoving = true;

  setTimeout(finish, navBarListTransitionTime);

  function finish() {
    unlockScrolling();
    smallScreen && (mainNavBarList.style.opacity = "0");
    navBarIsMoving = false;

    if (cb && typeof cb == "function") cb();
  }
}

function openNavBar() {
  mainNavBarList.classList.add("--active");
  burgerMenu.classList.add("--active");
  mainSectionBgBlur.classList.add("--active");

  mainNavBarList.style.opacity = "1";

  navBarIsMoving = true;
  navBarOpened = true;

  lockScrolling();

  setTimeout(() => {
    navBarIsMoving = false;
  }, navBarListTransitionTime);
}
// Header
//-------
// Quotes
showMoreBtn.addEventListener("click", () => {
  if (showMoreBtn.textContent.includes(getTranslation("show-more-btn__show-more"))) {
    showMorePreviousQuotes();
    return;
  }

  showLessPreviousQuotes();
});

function getHistoryQuoteElementsHeight(number) {
  const historyQuotes = historyContainer.querySelectorAll(".quotes-element");

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
  historyContainer.style.maxHeight = `${getHistoryQuoteElementsHeight(10)}px`;

  showMoreBtn.textContent = getTranslation("show-more-btn__show-less");
}

function showLessPreviousQuotes(options) {
  const screenWidth = window.screen.width;

  const y = document.querySelector("#index-3");
  const offsetY = screenWidth * (screenWidth > 768 && screenWidth <= 1620 ? 0.12 : 0.2);

  !options?.noScroll && scrollToPosition(null, { duration: 1, y, offsetY });

  setTimeout(
    () => {
      historyContainer.style.maxHeight = `${getHistoryQuoteElementsHeight(3)}px`;

      showMoreBtn.textContent = getTranslation("show-more-btn__show-more");
    },
    prefersReducedMotion ? 0 : 700
  );
}

function setupQuoteElementButtons(el) {
  const saveBtn = el.querySelector(".save-button");
  const shareBtn = el.querySelector(".share-button");

  saveBtn.addEventListener("click", () => manageSavedQuotes(el));

  shareBtn.addEventListener("click", () => setupSharingCard(el));
}

function setupQuotesFlipping(event) {
  if (event.target.classList.contains("button") || event.target.closest(".button") || modalOpened)
    return;

  let allClickableQuotes = Array.from(document.querySelectorAll(".quotes-element.--clickable"));

  const clickedQuote = event?.target.classList.contains("--clickable")
    ? event.target
    : event?.target.closest(".quotes-element") || {};

  allClickableQuotes = allClickableQuotes.filter((element) => element.id !== clickedQuote?.id);

  flipQuotesBack(allClickableQuotes);

  if (event?.target.classList.contains("--clickable") || event?.target.closest(".quotes-element")) {
    flipQuote(event);
  }
}

let quoteAbleToFlip = true;
function flipQuote(event) {
  const target = event.target;
  let element = event.target.closest(".quotes-element");

  if (target.classList.contains("quotes-element")) {
    element = target;
  }

  if (!quoteAbleToFlip) return;

  element.classList.toggle("--flipped");

  quoteAbleToFlip = false;
  setTimeout(() => (quoteAbleToFlip = true), quoteInnerContainerTransitionTime);

  if (quoteHint) {
    localStorage.setItem("quoteFlipped", true);

    quoteHint.style.opacity = "0";
  }
}

function flipQuotesBack(elements) {
  if (!quoteAbleToFlip) return;
  elements.forEach((element) => element.classList.remove("--flipped"));
}
// Quotes
//-------
// Sections
function toggleSection(options) {
  const { section } = options;

  lockScrolling();
  overlay.classList.add("--active");

  switch (section) {
    case "saved":
      savedSection.style.width = "100%";

      mainSection.style.transform = "translateX(-100vw)";
      savedSection.style.transform = "translateX(0)";

      startSecondarySectionAnimations({ section, delay: sectionsTranstionTime / 1000 });

      setTimeout(() => {
        mainSection.style.width = 0;

        finish();
      }, sectionsTranstionTime);

      break;

    case "about-us":
      aboutUsSection.style.width = "100%";

      mainSection.style.transform = "translateX(100vw)";
      aboutUsSection.style.transform = "translateX(0)";

      startSecondarySectionAnimations({ section, delay: sectionsTranstionTime / 1000 });

      setTimeout(() => {
        mainSection.style.width = 0;

        finish();
      }, sectionsTranstionTime);

      break;

    case "main":
      mainSection.style.width = "100%";

      mainSection.style.transform = "translateX(0)";
      savedSection.style.transform = "translateX(100vw)";
      aboutUsSection.style.transform = "translateX(-100vw)";

      setTimeout(() => {
        savedSection.style.width = 0;
        aboutUsSection.style.width = 0;

        finish();
      }, sectionsTranstionTime);

      break;

    default:
      console.log("No section found.");
  }

  function finish() {
    unlockScrolling();
    overlay.classList.remove("--active");
  }
}
// Sections ---

export {
  initialSetup,
  savedOpened,
  prefersReducedMotion,
  smallScreen,
  lockScrolling,
  unlockScrolling,
  showLessPreviousQuotes,
  MAIN_API_URL,
  setupQuoteElementButtons,
};
