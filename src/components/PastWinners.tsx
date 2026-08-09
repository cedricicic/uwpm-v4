"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import Frame from "./Frame";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const projects = [
  {
    src: "/prodcon/24/prodcon2401.webp",
    title: "SAMM",
    award: "1ST PLACE | GRAND WINNER",
    team: "SUBODH THALLADA, MIHAJLO MICIC, AKIRA TAKAKI, MARC DA SILVA",
    desc: "An AI product discovery platform that accelerates market validation from weeks into hours. It transforms raw consumer insights into complete product strategies, visual roadmaps, and spatial prototypes.",
  },
  {
    src: "/prodcon/24/prodcon2402.webp",
    title: "Oyster",
    award: "2ND PLACE | RUNNER UP",
    team: "ARTEMIS CHERKAEV, RYUSHEN TAN, JAMES LIANG, PETAR ISAKOVIC",
    desc: "Intelligent product lifecycle management engine that translates user feedback and wireframes into interactive prototypes while aligning developer specifications in real time.",
  },
  {
    src: "/prodcon/24/prodcon2403.webp",
    title: "Auctopus",
    award: "3RD PLACE | FINALIST",
    team: "CAELLUM YIP HOI LEE, CHLOE HOUVARDAS, DANIEL SHAH, JEREMY LIU",
    desc: "Full funnel product intelligence tool that converts strategic vision into validated user experience flows, automated market research, and synthetic user cohort testing.",
  },
  {
    src: "/prodcon/24/prodcon2404.webp",
    title: "Paletto",
    award: "BEST DESIGN AWARD",
    team: "KATE CHEN, ETHAN ZHANG, SOPHIA LIU, ALAN WANG",
    desc: "Design system infrastructure tool that unifies product design tokens, automated accessibility auditing, and scalable design components across enterprise design systems.",
  },
  {
    src: "/prodcon/24/prodcon2405.webp",
    title: "HackerPilot",
    award: "PEOPLE’S CHOICE AWARD",
    team: "NATHAN WONG, CLARA XU, DAVID PARK, MAYA SINGH",
    desc: "Real time copilot for product management teams that tracks sprint velocity, optimizes resource management, and generates comprehensive product requirement docs and stakeholder pitches.",
  },
  {
    src: "/prodcon/24/prodcon2406.webp",
    title: "PricePulse",
    award: "BEST PITCH AWARD",
    team: "JULIAN ROY, HANNAH KIM, OWEN CHEN, LEO VERMA",
    desc: "Data driven product monetization platform that analyzes feature usage telemetry and user funnel retention to optimize SaaS pricing tier structures and value metrics.",
  },
];

export default function PastWinners() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        if (!trackRef.current || !trackRef.current.parentElement) return 0;
        const trackWidth = trackRef.current.scrollWidth;
        const containerWidth = trackRef.current.parentElement.clientWidth;
        return -(trackWidth - containerWidth + 90);
      };

      gsap.to(trackRef.current, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: () => "+=" + Math.abs(getScrollAmount()),
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section past-winners" id="winners" ref={sectionRef}>
      <Frame at={[0, 6]} />

      <div className="past-winners__inner">
        <div className="container">
          <div className="section__head inset">
            <h2 className="heading" data-reveal>
              Impactful projects.
            </h2>
          </div>
        </div>

        {/* Pinned Horizontal Track Container */}
        <div className="past-winners__band">
          <div className="past-winners__track" ref={trackRef}>
            {projects.map((p, idx) => (
              <div key={idx} className="past-winners__project-col">
                <div className="past-winners__card-box">
                  <div className="past-winners__img-wrap">
                    <Image
                      src={p.src}
                      alt={p.title}
                      fill
                      sizes="(max-width: 767px) 85vw, 36vw"
                      className="past-winners__img"
                    />
                  </div>

                  <span className="utility past-winners__award-tag">{p.award}</span>
                  <h3 className="past-winners__project-title">{p.title}</h3>
                  <p className="past-winners__team">{p.team}</p>
                  <p className="body past-winners__desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
