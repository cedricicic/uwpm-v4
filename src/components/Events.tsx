"use client";

import { useState } from "react";
import Frame, { lines, without } from "./Frame";
import Spark from "./Spark";

// Add entries here and the carousel controls activate automatically.
const events = [
  {
    title: "ProdCon 2024",
    date: "November 16th, 2024",
    copy: "ProdCon is the University of Waterloo's product management case study competition. You will get an opportunity to solve a case, present it to judges and network with industry professionals.",
  },
];

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d={dir === "left" ? "M10 2 4 8l6 6" : "M6 2l6 6-6 6"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
    />
  </svg>
);

export default function Events() {
  const [index, setIndex] = useState(0);
  const many = events.length > 1;

  const go = (step: number) =>
    setIndex((i) => (i + step + events.length) % events.length);

  return (
    <section className="section" id="events">
      <Frame at={lines(3)} />
      <Spark />
      <div className="container">
        <div className="events__head inset">
          <h2 className="heading" data-reveal>
            Past events
          </h2>
          <div className="arrows">
            <button
              className="arrow"
              onClick={() => go(-1)}
              disabled={!many}
              aria-label="Previous event"
            >
              <Chevron dir="left" />
            </button>
            <button
              className="arrow"
              onClick={() => go(1)}
              disabled={!many}
              aria-label="Next event"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        <div className="carousel" data-reveal>
          <div
            className="carousel__track"
            style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          >
            {events.map((e, i) => (
              <article
                className="slide"
                key={e.title}
                aria-hidden={i !== index}
                inert={i !== index}
              >
                <div>
                  <h3 className="slide__title">{e.title}</h3>
                  <p className="slide__date utility">{e.date}</p>
                </div>
                <p className="body slide__copy">{e.copy}</p>
              </article>
            ))}
          </div>
        </div>

      </div>

      {/* Below the carousel the grid re-divides toward the six columns
          the gallery and the section after it are built on. The extra
          lines start on the carousel's rule and run down into the
          gallery, so nothing begins in mid-air. */}
      <div className="events__tail">
        <Frame at={without(lines(1), lines(3))} />
        <div className="container">
          <div className="events__foot inset">
            <a className="link-arrow utility" href="#events">
              View all events
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 8h12M9 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
