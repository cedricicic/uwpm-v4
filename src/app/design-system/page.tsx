"use client";

import React, { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import DotsIndicator from "@/components/ui/DotsIndicator";
import Button from "@/components/ui/Button";
import Polaroid from "@/components/ui/Polaroid";
import WinnerCard from "@/components/ui/WinnerCard";

export default function DesignSystemPage() {
  const [activeDot, setActiveDot] = useState(0);

  const sampleWinner = {
    src: "/prodcon/24/prodcon2401.webp",
    title: "SAMM",
    award: "1st Place. Grand Winner.",
    team: "Subodh Thallada, Mihajlo Micic, Akira Takaki, Marc Da Silva",
    desc: "An AI product discovery platform that accelerates market validation. It transforms raw consumer insights into complete product strategies and visual roadmaps.",
  };

  return (
    <>
      <Nav />
      <main className="page inset" style={{ paddingTop: "100px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Style Guide Header */}
        <SectionHeader
          title="UI Design System & Style Guide"
          kicker="Living Specification"
        />

        {/* Section 1: Writing & Voice Rules */}
        <section style={{ marginBottom: "48px", borderBottom: "1px dashed var(--rule)", paddingBottom: "32px" }}>
          <h3 className="heading" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Voice & Writing Guidelines</h3>
          <ul className="body" style={{ listStyleType: "disc", paddingLeft: "24px" }}>
            <li><strong>No em/en dashes:</strong> Replace with periods, colons, or clean sentence breaks.</li>
            <li><strong>No generic filler copy:</strong> State specific details clearly.</li>
            <li><strong>No full caps transforms:</strong> Avoid uppercase transforms on word strings.</li>
            <li><strong>No exclamation marks:</strong> Product voice remains calm (&quot;A match.&quot;).</li>
            <li><strong>Single display role:</strong> Only one hero display title per screen; section heads use subtitle role.</li>
          </ul>
        </section>

        {/* Section 2: Color Tokens */}
        <section style={{ marginBottom: "48px", borderBottom: "1px dashed var(--rule)", paddingBottom: "32px" }}>
          <h3 className="heading" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Color Tokens</h3>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { name: "--signal", value: "#ff4d56" },
              { name: "--paper", value: "#ffffff" },
              { name: "--ink", value: "#000000" },
              { name: "--mute", value: "#767676" },
              { name: "--signal-ghost", value: "rgba(255, 77, 86, 0.14)" },
              { name: "--ink-subtle", value: "rgba(0, 0, 0, 0.05)" },
            ].map((token) => (
              <div key={token.name} style={{ width: "160px", padding: "12px", border: "1px solid var(--rule)", borderRadius: "6px" }}>
                <div style={{ height: "40px", background: token.value, borderRadius: "4px", marginBottom: "8px", border: "1px solid var(--rule)" }} />
                <code style={{ fontSize: "0.8rem", display: "block" }}>{token.name}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Interactive Components */}
        <section style={{ marginBottom: "48px", borderBottom: "1px dashed var(--rule)", paddingBottom: "32px" }}>
          <h3 className="heading" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Buttons & Controls</h3>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Action</Button>
          </div>

          <h4 style={{ marginBottom: "8px" }}>Minimal Dots Progress Indicator</h4>
          <DotsIndicator total={5} active={activeDot} onSelect={setActiveDot} />
        </section>

        {/* Section 4: Composite Card Components */}
        <section style={{ marginBottom: "48px" }}>
          <h3 className="heading" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Composite Cards</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
            <div>
              <h4 style={{ marginBottom: "12px" }}>Polaroid Component</h4>
              <Polaroid
                src="/about/polaroid-1.jpg"
                alt="UW PM exec team"
                caption="UW PM execs at ProdCon 2022."
                tilt="slight"
              />
            </div>
            <div>
              <h4 style={{ marginBottom: "12px" }}>Winner Card Component</h4>
              <WinnerCard project={sampleWinner} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
