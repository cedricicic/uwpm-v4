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
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.from(Array.from(group.children), {
          y: 30,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return null;
}
