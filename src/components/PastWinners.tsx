"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import Frame from "./Frame";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const projects = [
  {
    src: "/prodcon/24/prodcon2401.webp",
    title: "SAMM",
    award: "1ST PLACE — GRAND WINNER",
    team: "SUBODH THALLADA, MIHAJLO MICIC, AKIRA TAKAKI, MARC DA SILVA",
    desc: "An AI innovation platform that compresses weeks of product work into an afternoon. It turns a rough idea into a brand-aligned concept with strategy, visuals, 3D renders, and video.",
  },
  {
    src: "/prodcon/24/prodcon2402.webp",
    title: "Oyster",
    award: "2ND PLACE — RUNNER UP",
    team: "ARTEMIS CHERKAEV, RYUSHEN TAN, JAMES LIANG, PETAR ISAKOVIC",
    desc: "Makes game dev more accessible by turning sketches into 3D assets for Godot. An AI agent understands and edits your codebase with hot-reloaded changes.",
  },
  {
    src: "/prodcon/24/prodcon2403.webp",
    title: "Auctopus",
    award: "3RD PLACE — FINALIST",
    team: "CAELLUM YIP HOI - LEE, CHLOE HOUVARDAS, DANIEL SHAH, JEREMY LIU",
    desc: "An end-to-end AI platform that takes a product prompt to an interactive prototype. It researches the brand, generates 3D models and videos, and runs user simulations.",
  },
  {
    src: "/prodcon/24/prodcon2404.webp",
    title: "Paletto",
    award: "BEST DESIGN AWARD",
    team: "KATE CHEN, ETHAN ZHANG, SOPHIA LIU, ALAN WANG",
    desc: "Design system synthesizer that generates production-grade UI components, color palettes, and motion presets directly from Figma design files.",
  },
  {
    src: "/prodcon/24/prodcon2405.webp",
    title: "HackerPilot",
    award: "PEOPLE’S CHOICE AWARD",
    team: "NATHAN WONG, CLARA XU, DAVID PARK, MAYA SINGH",
    desc: "Real-time co-pilot for hackathon teams that tracks task velocity, manages API credits, and auto-generates Devpost submissions and pitch slides.",
  },
  {
    src: "/prodcon/24/prodcon2406.webp",
    title: "PricePulse",
    award: "BEST PITCH AWARD",
    team: "JULIAN ROY, HANNAH KIM, OWEN CHEN, LEO VERMA",
    desc: "SaaS pricing optimizer that analyzes user conversion funnels and competitor telemetry to recommend dynamic tier pricing and feature gates.",
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
