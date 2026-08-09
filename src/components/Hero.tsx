"use client";

import { useLayoutEffect, useRef } from "react";
import HeroBloom from "./HeroBloom";
import Frame, { COLUMNS } from "./Frame";
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
 * The hero draws only the left half of the six-column field. The bloom
 * occupies the right side on its own, so the lines stop before they
 * start reading as a cage around it.
 *
 * The first line runs the section's full height: it sits in the margin
 * beside the type, so it reads as the block's left edge rather than as
 * something crossing it.
 */
const HERO_EDGE = [0];

/**
 * The lines that would cross the headline. Drawn inside it rather than by
 * <Frame>, so each breaks at the rules above and below the type and
 * resumes past them. The grid runs around the headline, never through it.
 */
const HERO_RAILS: number[] = [];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero__line > span");

      gsap.set(lines, { yPercent: 100 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 0.55,
        ease: "power4.out",
        stagger: 0.04,
        delay: 0.05,
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
      <HeroBloom />
      <Frame at={HERO_EDGE} />
      <div className="container">
        <h1 className="display hero__title" ref={title}>
          <span className="hero__rails" aria-hidden="true">
            {HERO_RAILS.map((i) => (
              <i key={i} style={{ left: `${(i * 100) / COLUMNS}%` }} />
            ))}
          </span>
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
