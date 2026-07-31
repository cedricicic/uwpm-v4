import Frame, { lines } from "./Frame";

// TODO: point these at the club's real profile URLs.
const columns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "#home" },
      { label: "What we do", href: "#about" },
      { label: "Past events", href: "#events" },
    ],
  },
  {
    title: "Follow",
    links: [
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "LinkedIn", href: "https://linkedin.com/" },
      { label: "Facebook", href: "https://facebook.com/" },
      { label: "Medium", href: "https://medium.com/" },
    ],
  },
];

const external = (href: string) => href.startsWith("http");

export default function Footer() {
  return (
    <footer className="footer">
      {/* Set wide enough to run off both edges: the mark is the rule
          that closes the page, not a word sitting inside the grid. */}
      <p className="footer__mark" aria-hidden="true">
        UWPM
      </p>

      <div className="container footer__body">
        <Frame at={lines(2)} />

        <div className="footer__row">
          <div className="footer__cell inset">
            <p className="footer__blurb">
              Fostering the creative product management community at the
              University of Waterloo.
            </p>
            <a className="footer__mail" href="mailto:hello@uwpm.ca">
              hello@uwpm.ca
            </a>
          </div>

          {columns.map((c) => (
            <nav className="footer__cell inset" key={c.title} aria-label={c.title}>
              <p className="footer__title utility">{c.title}</p>
              <ul className="footer__links">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={external(l.href) ? "_blank" : undefined}
                      rel={external(l.href) ? "noopener noreferrer" : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer__foot inset utility">
          <p>&copy; UWPM 2026</p>
          <p>University of Waterloo</p>
        </div>
      </div>
    </footer>
  );
}
