import { asset } from "../lib/asset";
import { META_TEXT } from "../lib/theme";

// --- desktop: two-partition segments ------------------------------------------
//
// The desktop design language shared by the collage projects (Ode to the
// Modern Pilgrim, Røyk): the page is a stack of horizontal segments, each
// always split into a left and a right partition with a wide centre margin.
// Pictures are shown whole (never cropped) at their natural aspect ratio, with
// captions or short paragraphs set 8px under them, left-aligned. Pairs of
// pictures sit side by side with a wide gap and one of the two dropped, so the
// pair steps diagonally. Phones keep each project's single-column reflow
// (CollageCanvas).

const SEGMENTS_MAX = 1707; // same design width as the collage pages

/** Body / caption text, matching the rest of the site. */
export const line: React.CSSProperties = { fontSize: "0.7rem", fontWeight: 300, margin: 0 };

/** Vertical whitespace between segments, in px. */
export const SEGMENT_GAP = 160;

/** Default gap between the two pictures of a pair, as a share of the partition. */
export const PAIR_GAP = "16%";

/** The column of segments, with generous whitespace between them. */
export function Segments({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: `${SEGMENTS_MAX}px`,
        margin: "0 auto",
        padding: "40px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: `${SEGMENT_GAP}px`,
        textTransform: "lowercase",
      }}
    >
      {children}
    </div>
  );
}

/** A picture at its natural aspect ratio, with an optional caption under it. */
export function Figure({
  src,
  width,
  caption,
  align = "left",
  outline = false,
  style,
}: {
  src: string;
  /** width as a share of the partition it sits in */
  width: string;
  caption?: React.ReactNode;
  align?: "left" | "right";
  /** a thin, faded outline around the picture's border */
  outline?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <figure style={{ margin: 0, width, ...style }}>
      <img
        src={asset(src)}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          // a 1px faded line just outside the edge (a box-shadow, so it adds
          // no size and nothing shifts)
          boxShadow: outline ? "0 0 0 1px rgba(0, 0, 0, 0.12)" : undefined,
        }}
      />
      {caption && (
        <figcaption style={{ ...line, marginTop: "8px", textAlign: align }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** One partition of a segment: a column whose last child can dock to the bottom. */
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", minWidth: 0 }}>
      {children}
    </div>
  );
}

/** One horizontal segment: always split into a left and a right partition. */
export function Spread({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "10%",
        alignItems: "stretch",
      }}
    >
      {children}
    </section>
  );
}

/** Two pictures side by side; drop one with a % marginTop to stagger them. */
export function Pair({
  children,
  gap = PAIR_GAP,
  style,
}: {
  children: React.ReactNode;
  gap?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap, ...style }}>{children}</div>
  );
}

/** The title column every project opens with: title, meta lines, description. */
export function TitleBlock({
  title,
  meta,
  children,
}: {
  title: string;
  meta: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: "72%" }}>
      <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 6px 0" }}>{title}</h1>
      <p style={{ ...line, ...META_TEXT, margin: "0 0 10px 0" }}>
        {meta}
      </p>
      {children}
    </div>
  );
}

/**
 * Three pictures in a row stepping diagonally: each one dropped `step` further
 * than the last (a % of the row's width, so the step scales with it).
 */
export function Trio({
  srcs,
  width,
  gap,
  step,
  justify = "flex-start",
  style,
}: {
  srcs: [string, string, string];
  /** each picture's width, as a share of the row */
  width: string;
  gap: string;
  step: number;
  justify?: "flex-start" | "flex-end" | "center";
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", justifyContent: justify, gap, ...style }}
    >
      {srcs.map((src, i) => (
        <Figure key={src} src={src} width={width} style={{ marginTop: `${step * i}%` }} />
      ))}
    </div>
  );
}
