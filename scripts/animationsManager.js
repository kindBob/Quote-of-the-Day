import { checkPreviousQuotesReadiness } from "./quotesManager.js";
import { prefersReducedMotion } from "./userInteractions.js";

const mainHeader = document.querySelector("#main-header");
const mainLogo = mainHeader.querySelector(".logo");
const mainNavBar = mainHeader.querySelector(".nav-bar");
const mainNavBarList = mainNavBar.querySelector(".nav-bar__list");
const mainNavBarListElements = mainNavBarList.children;

const aboutUsSection = document.querySelector("#about-us-section");
const savedSection = document.querySelector("#saved-section");
const mainSection = document.querySelector("#main-section");

let previousQuotesTl = null;
let previousQuotes = [];

const previousQuotesHiddenOptions = {
    height: 0,
    width: 0,
    margin: 0,
    padding: 0,
    overflow: "hidden",
    opacity: 0,
    ease: "none",
};

gsap.registerPlugin(ScrollToPlugin);

checkPreviousQuotesReadiness().then(() => {
    if (!prefersReducedMotion) setupInitialAnimations();

    previousQuotesTl = gsap.timeline();

    previousQuotesTl.to(".history-quote-element:not(.--always-shown)", {
        keyframes: [{ opacity: 0, yPercent: 100 }, previousQuotesHiddenOptions],
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: "power2.inOut",
    });
    previousQuotesTl.seek(previousQuotesTl.duration());
});

function setupInitialAnimations() {
    startScrollAnimations();
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
    });
    mainHeaderTl.to(
        mainNavBarListElements[2],
        {
            x: -mainNavBarListElements[2].clientWidth * 1.2 - 15,
        },
        "<"
    );

    mainHeaderTl.to(mainNavBar, { rotateZ: 180, scale: 0, autoAlpha: 0 });

    mainHeaderTl.fromTo(mainLogo, { rotateZ: 180, scale: 0 }, { rotateZ: 360, scale: 1, autoAlpha: 1 }, "<");
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
            duration: prefersReducedMotion ? 0 : 0.75,
            ease: "elastic(1, 0.75)",
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
        y: "-100%",
        overwrite: "auto",
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#index-0",
            scrub: 1.2,
            start: "-50% top",
            end: "110% top",
        },
    });

    gsap.from(".separator", {
        scale: 0,
        scrollTrigger: {
            trigger: ".history-title",
            scrub: 1.2,
            start: "200% bottom",
            end: "bottom center",
        },
        ease: "power2.inOut",
    });

    gsap.from(".history-title", {
        opacity: 0,
        scrollTrigger: {
            trigger: ".history-title",
            scrub: 1.2,
            start: "200% bottom",
            end: "center center",
        },

        ease: "power2.inOut",
    });

    previousQuotes.forEach((quote) => {
        gsap.from(quote, {
            x: "-100vw",
            overwrite: "",
            scrollTrigger: {
                trigger: quote,
                scrub: 1.5,
                start: "50% bottom",
                end: "center center",
            },
            ease: "power2",
        });
    });
}

const openedSections = [];
function startSecondarySectionAnimations(options) {
    const { section, delay } = options;

    for (const el of openedSections) {
        if (el == section) return;
    }

    openedSections.push(section);

    const tl = gsap.timeline({
        delay: `${delay * 0.2}`,
        defaults: {
            duration: 0.7,
            ease: (x) =>
                x < 0.5
                    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
        },
    });

    const sectionElement = document.querySelector(`#${section}-section`);
    const footer = sectionElement.querySelector("footer");
    const header = sectionElement.querySelector("header");
    const title = sectionElement.querySelector(".section-title");
    const closeBtn = sectionElement.querySelector(".close-btn");
    const footerContent = footer.querySelector(".content");
    const mainContainer = sectionElement.querySelector(".container.--main");

    const footerHeight = footer.clientHeight;
    const headerWidth = header.clientWidth;

    tl.addLabel("first");

    tl.from(
        footer,
        {
            yPercent: 100,
        },
        "first"
    );

    tl.from(
        header,
        {
            yPercent: -100,
        },
        "first"
    );

    tl.addLabel("second", "first+=0.2");

    tl.from(
        title,
        {
            x: -headerWidth / 2,
        },
        "second"
    );

    tl.from(
        closeBtn,
        {
            x: headerWidth / 2,
        },
        "second"
    );

    tl.from(
        footerContent,
        {
            y: footerHeight,
            skewY: 15,
        },
        "second+=75%"
    );

    tl.from(
        mainContainer,
        {
            autoAlpha: 0,
            ease: "none",
        },
        ">-=20%"
    );
}

function changePreviousQuotesVisibility(act) {
    if (act == "showMore") {
        const firstHiddenElement = document.querySelector("#index-4");

        previousQuotesTl.reverse();

        // setTimeout(
        //     () =>
        //         scrollToPosition(null, {
        //             y: parseInt(
        //                 firstHiddenElement.getBoundingClientRect().top -
        //                     firstHiddenElement.clientHeight / 2 +
        //                     window.scrollY
        //             ),
        //             ease: "none",
        //         }),
        //     prefersReducedMotion ? 0 : 600
        // );
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
            duration: prefersReducedMotion ? 0 : 0.75,
            ease: "power1",
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

export {
    changePreviousQuotesVisibility,
    scrollToPosition,
    setupMainHeaderAnim,
    playNavBarOpeningAnim,
    mainHeaderTl,
    navBarTransition,
    changeSection,
};
