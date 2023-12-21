import { checkPreviousQuotesReadiness, savedQuotes } from "./quotesManager.js";
import { prefersReducedMotion, smallScreen, savedOpened, lockScrolling, unlockScrolling } from "./userInteractions.js";
import { getTranslation } from "./languageManager.js";

const mainHeader = document.querySelector("#main-header");
const mainLogo = mainHeader.querySelector(".logo");
const mainNavBar = mainHeader.querySelector(".nav-bar");
const mainNavBarList = mainNavBar.querySelector(".nav-bar__list");
const mainNavBarListElements = mainNavBarList.children;

const aboutUsSection = document.querySelector("#about-us-section");
const savedSection = document.querySelector("#saved-section");
const mainSection = document.querySelector("#main-section");

const overlay = document.querySelector("#overlay");

const loading = document.querySelector("#loading");
const spinner = loading.querySelector(".spinner");

const bodyBgBlur = document.querySelector("#body__bg-blur");

const footersContent = document.querySelectorAll(".footer__content");

const savedPlaceholder = savedSection.querySelector("#saved-placeholder");

let previousQuotes = [];

gsap.registerPlugin(ScrollToPlugin);

checkPreviousQuotesReadiness().then(() => {
    if (!prefersReducedMotion) setupInitialAnimations();

    if (window.matchMedia("(orientation: landscape)").matches && smallScreen) {
        const overlayText = overlay.querySelector("p");
        overlayText.textContent = getTranslation("error_landscape-mode");
        overlayText.classList.add("--active");

        return;
    }

    gsap.to(overlay, {
        autoAlpha: 0,
        ease: "power2.inOut",
        duration: prefersReducedMotion ? 0 : 0.6,
        onComplete: () => {
            overlay.classList.remove("--active");
        },
    });

    hideLoadingSpinner();

    // const lenis = new Lenis({ normalizeWheel: true });

    // lenis.on("scroll", (e) => {
    //     console.log(e);
    // });

    // function raf(time) {
    //     lenis.raf(time);
    //     requestAnimationFrame(raf);
    // }

    // requestAnimationFrame(raf);

    // showLessPreviousQuotes({ noScroll: true });
});

function setupInitialAnimations() {
    startScrollAnimations();

    footersContent.forEach((content) => splitText(content));

    splitText(document.querySelector("#saved-placeholder"));
}

let mainHeaderTl = null;
function setupMainHeaderAnim() {
    if (!mainHeaderTl)
        mainHeaderTl = gsap.timeline({
            paused: true,
            defaults: { duration: prefersReducedMotion ? 0 : 0.35, ease: "power3.inOut" },
        });

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

    mainHeaderTl.to(mainNavBar, { y: mainHeader.clientHeight });

    mainHeaderTl.fromTo(mainLogo, { y: -mainHeader.clientHeight }, { y: "auto", autoAlpha: 1 }, "<");
}

const navBarTransition = 0.6;
function playNavBarOpeningAnim() {
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    tl.to(mainNavBarList, {
        x: 0,
        duration: navBarTransition,
        ease: "power2.inOut",
    });

    tl.from(
        mainNavBarListElements,
        {
            x: mainNavBarList.clientWidth,
            duration: prefersReducedMotion ? 0 : 0.5,
            ease: "elastic(0.9, 1)",
            stagger: {
                each: 0.1,
            },
        },
        "<+=40%"
    );
}

function startScrollAnimations() {
    previousQuotes = gsap.utils.toArray(".history-quote-element:not(.history-quote-element:nth-child(1))");

    gsap.to("#index-0", {
        scale: 5,
        autoAlpha: 0,
        overwrite: "auto",
        scrollTrigger: {
            trigger: "#index-0",
            scrub: 1.2,
            start: "center center",
            end: "bottom 20%",
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

    gsap.from(".history-quote-element:nth-child(1)", {
        yPercent: 50,
        autoAlpha: 0,
        scrollTrigger: {
            trigger: ".history-quote-element:nth-child(1)",
            scrub: 1.2,
            start: "center bottom",
            end: "top center",
        },
        ease: "power2",
    });

    previousQuotes.forEach((quote) => {
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
    const footerContent = footer.querySelector(".content");
    const mainContainer = sectionElement.querySelector(".container.--main");

    const heartChar = Array.from(footerContent.children).find((char) => {
        return char.textContent == "❤";
    });
    const heartCharIndex = Array.from(footerContent.children).indexOf(heartChar);

    const defaultDuration = 0.7;

    const tl = gsap.timeline({
        delay: `${delay * 0.4}`,
        defaults: {
            duration: defaultDuration,
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

    tl.from(footerContent.children[heartCharIndex], {
        width: 0,
        autoAlpha: 0,
        duration: 0.4,
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

function changeSection(section, cb) {
    const tl = gsap.timeline({
        defaults: {
            duration: prefersReducedMotion ? 0 : smallScreen ? 0.6 : 0.9,
            ease: CustomEase.create("custom", "M0 0 C .3 .16, .24 1, 1 1"),
            onComplete: cb,
        },
    });

    switch (section) {
        case "saved":
            savedSection.style.width = "100%";

            tl.to(mainSection, {
                x: "-100vw",
                onComplete: () => (mainSection.style.width = 0),
            });
            tl.to(savedSection, { x: 0 }, "<");

            startSecondarySectionAnimations({ section, delay: tl.totalDuration() });

            break;

        case "about-us":
            aboutUsSection.style.width = "100%";

            tl.to(mainSection, {
                x: "100vw",
                onComplete: () => (mainSection.style.width = 0),
            });
            tl.to(aboutUsSection, { x: 0 }, "<");

            startSecondarySectionAnimations({ section, delay: tl.totalDuration() });

            break;

        case "main":
            mainSection.style.width = "100%";

            tl.to(mainSection, { x: 0 });
            tl.to(
                aboutUsSection,
                {
                    x: "-100vw",
                    onComplete: () => {
                        aboutUsSection.style.width = 0;
                    },
                },
                "<"
            );
            tl.to(
                savedSection,
                {
                    x: "100vw",
                    onComplete: () => {
                        savedSection.style.width = 0;
                    },
                },
                "<"
            );

            break;

        default:
            console.log("No section found.");
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

    gsap.from(options?.index ? el.children[options.index] : el.children, {
        y: options?.y || el.clientHeight,
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

    gsap.fromTo(
        modal,
        {
            y: "-200%",
            x: "-50%",
            autoAlpha: 0,
        },
        {
            y: "-50%",
            autoAlpha: 1,
            pointerEvents: "all",
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: "power2.inOut",
        }
    );
}

function hideModals(modals) {
    bodyBgBlur.classList.remove("--active");

    unlockScrolling();

    modals.forEach((modal) => {
        gsap.to(modal, {
            y: "200%",
            autoAlpha: 0,
            pointerEvents: "none",
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                modalOpened = false;
            },
        });
    });
}

export {
    scrollToPosition,
    setupMainHeaderAnim,
    playNavBarOpeningAnim,
    mainHeaderTl,
    navBarTransition,
    changeSection,
    showSplitText,
    showModal,
    hideModals,
    modalOpened,
    hideLoadingSpinner,
};
