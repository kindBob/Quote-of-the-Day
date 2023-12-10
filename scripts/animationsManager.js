import { checkPreviousQuotesReadiness } from "./quotesManager.js";
import { prefersReducedMotion } from "./userInteractions.js";

let previousQuotesTl = null;
let lenis = null;
let quotes = [];

const lenisOptions = {
    // duration: 0.9,
    // lerp: 0.2,
    duration: 1,
    normalizeWheel: true,
    // easing: (x) => Math.sin((x * Math.PI) / 2),
};
const previousQuotesHiddenOptions = {
    height: 0,
    width: 0,
    margin: 0,
    padding: 0,
    overflow: "hidden",
    duration: 0,
    stagger: 0,
    ease: "power2.inOut",
};

checkPreviousQuotesReadiness().then(() => {
    if (prefersReducedMotion) return;

    setupInitialAnimations();
});

function setupInitialAnimations() {
    previousQuotesTl = gsap.timeline();

    quotes = gsap.utils.toArray(".history-quote-element");
    lenis = new Lenis(lenisOptions);

    requestAnimationFrame(raf);

    // gsap.set(".history-quote-element:not(.--always-shown)", previousQuotesHiddenOptions);

    previousQuotesHiddenOptions.duration = prefersReducedMotion ? 0 : 1;
    previousQuotesHiddenOptions.stagger = prefersReducedMotion ? 0 : 0.1;

    previousQuotesTl.to(".history-quote-element:not(.--always-shown)", previousQuotesHiddenOptions);

    // gsap.from("#index-0", {
    //     y: "100vh",
    //     duration: 1.5,
    //     ease: "expo.inOut",
    // });

    startScrollAnimations();
}

function startScrollAnimations() {
    gsap.to("#index-0", {
        y: "-100%",
        ease: (x) => x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
        overwrite: "true",
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
            // markers: true,
        },
    });
    gsap.from(".history-title", {
        opacity: 0,
        scrollTrigger: {
            trigger: ".history-title",
            scrub: 1.2,
            start: "top bottom",
            end: "bottom center",
            // markers: true,
        },
    });

    quotes.forEach((quote) => {
        gsap.from(quote, {
            x: "-100vw",
            ease: (x) => x < 0.5
                ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
            scrollTrigger: {
                trigger: quote,
                scrub: 1.5,
                start: "center bottom",
                end: "bottom bottom",
                // markers: true,
            },
        });
    });
}

function changePreviousQuotesVisibility(act) {
    previousQuotesHiddenOptions.duration = prefersReducedMotion ? 0 : 1;
    previousQuotesHiddenOptions.stagger = prefersReducedMotion ? 0 : 0.1;

    if (act == "showMore") previousQuotesTl.reverse();
    else previousQuotesTl.restart();
}

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

export { lenis, changePreviousQuotesVisibility };
