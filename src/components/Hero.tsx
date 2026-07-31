"use client";

import { useLayoutEffect, useRef } from "react";
import HeroField from "./HeroField";
import Frame from "./Frame";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const LINES = [
  "Fostering the",
  "Creative",
  "Product",
  "Management",
  "Community",
  "@ UWaterloo.",
];

/** The one word the accent colour is spent on. */
const ACCENT = 1;

/**
 * The hero shows five of the six-column field's lines. Dropping the
 * fourth and the far edge leaves the headline block ending on a line
 * that is still drawn, so the type closes the grid instead of running
 * past it.
 */
const HERO_LINES = [0, 1, 2, 4, 5];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero__line > span");

      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.075,
        delay: 0.12,
      });

      gsap.to(title.current, {
        yPercent: -13,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="home" ref={root}>
      <HeroField />
      <Frame at={HERO_LINES} />
      <div className="container">
        <h1 className="display hero__title" ref={title}>
          <span className="inset">
            {LINES.map((line, i) => (
              <span className="hero__line" key={i}>
                <span className={i === ACCENT ? "hero__em" : undefined}>
                  {line}
                </span>
              </span>
            ))}
          </span>
        </h1>
      </div>
    </section>
  );
}
