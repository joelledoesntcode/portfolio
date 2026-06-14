import React from "react";
import { asset } from "../lib/asset";

type Props = {
  title: string;
  description: string;
  images: { src: string; caption: string; hero?: boolean; scale?: number }[];
};

// Disjoint cells spread across a tall canvas with plenty of whitespace, matching
// the Fish Market layout. top/height are in vh (vertical units, decoupled from
// the canvas height); left/width are % of page width. Each image fills its own
// cell, every cell is a DIFFERENT size on purpose (no two images render the same
// size), and the cells are staggered so no two line up on any edge. The cells are
// ordered to match the images array. The top-left is kept clear for the title.
// The canvas height is computed below so the bottom margin (below the lowest
// image) matches the Fish Market page's margin gap (see BOTTOM_MARGIN).
const CELLS: { top: number; left: number; width: number; height: number }[] = [
  { top: 26, left: 42, width: 48, height: 28 }, // antecollage (main)
  { top: 26, left: -10, width: 40, height: 24 }, // culv1
  { top: 43, left: -18, width: 80, height: 52 }, // culv2
  { top: 92, left: -9, width: 74, height: 50 }, // mainante (main)
  { top: 107, left: 61, width: 22, height: 24 }, // 1.PNG (pair with 2)
  { top: 112, left: 74, width: 22, height: 24 }, // 2.PNG (pair with 1)
  { top: 138, left: 67, width: 22, height: 24 }, // 3.PNG (aligned under 1.PNG)
  { top: 143, left: 80, width: 22, height: 24 }, // 4.PNG (aligned under 2.PNG)
  { top: 167, left: 20, width: 60, height: 40 }, // backrrender (below all)
];

// Canvas height = lowest image bottom + bottom margin. The bottom margin matches
// the Fish Market page's gap (its smallest cell top, undergif at 11.22vh) rather
// than this page's own top margin.
const BOTTOM_MARGIN = 11.22;
const MAX_BOTTOM = Math.max(...CELLS.map((c) => c.top + c.height));
const CANVAS_VH = MAX_BOTTOM + BOTTOM_MARGIN;

export default function ProjectPilgrim({ title, description, images }: Props) {
  // Split the description so everything from "The Earthwork theme" onward renders
  // as its own block, pushed down from the intro paragraphs above it.
  const EARTHWORK_MARKER = "The Earthwork theme";
  const markerIdx = description.indexOf(EARTHWORK_MARKER);
  const introText = markerIdx >= 0 ? description.slice(0, markerIdx) : description;
  const earthworkText = markerIdx >= 0 ? description.slice(markerIdx) : "";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: `${CANVAS_VH}vh`,
        boxSizing: "border-box",
        textTransform: "lowercase",
      }}
    >
      {/* Title + description, top-left of the first viewport */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: 0,
          width: "19.5%",
          padding: "0 24px 0 40px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 6px 0" }}>
          {title}
        </h1>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: "0 0 10px 0" }}>
          Ruins, Revival, Legacy
          <br />
          London, UK
          <br />
          Antepavilion competition entry (2024)
        </p>
        <p
          style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}
          dangerouslySetInnerHTML={{ __html: introText }}
        />
      </div>

      {/* "The Earthwork theme..." onward — split out of the intro column so it can
          be positioned independently. */}
      {earthworkText && (
        <div
          style={{
            position: "absolute",
            top: "78vh",
            left: "40%",
            width: "19.5%",
            padding: "0 24px 0 40px",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}
            dangerouslySetInnerHTML={{ __html: earthworkText }}
          />
        </div>
      )}

      {/* Caption text under mainante.png — its cell bottoms out at top 92vh +
          50vh = 142vh. */}
      <div
        style={{
          position: "absolute",
          top: "154vh",
          left: "10%",
          width: "19.5%",
          padding: "0 24px 0 40px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
          Tower: pays homage to historic Roman trusses.
          <br />
          Ballasts: embodies unearthing, honours cycles of creation and demolition.
        </p>
      </div>

      {/* Caption text beside 1.PNG — right-aligned so it sits against the
          image's left edge, top aligned with 1.PNG's cell top (116vh). */}
      <div
        style={{
          position: "absolute",
          top: "107vh",
          left: "48%",
          width: "20%",
          padding: "0 24px 0 40px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "right", margin: 0 }}>
          Pull for refuge...
        </p>
      </div>

      {/* Caption text beside 2.PNG — left-aligned, bottom aligned with 2.PNG's
          cell bottom (top 121vh + 24vh height = 145vh). */}
      <div
        style={{
          position: "absolute",
          top: "109vh",
          left: "84%",
          width: "20%",
          height: "24vh",
          padding: "0 24px 0 40px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "left", margin: 0 }}>
          ...Release for repose, shape your own spaces
        </p>
      </div>

      {/* Caption text on the right side of 3.PNG — left-aligned, starting at
          3.PNG's right edge (left 62% + 22% width = 84%), top at 142vh. */}
      <div
        style={{
          position: "absolute",
          top: "138vh",
          left: "70%",
          width: "16%",
          padding: "0 24px 0 12px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "left", margin: 0 }}>
          Leave things behind...
        </p>
      </div>

      {/* Caption text below 4.PNG — aligned under its left edge (75%), just
          below its cell bottom (142vh + 24vh = 166vh). */}
      <div
        style={{
          position: "absolute",
          top: "164vh",
          left: "90%",
          width: "20%",
          padding: "0 24px 0 12px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "left", margin: 0 }}>
          ...For the next pilgrim to find
        </p>
      </div>

      {/* Images span the full viewport width minus a 40px gutter on each side,
          matching the text block's 40px left inset. Cell coordinates are
          relative to this padded area, so left:0 / right:100% sit at the
          gutters. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        {images.map((item, i) => {
          const cell = CELLS[i % CELLS.length];
          // each image fills its own (uniquely sized) cell; `scale` shrinks/grows
          // an individual image further.
          const fill = (item.scale ?? 1) * 100;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${cell.top}vh`,
                left: `${cell.left}%`,
                width: `${cell.width}%`,
                height: `${cell.height}vh`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={asset(item.src)}
                alt={item.caption}
                loading="lazy"
                decoding="async"
                style={{
                  maxWidth: `${fill}%`,
                  maxHeight: `${fill}%`,
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
