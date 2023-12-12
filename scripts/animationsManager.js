import { checkPreviousQuotesReadiness } from "./quotesManager.js";
import { prefersReducedMotion } from "./userInteractions.js";

let previousQuotesTl = null;
let quotes = [];

const previousQuotesHiddenOptions = {
    height: 0,
    width: 0,
    margin: 0,
    padding: 0,
    overflow: "hidden",
    opacity: 0,
    ease: "none",
};

checkPreviousQuotesReadiness().then(() => {
    if (!prefersReducedMotion) setupInitialAnimations();

    previousQuotesTl = gsap.timeline();

    previousQuotesTl.to(".history-quote-element:not(.--always-shown)", {
        duration: prefersReducedMotion ? 0 : 1,
        ease: (x) =>
            x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
        keyframes: [{ opacity: 0, yPercent: 100 }, previousQuotesHiddenOptions],
    });
    previousQuotesTl.seek(previousQuotesTl.duration());
});

function setupInitialAnimations() {
    // gsap.from("#index-0", {
    //     y: "100vh",
    //     duration: 1.5,
    //     ease: "expo.inOut",
    // });

    startScrollAnimations();
}

function startScrollAnimations() {
    quotes = gsap.utils.toArray(".history-quote-element");

    gsap.to("#index-0", {
        y: "-100%",
        overwrite: "auto",
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#index-0",
            scrub: 1.2,
            start: "top top",
            end: "bottom top",
        },
    });

    gsap.from(".separator", {
        scale: 0,
        scrollTrigger: {
            trigger: ".separator",
            scrub: 1.2,
            start: "top bottom",
            end: "bottom center",
        },
        ease: "power2.inOut",
    });
    gsap.from(".history-title", {
        opacity: 0,
        scrollTrigger: {
            trigger: ".history-title",
            scrub: 1.2,
            start: "top bottom",
            end: "bottom center",
        },

        ease: "power2.inOut",
    });

    quotes.forEach((quote) => {
        gsap.from(quote, {
            x: "-100vw",
            overwrite: "auto",
            scrollTrigger: {
                trigger: quote,
                scrub: 1.2,
                start: "55% bottom",
                end: "105% bottom",
            },
            ease: "power2.inOut",
        });
    });
}

const openedSections = [];
function startSecondarySectionAnimations(options) {
    const { section, delay } = options;

    if (section == "main") return;

    for (const el of openedSections) {
        if (el == section) return;
    }

    openedSections.push(section);

    const tl = gsap.timeline({
        delay: `${delay}`,
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
    if (act == "showMore") previousQuotesTl.reverse();
    else previousQuotesTl.restart();
}

export { changePreviousQuotesVisibility, startSecondarySectionAnimations };
