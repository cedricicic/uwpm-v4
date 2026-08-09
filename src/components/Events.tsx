"use client";

import { useState } from "react";
import Image from "next/image";
import Frame from "./Frame";
import SectionHeader from "./ui/SectionHeader";
import DotsIndicator from "./ui/DotsIndicator";

interface EventItem {
  title: string;
  date: string;
  copy: string;
  image?: string;
}

// Add entries here and the carousel controls activate automatically.
const events: EventItem[] = [
  {
    title: "ProdCon 2024",
    date: "November 16th, 2024",
    copy: "ProdCon is the University of Waterloo's product management case study competition. You will get an opportunity to solve a case, present it to judges and network with industry professionals.",
    image: "/prodcon/24/prodcon2402.webp",
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
      <Frame at={[0, 6]} />
      <div className="container">
        <SectionHeader
          className="events__head"
          title="Past events"
          action={{ label: "View all events", href: "#events" }}
        />

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
                <div className="slide__info">
                  <h3 className="slide__title">{e.title}</h3>
                  <p className="slide__date utility">{e.date}</p>
                  <p className="body slide__copy">{e.copy}</p>
                  <div className="arrows" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button
                      className="arrow"
                      onClick={() => go(-1)}
                      disabled={!many}
                      aria-label="Previous event"
                    >
                      <Chevron dir="left" />
                    </button>
                    {many && (
                      <DotsIndicator
                        total={events.length}
                        active={index}
                        onSelect={setIndex}
                        ariaLabel="Events progress"
                      />
                    )}
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
                {e.image && (
                  <div className="slide__media">
                    <Image
                      src={e.image}
                      alt={e.title}
                      width={800}
                      height={500}
                      className="slide__img"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
