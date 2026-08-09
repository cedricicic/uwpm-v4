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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="nav" data-stuck={stuck} data-open={menuOpen}>
      <div className="container nav__inner">
        <a
          className="nav__mark"
          href="#home"
          aria-label="UWPM Home"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logos/uwpm-logo.png"
            alt="UWPM"
            width={4047}
            height={1921}
            priority
          />
        </a>

        {/* Desktop Primary Navigation */}
        <nav className="nav__links nav__links--desktop" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} className="nav__link" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="nav__toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-nav"
        className={`nav__mobile ${menuOpen ? "nav__mobile--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="nav__mobile-links" aria-label="Mobile Primary">
          {links.map((l) => (
            <a
              key={l.href}
              className="nav__mobile-link"
              href={l.href}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
