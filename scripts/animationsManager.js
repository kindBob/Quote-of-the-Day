import { checkPreviousQuotesReadiness } from "./quotesManager.js";
import { prefersReducedMotion } from "./userInteractions.js";

const tl = gsap.timeline();

export const lenis = new Lenis();

checkPreviousQuotesReadiness().then(() => {
    if (prefersReducedMotion) return;

    startAnimations();
});

function startAnimations() {
    requestAnimationFrame(raf);

    const quotes = gsap.utils.toArray(".quotes-element");

    // quotes.forEach((quote) => {
    //     gsap.from(quote, {
    //         x: "-100vw",
    //         scrollTrigger: {
    //             trigger: quote,
    //             scrub: 1,
    //             start: "-65% center",
    //             end: "35% center",
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
