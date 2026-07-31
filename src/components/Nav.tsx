"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav" data-stuck={stuck}>
      <div className="container nav__inner">
        <a className="nav__mark" href="#home" aria-label="UWPM — home">
          <Image
            src="/logos/uwpm-logo.png"
            alt="UWPM"
            width={4047}
            height={1921}
            priority
          />
        </a>
        <nav className="nav__links utility" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} className="nav__link" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
