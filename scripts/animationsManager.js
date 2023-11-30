import { checkPreviousQuotesReadiness } from "./quotesManager.js";
import { prefersReducedMotion } from "./userInteractions.js";

const tl = gsap.timeline();

// lenis.stop();

checkPreviousQuotesReadiness().then(() => {
    if (prefersReducedMotion) return;

    startAnimations();
});

function startAnimations() {
    // lenis.start();

    // setTimeout(() => {
    //     const lenis = new Lenis({
    //         wrapper: window,
    //         content: document.documentElement,
    //     });

    //     function raf(time) {
    //         lenis.raf(time);
    //         requestAnimationFrame(raf);
    //     }
    //     requestAnimationFrame(raf);
    // }, 1000);

    const quotes = gsap.utils.toArray(".quotes-element");

    quotes.forEach((quote) => {
        gsap.from(quote, {
            x: "-100vw",
            scrollTrigger: {
                trigger: quote,
                scrub: 1,
                start: "-65% center",
                end: "35% center",
                markers: true,
                snap: {
                    snapTo: "labels",
                },
            },
        });
    });

    // const tl2 = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: ".quotes-element",
    //         start: "-50% center",
    //         end: "55% center",
    //         scrub: true,
    //         markers: true,
    //     },
    // });

    // tl2.from(".quotes-element", { x: "100vw" });

    tl.from(".quotes-element", { y: "100vw", duration: 1.5, ease: "expo.inOut" });
    tl.from(".separator", { scaleX: 0, duration: 1, ease: "expo.inOut" }, "-=60%");
    tl.from(".history-title", { opacity: 0, duration: 1, ease: "power2.inOut" }, "-=30%");
}
