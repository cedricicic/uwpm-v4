import Frame, { lines } from "./Frame";
import Spark from "./Spark";

// TODO: replace with the real company list before launch.
const companies = [
  "Google",
  "Shopify",
  "Microsoft",
  "Amazon",
  "Wealthsimple",
  "Faire",
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
            <div key={c}>{c}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
