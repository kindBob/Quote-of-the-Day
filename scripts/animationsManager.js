import { checkPreviousQuotesReadiness, savedQuotes } from "./quotesManager.js";
import { prefersReducedMotion, smallScreen, savedOpened, lockScrolling, unlockScrolling } from "./userInteractions.js";
import { getTranslation } from "./languageManager.js";

const mainHeader = document.querySelector("#main-header");
const mainLogo = mainHeader.querySelector(".logo");
const mainNavBar = mainHeader.querySelector(".nav-bar");
const mainNavBarList = mainNavBar.querySelector(".nav-bar__list");
const mainNavBarListElements = mainNavBarList.children;

const savedSection = document.querySelector("#saved-section");

const historyContainer = document.querySelector("#history-container");

const overlay = document.querySelector("#overlay");

const loading = document.querySelector("#loading");
const spinner = loading.querySelector(".spinner");

const bodyBgBlur = document.querySelector("#body__bg-blur");

const savedPlaceholder = savedSection.querySelector("#saved-placeholder");

const modalTransitionDuration = parseFloat(
    getComputedStyle(document.body).getPropertyValue("--modalAnimationDuration")
);

let previousQuotes = [];

gsap.registerPlugin(ScrollToPlugin);

checkPreviousQuotesReadiness().then(async () => {
    if (!prefersReducedMotion) setupInitialAnimations();

    setTimeout(() => {}, 1000);

    overlay.classList.remove("--showed-up");

    hideLoadingSpinner();

    unlockScrolling();
});

function setupInitialAnimations() {
    previousQuotes = historyContainer.querySelectorAll(".quotes-element");

    startScrollAnimations();

    splitText(document.querySelector("#saved-placeholder"));
}

let mainHeaderTl = null;
function setupMainHeaderAnimation() {
    if (!mainHeaderTl) {
        mainHeaderTl = gsap.timeline({
            defaults: { duration: prefersReducedMotion ? 0 : 0.35, ease: "power3.inOut" },
        });
    }

    mainHeaderTl.clear();

    mainHeaderTl.to(mainNavBarListElements[0], {
        x: mainNavBarListElements[0].clientWidth * 1.2 + 15,
        height: 0,
        autoAlpha: 0,
    });
    mainHeaderTl.to(
        mainNavBarListElements[2],
        {
            x: -mainNavBarListElements[2].clientWidth * 1.2 - 15,
            height: 0,
            autoAlpha: 0,
        },
        "<"
    );

    mainHeaderTl.to(mainNavBar, { y: "100%" });

    mainHeaderTl.fromTo(mainLogo, { y: -mainHeader.clientHeight }, { y: "auto", autoAlpha: 1 }, "<");

    mainHeaderTl.pause();
}

function startScrollAnimations() {
    gsap.to("#index-0", {
        scale: 5,
        autoAlpha: 0,
        overwrite: "auto",
        scrollTrigger: {
            trigger: "#index-0",
            scrub: 1.2,
            start: "center center",
            end: "bottom top",
        },
        ease: "power2.inOut",
    });

    gsap.from(".separator", {
        scale: 0,
        scrollTrigger: {
            trigger: ".history-title",
            scrub: 1.2,
            start: "center center",
            end: "bottom center",
        },
        ease: "power2.inOut",
    });

    gsap.from(".history-title", {
        opacity: 0,
        scrollTrigger: {
            trigger: ".history-title",
            scrub: 1.2,
            start: "center center",
            end: "bottom center",
        },

        ease: "power2.inOut",
    });

    gsap.from(previousQuotes[0], {
        yPercent: 50,
        autoAlpha: 0,
        scrollTrigger: {
            trigger: previousQuotes[0],
            scrub: 1.2,
            start: "center bottom",
            end: "top center",
        },
        ease: "power2",
    });

    previousQuotes.forEach((quote, i) => {
        if (i == 0) return;

        gsap.from(quote, {
            yPercent: 50,
            autoAlpha: 0.2,
            scrollTrigger: {
                trigger: quote,
                scrub: 1.2,
                start: "top bottom",
                end: "top center",
            },
            ease: "power2",
        });
    });
}

const openedSections = [];
function startSecondarySectionAnimations(options) {
    const { section, delay } = options;

    const sectionElement = document.querySelector(`#${section}-section`);
    const footer = sectionElement.querySelector("footer");
    const footerHeartIcon = footer.querySelector(".heart-icon");
    const mainContainer = sectionElement.querySelector(".container.--main");

    const defaultDuration = 0.7;

    const tl = gsap.timeline({
        delay: `${delay * 0.4}`,
        defaults: {
            duration: prefersReducedMotion ? 0 : defaultDuration,
            ease: "power3.inOut",
        },
    });

    for (const el of openedSections) {
        if (el == section) return;
    }

    openedSections.push(section);

    tl.call(() => {
        if (savedOpened && savedQuotes.length == 0) {
            showSplitText(savedPlaceholder);
        }
    });

    tl.from(mainContainer, {
        autoAlpha: 0,
        ease: "none",
    });

    tl.from(footerHeartIcon, {
        autoAlpha: 0,
    });
}

function scrollToPosition(cb, options = {}) {
    if (options?.y == undefined) options.y = 0;

    if (window.scrollY == options.y) {
        finish();

        return;
    }

    gsap.to(window, {
        scrollTo: { y: options.y, offsetY: options?.offsetY || 0 },
        duration: prefersReducedMotion ? 0 : options?.duration || 0.2,
        ease: options?.ease || "power2.inOut",
        onComplete: finish,
    });

    function finish() {
        typeof cb === "function" && cb(options?.funcArgument !== undefined && options.funcArgument);
    }
}

function splitText(el) {
    const chars = el.textContent.split("");

    el.textContent = null;

    chars.forEach((char) => {
        const newEl = document.createElement("div");
        const content = document.createTextNode(char);

        newEl.style.display = "inline-block";

        if (char === " ") newEl.style.width = "0.22em";

        newEl.append(content);

        el.append(newEl);
    });
}

function showSplitText(el, options, cb) {
    el.style.display = "flex";

    if (prefersReducedMotion) return;

    gsap.from(options?.index ? el.children[options.index] : el.children, {
        y: options?.y || el.clientHeight,
        duration: options?.duration || 0.6,
        stagger: options?.stagger || { amount: 0.3 },
        ease: options?.ease || "expo.inOut",
        delay: options?.delay || 0,
        onComplete: cb,
    });
}

function hideLoadingSpinner() {
    loading.classList.remove("--active");
    spinner.classList.remove("--active");
}

let modalOpened = false;
function showModal(modal) {
    modalOpened = true;

    bodyBgBlur.classList.add("--active");

    lockScrolling();

    modal.classList.remove("--hidden");
    modal.classList.add("--active");
}

let modalHidingTiemoutId = null;
function hideModals(modals) {
    bodyBgBlur.classList.remove("--active");

    unlockScrolling();

    modals.forEach((modal) => {
        modal.classList.remove("--active");
        modal.classList.add("--hidden");
    });

    modalHidingTiemoutId && clearTimeout(modalHidingTiemoutId);

    modalHidingTiemoutId = setTimeout(() => {
        modalOpened = false;
    }, modalTransitionDuration);
}

export {
    scrollToPosition,
    setupMainHeaderAnimation,
    mainHeaderTl,
    showSplitText,
    showModal,
    hideModals,
    modalOpened,
    hideLoadingSpinner,
    startSecondarySectionAnimations,
};
