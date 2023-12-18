import { checkPreviousQuotesReadiness, savedQuotes } from "./quotesManager.js";
import { prefersReducedMotion, smallScreen, savedOpened } from "./userInteractions.js";

const mainHeader = document.querySelector("#main-header");
const mainLogo = mainHeader.querySelector(".logo");
const mainNavBar = mainHeader.querySelector(".nav-bar");
const mainNavBarList = mainNavBar.querySelector(".nav-bar__list");
const mainNavBarListElements = mainNavBarList.children;

const aboutUsSection = document.querySelector("#about-us-section");
const savedSection = document.querySelector("#saved-section");
const mainSection = document.querySelector("#main-section");

const footersContent = document.querySelectorAll(".footer__content");

const savedPlaceholder = savedSection.querySelector("#saved-placeholder");

let previousQuotesTl = null;
let previousQuotes = [];

const previousQuotesHiddenOptions = {
    height: 0,
    width: 0,
    margin: 0,
    padding: 0,
    overflow: "hidden",
    opacity: 0,
    yPercent: 200,
};

gsap.registerPlugin(ScrollToPlugin);

checkPreviousQuotesReadiness().then(() => {
    if (!prefersReducedMotion) setupInitialAnimations();

    const overlay = document.querySelector("#overlay");
    const loading = document.querySelector("#loading");
    const spinner = loading.querySelector(".spinner");

    // loading.classList.add("--active");
    // spinner.classList.add("--active");

    gsap.to(overlay, {
        autoAlpha: 0,
        ease: "power2.inOut",
        duration: prefersReducedMotion ? 0 : 0.2,
        onComplete: () => {
            overlay.classList.remove("--active");

            loading.classList.remove("--active");
            spinner.classList.remove("--active");
        },
    });
});

function setupInitialAnimations() {
    !smallScreen && startScrollAnimations();

    previousQuotesTl = gsap.timeline();

    previousQuotesTl.to(".history-quote-element:not(.--always-shown)", {
        keyframes: [{ opacity: 0, yPercent: 200 }, previousQuotesHiddenOptions],
        duration: prefersReducedMotion ? 0 : 0.5,
    });
    previousQuotesTl.seek(previousQuotesTl.duration());

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
    previousQuotes = gsap.utils.toArray(".history-quote-element");

    gsap.to("#index-0", {
        scale: 5,
        autoAlpha: 0,
        overwrite: "auto",
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#index-0",
            scrub: 1.2,
            start: "center center",
            end: "75% top",
        },
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

    previousQuotes.forEach((quote) => {
        gsap.from(quote, {
            yPercent: 50,
            autoAlpha: 0,
            overwrite: true,
            scrollTrigger: {
                trigger: quote,
                scrub: 1.5,
                start: "top 70%",
                end: "center bottom",
            },
            ease: "power2",
        });
    });
}

const openedSections = [];

function showFooter(el, section, tl) {
    if (section == "saved")
        tl.from(el, {
            // xPercent: 100,
            width: 0,
        });
    else
        tl.from(el, {
            // xPercent: -100,
            width: 0,
        });
}

function startSecondarySectionAnimations(options) {
    const { section, delay } = options;

    const sectionElement = document.querySelector(`#${section}-section`);
    const footer = sectionElement.querySelector("footer");
    const header = sectionElement.querySelector("header");
    const title = sectionElement.querySelector(".section-title");
    const closeBtn = sectionElement.querySelector(".close-btn");
    const footerContent = footer.querySelector(".content");
    const mainContainer = sectionElement.querySelector(".container.--main");

    const defaultDuration = 0.7;

    const tl = gsap.timeline({
        delay: `${delay * 0.4}`,
        defaults: {
            duration: defaultDuration,
            ease: "power3.inOut",
        },
    });

    tl.addLabel("first");

    for (const el of openedSections) {
        if (el == section) return;
    }

    openedSections.push(section);

    // showFooter(footer, section, tl);

    // tl.from(
    //     header,
    //     {
    //         yPercent: -100,
    //     },
    //     "first"
    // );

    tl.addLabel("second", "first+=0.2");

    tl.from(
        title,
        {
            y: -header.clientHeight,
        },
        "second"
    );

    tl.from(
        closeBtn,
        {
            y: -header.clientHeight,
        },
        "second"
    );

    tl.call(() =>
        showSplitText(footerContent, null, () => {
            if (savedOpened && savedQuotes.length == 0) {
                showSplitText(savedPlaceholder);
            }
        })
    );

    tl.from(mainContainer, {
        autoAlpha: 0,
        ease: "none",
        duration: 0.4,
    });
}

function changePreviousQuotesVisibility(act) {
    if (act == "showMore") {
        const firstHiddenElement = document.querySelector("#index-4");

        previousQuotesTl.reverse();
    } else previousQuotesTl.restart();
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

        if (char === " ") newEl.style.width = "0.4em";

        newEl.append(content);

        el.append(newEl);
    });
}

function showSplitText(el, options, cb) {
    el.style.display = "block";

    gsap.from(el.children, {
        y: options?.y || el.clientHeight,
        stagger: options?.stagger || { amount: 0.3 },
        ease: options?.ease || "expo.inOut",
        delay: options?.delay || 0,
        onComplete: cb,
    });
}

export {
    changePreviousQuotesVisibility,
    scrollToPosition,
    setupMainHeaderAnim,
    playNavBarOpeningAnim,
    mainHeaderTl,
    navBarTransition,
    changeSection,
    showSplitText,
};
