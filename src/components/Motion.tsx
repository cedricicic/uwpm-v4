"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Scroll reveals, wired by data attribute so sections stay declarative.
 * Everything is opt-in and runs once; nothing loops.
 */
export default function Motion() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 16,
          autoAlpha: 0,
          duration: 0.45,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.from(Array.from(group.children), {
          y: 20,
          autoAlpha: 0,
          duration: 0.45,
          ease: "power4.out",
          stagger: 0.04,
          scrollTrigger: { trigger: group, start: "top 90%", once: true },
        });
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return null;
}
