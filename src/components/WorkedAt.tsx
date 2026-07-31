import Image from "next/image";

import Frame, { lines } from "./Frame";
import Spark from "./Spark";

// Each logo carries its own optical height — the marks are drawn at wildly
// different aspect ratios, so a single height would make Autodesk tower over
// Apple. `scale` is a multiplier on --logo-unit, tuned per wordmark.
const companies = [
  { name: "Salesforce", file: "salesforce.png", w: 1280, h: 896, scale: 2 },
  { name: "Meta", file: "meta.png", w: 2560, h: 1440, scale: 2 },
  { name: "Microsoft", file: "microsoft.png", w: 2008, h: 900, scale: 2.33 },
  { name: "Apple", file: "apple.png", w: 669, h: 669, scale: 1.67 },
  { name: "Riot Games", file: "riotgames.png", w: 3000, h: 2000, scale: 2.67 },
  { name: "IBM", file: "ibm.png", w: 800, h: 600, scale: 2.33 },
  { name: "Lyft", file: "lyft.png", w: 3000, h: 2000, scale: 1.33 },
  { name: "Wish", file: "wish.png", w: 2560, h: 870, scale: 1 },
  { name: "Datadog", file: "datadog.png", w: 2500, h: 635, scale: 1 },
  {
    name: "American Express",
    file: "american-express.png",
    w: 3840,
    h: 2160,
    scale: 1.67,
  },
  { name: "Shopify", file: "shopify.png", w: 700, h: 180, scale: 1 },
  { name: "Autodesk", file: "autodesk.png", w: 2560, h: 433, scale: 1 },
];

export default function WorkedAt() {
  return (
    <section className="section">
      <Frame at={lines(1)} />
      <Spark />
      <div className="container">
        <div className="section__head inset">
          <h2 className="heading" data-reveal>
            Our community has worked at
          </h2>
        </div>

        <div className="logos" data-reveal-group>
          {companies.map((c) => (
            <div key={c.name}>
              <Image
                src={`/logos/${c.file}`}
                alt={c.name}
                width={c.w}
                height={c.h}
                style={{ "--logo-scale": c.scale } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
