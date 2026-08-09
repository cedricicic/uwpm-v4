"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import Frame from "./Frame";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Posters from past events, laid out as one overlapping row.
 *
 * Each poster carries only what a designer would want to nudge: how far
 * it sits off the centre line and how far it is turned. Everything
 * structural (where it sits across the band, how fast it travels) is
 * derived from its index, so adding or removing a poster re-spaces the
 * whole row instead of leaving a hole.
 */
/** `lift` is a signed share of the band's sway, `tilt` is degrees. */
const posters = [
  { src: "/events/prodcon-2024.jpg", alt: "ProdCon 2024: applications open", lift: 0.3, tilt: -6 },
  { src: "/events/mocktails-and-cheese.jpg", alt: "Mocktails & Cheese product social night", lift: -1, tilt: 4 },
  { src: "/events/product-night-w24.jpg", alt: "Blueprint × UWPM Product Night", lift: 0.3, tilt: -3 },
  { src: "/events/product-night-s24.jpg", alt: "UWPM × Blueprint Product Night", lift: -0.7, tilt: 7 },
  { src: "/events/resume-revamp.jpg", alt: "Resume Revamp workshop", lift: 1, tilt: -5 },
  { src: "/events/ice-cream-social.jpg", alt: "Ice Cream Social with mock interviews and resume critique", lift: 0.7, tilt: 3 },
  { src: "/events/rise-2024.jpg", alt: "RISE 2024 product challenge", lift: -0.4, tilt: -7 },
];

/**
 * Horizontal travel, as a share of a poster's own width. It climbs from
 * the first poster to the last, so the row shears open from the left and
 * the sweep reads as travelling right — the further along the row, the
 * faster the poster runs.
 */
const DRIFT_FIRST = 10;
const DRIFT_LAST = 42;

const at = (i: number) => i / (posters.length - 1);

export default function Gallery() {
  const band = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!band.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gallery__item").forEach((el, i) => {
        const drift = DRIFT_FIRST + (DRIFT_LAST - DRIFT_FIRST) * at(i);

        gsap.fromTo(
          el,
          { xPercent: -drift },
          {
            xPercent: drift,
            ease: "none",
            scrollTrigger: {
              trigger: band.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.25,
            },
          },
        );
      });
    }, band);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="gallery"
      ref={band}
      aria-label="Posters from past UWPM events"
    >
      {/* The band is where the grid resolves from the two columns above
          to the six below. Running the full field through here lets that
          happen behind the posters rather than as a jump between
          sections. */}
      <Frame at={[0, 6]} />

      {posters.map((p, i) => (
        <div
          className="gallery__item"
          key={p.src}
          style={
            {
              // The first and last lanes sit on the band's own edges, so
              // half of each end poster always hangs off — the row never
              // opens a margin at either side as the parallax runs.
              "--lane": `${at(i) * 100}%`,
              "--lift": p.lift,
              "--tilt": `${p.tilt}deg`,
            } as React.CSSProperties
          }
        >
          <div className="gallery__poster">
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 899px) 45vw, 22vw"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
