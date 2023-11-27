export function startAnimation() {
    gsap.from(".quotes-element", { x: 1000, duration: 1, ease: "back.out(3)", stagger: 0.5 });
}
