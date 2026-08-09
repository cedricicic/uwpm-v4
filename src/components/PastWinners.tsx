"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import Frame from "./Frame";
import SectionHeader from "./ui/SectionHeader";
import WinnerCard, { WinnerProject } from "./ui/WinnerCard";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const projects: WinnerProject[] = [
  {
    src: "/prodcon/24/prodcon2401.webp",
    title: "SAMM",
    award: "1st Place. Grand Winner.",
    team: "Subodh Thallada, Mihajlo Micic, Akira Takaki, Marc Da Silva",
    desc: "An AI product discovery platform that accelerates market validation from weeks into hours. It transforms raw consumer insights into complete product strategies, visual roadmaps, and spatial prototypes.",
  },
  {
    src: "/prodcon/24/prodcon2402.webp",
    title: "Oyster",
    award: "2nd Place. Runner Up.",
    team: "Artemis Cherkaev, Ryushen Tan, James Liang, Petar Isakovic",
    desc: "Intelligent product lifecycle management engine that translates user feedback and wireframes into interactive prototypes while aligning developer specifications in real time.",
  },
  {
    src: "/prodcon/24/prodcon2403.webp",
    title: "Auctopus",
    award: "3rd Place. Finalist.",
    team: "Caellum Yip Hoi Lee, Chloe Houvardas, Daniel Shah, Jeremy Liu",
    desc: "Full funnel product intelligence tool that converts strategic vision into validated user experience flows, automated market research, and synthetic user cohort testing.",
  },
  {
    src: "/prodcon/24/prodcon2404.webp",
    title: "Paletto",
    award: "Best Design Award.",
    team: "Kate Chen, Ethan Zhang, Sophia Liu, Alan Wang",
    desc: "Design system infrastructure tool that unifies product design tokens, automated accessibility auditing, and scalable design components across enterprise design systems.",
  },
  {
    src: "/prodcon/24/prodcon2405.webp",
    title: "HackerPilot",
    award: "People's Choice Award.",
    team: "Nathan Wong, Clara Xu, David Park, Maya Singh",
    desc: "Real time copilot for product management teams that tracks sprint velocity, optimizes resource management, and generates comprehensive product requirement docs and stakeholder pitches.",
  },
  {
    src: "/prodcon/24/prodcon2406.webp",
    title: "PricePulse",
    award: "Best Pitch Award.",
    team: "Julian Roy, Hannah Kim, Owen Chen, Leo Verma",
    desc: "Data driven product monetization platform that analyzes feature usage telemetry and user funnel retention to optimize SaaS pricing tier structures and value metrics.",
  },
];

export default function PastWinners() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("all", () => {
        const getScrollAmount = () => {
          const track = trackRef.current;
          const band = track?.parentElement;
          const lastCard = track?.lastElementChild;
          if (!track || !band || !(lastCard instanceof HTMLElement)) return 0;

          // Offset values stay stable while GSAP changes the track transform.
          return -Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth - band.clientWidth);
        };

        gsap.to(trackRef.current, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            start: "top top",
            end: () => "+=" + Math.abs(getScrollAmount()),
            scrub: 0.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section className="section past-winners" id="winners" ref={sectionRef}>
      <Frame at={[0, 6]} />

      {/* Decorative background SVGs */}
      <div className="past-winners__decorations" aria-hidden="true">
        <Image
          src="/svg/Highlight 29.svg"
          alt=""
          width={62}
          height={69}
          className="past-winners__svg past-winners__svg--highlight"
        />
        <Image
          src="/svg/Vector.svg"
          alt=""
          width={129}
          height={84}
          className="past-winners__svg past-winners__svg--vector"
        />
        <Image
          src="/svg/Stars.svg"
          alt=""
          width={80}
          height={80}
          className="past-winners__svg past-winners__svg--star-solid"
        />
        <Image
          src="/svg/Stars-1.svg"
          alt=""
          width={90}
          height={90}
          className="past-winners__svg past-winners__svg--star-outline"
        />
      </div>

      <div className="past-winners__inner">
        <div className="container">
          <SectionHeader title="Past winners" />
        </div>

        {/* Pinned Horizontal Track Container */}
        <div className="past-winners__band">
          <div className="past-winners__track" ref={trackRef}>
            {projects.map((p, idx) => (
              <WinnerCard key={idx} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
