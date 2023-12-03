import { checkPreviousQuotesReadiness } from "./quotesManager.js";
import { prefersReducedMotion } from "./userInteractions.js";

const lenisOptions = { duration: 0.9 };
let lenis = null;

const tl = gsap.timeline();

checkPreviousQuotesReadiness().then(() => {
    if (prefersReducedMotion) return;

    startAnimations();
});

function startAnimations() {
    const quotes = gsap.utils.toArray(".quotes-element");

    lenis = new Lenis(lenisOptions);

    requestAnimationFrame(raf);

    // quotes.forEach((quote) => {
    //     gsap.from(quote, {
    //         x: "-100vw",
    //         scrollTrigger: {
    //             trigger: quote,
    //             scrub: 1,
    //             start: "-65% center",
    //             end: "30% center",
    //             markers: true,
    //         },
    //     });
    // });

    // tl.from(".quotes-element", { y: "100vw", duration: 1.5, ease: "expo.inOut" });
    // tl.from(".separator", { scale: 0, duration: 1, ease: "expo.inOut" }, "-=60%");
    // tl.from(".history-title", { opacity: 0, duration: 1, ease: "power2.inOut" }, "-=30%");
}

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

export { lenis };
