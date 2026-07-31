"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * A single hexagon that opens along one of a section's rules every
 * so often, then retracts. Same language as the bar field, but rare
 * enough to read as a punctuation mark rather than a pattern.
 */

const COLS = 12;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));

export default function Spark({ count = 1 }: { count?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".spark__bar").forEach((el) => {
        const place = () => {
          const col = randInt(0, COLS - 2);
          const span = Math.min(randInt(1, 3), COLS - col);
          const atTop = Math.random() < 0.5;
          gsap.set(el, {
            left: `${(col / COLS) * 100}%`,
            width: `${(span / COLS) * 100}%`,
            top: atTop ? 0 : "auto",
            bottom: atTop ? "auto" : 0,
            background: Math.random() < 0.2 ? "var(--ink)" : "var(--signal)",
            transformOrigin:
              Math.random() < 0.5 ? "left center" : "right center",
          });
        };

        place();
        gsap.set(el, { scaleX: 0 });

        gsap
          .timeline({
            repeat: -1,
            delay: rand(3, 12),
            repeatDelay: rand(7, 18),
            onRepeat: place,
          })
          .to(el, { scaleX: 1, duration: rand(0.6, 1), ease: "power3.inOut" })
          .to(el, {
            scaleX: 0,
            duration: rand(0.5, 0.9),
            ease: "power3.inOut",
            delay: rand(1.2, 2.6),
          });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="spark" ref={root} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span className="spark__bar" key={i} />
      ))}
    </div>
  );
}
