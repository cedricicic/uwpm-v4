import Frame, { lines } from "./Frame";
import Spark from "./Spark";

const pillars = [
  {
    name: "Educate",
    copy: "Providing resources and training of product management skills.",
  },
  {
    name: "Exposure",
    copy: "Access to open opportunities in Canada and the US.",
  },
  {
    name: "Network",
    copy: "Connecting students and alumni in the industry.",
  },
];

export default function About() {
  return (
    <section className="section" id="about">
      <Frame at={lines(2)} />
      <Spark />
      <div className="container">
        <div className="section__head inset">
          <h2 className="heading" data-reveal>
            What we do
          </h2>
        </div>

        <div className="row" data-reveal-group>
          {pillars.map((p) => (
            <article className="pillar" key={p.name}>
              <h3 className="pillar__name">{p.name}</h3>
              <p className="body">{p.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
