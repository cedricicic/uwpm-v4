"use client";

import { useEffect, useRef } from "react";
import Frame, { lines } from "./Frame";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Rows of hexagons that stretch open and retract again, each one
 * re-placed at a new random position every cycle. React renders a fixed
 * skeleton and GSAP owns every random value, so there is nothing for the
 * server and client to disagree about.
 */

const ROWS = 5;
const PER_ROW = 3;
const COLS = 28;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));

/** Saturation concentrates in the middle rows and fades to the edges. */
function colorFor(row: number) {
  const centre = 1 - Math.abs(row - (ROWS - 1) / 2) / ((ROWS - 1) / 2);
  const r = Math.random();
  if (r < 0.06) return "var(--ink)";
  if (r < 0.3 + 0.18 * centre) return "var(--signal)";
  if (r < 0.72) return "rgba(255, 77, 86, 0.14)";
  return "rgba(0, 0, 0, 0.05)";
}

export default function BarField() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>(".barfield__row")
        .forEach((rowEl, row) => {
          gsap.utils.toArray<HTMLElement>(".bar", rowEl).forEach((bar) => {
            const place = () => {
              const col = randInt(0, COLS - 3);
              const span = Math.min(randInt(2, 6), COLS - col);
              gsap.set(bar, {
                left: `${(col / COLS) * 100}%`,
                width: `${(span / COLS) * 100}%`,
                background: colorFor(row),
                transformOrigin:
                  Math.random() < 0.5 ? "left center" : "right center",
              });
            };

            place();

            if (reduced) {
              gsap.set(bar, { scaleX: 1 });
              return;
            }

            gsap.set(bar, { scaleX: 0 });
            gsap
              .timeline({
                repeat: -1,
                delay: rand(0, 5),
                repeatDelay: rand(1.4, 5),
                onRepeat: place,
              })
              .to(bar, {
                scaleX: 1,
                duration: rand(0.6, 1.2),
                ease: "power3.inOut",
              })
              .to(bar, {
                scaleX: 0,
                duration: rand(0.5, 1),
                ease: "power3.inOut",
                delay: rand(0.8, 2.4),
              });
          });
        });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="barfield" ref={root} aria-hidden="true">
      <Frame at={lines(1)} />
      {Array.from({ length: ROWS }, (_, r) => (
        <div className="barfield__row" key={r}>
          {Array.from({ length: PER_ROW }, (_, i) => (
            <span className="bar" key={i} />
          ))}
        </div>
      ))}
    </div>
  );
}
