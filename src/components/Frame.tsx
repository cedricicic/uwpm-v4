/** The site has one grid: six columns across the container. */
export const COLUMNS = 6;

/**
 * The line indices you get by dividing the six-column field evenly.
 * `lines(2)` is a three-column section, `lines(3)` a two-column one —
 * both land on lines the six-column field already has.
 */
export const lines = (step: number) =>
  Array.from({ length: COLUMNS / step + 1 }, (_, i) => i * step);

/** The lines in `all` that `drawn` is not already carrying. */
export const without = (all: number[], drawn: number[]) =>
  all.filter((i) => !drawn.includes(i));

/**
 * Column lines for a single section. A section names the lines it wants
 * by index on the master field rather than asking for its own division,
 * so a section can show fewer lines without ever drawing one that the
 * sections above and below it disagree with.
 */
export default function Frame({ at }: { at: number[] }) {
  return (
    <div className="frame" aria-hidden="true">
      {at.map((i) => (
        <span key={i} style={{ left: `${(i * 100) / COLUMNS}%` }} />
      ))}
    </div>
  );
}
