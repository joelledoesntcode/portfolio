import React from "react";

type Props = {
  title: string;
  description: string;
  images: { src: string; caption: string; hero?: boolean; scale?: number }[];
};

// Disjoint cells spread across a tall canvas with plenty of whitespace, matching
// the Fish Market / Pilgrim / Omah layout. top/height are in vh; left/width are %
// of page width. Each image fills its own cell, every cell is a DIFFERENT size on
// purpose, and the cells are staggered into non-overlapping vertical bands (all
// within 0-100% horizontally so nothing clips off the viewport). Cells are ordered
// to match the images array; the top-left is kept clear for the title. The canvas
// height is computed below so the bottom margin equals the top margin.
const CELLS: { top: number; left: number; width: number; height: number }[] = [
  { top: 56, left: 4, width: 34, height: 32 }, // bigsiteptf (site map)
  { top: 76, left: 50, width: 20, height: 26 }, // kingsarms (staggered)
  { top: 99, left: 53, width: 18, height: 26 }, // kingsarms2 (staggered)
  { top: 117, left: 64, width: 22, height: 28 }, // kingsarms3 (staggered)
  { top: 109, left: -5, width: 26, height: 36 }, // sketchcompilation2
  { top: 154, left: 48, width: 56, height: 18 }, // diaptf (wide concept diagram)
  { top: 88, left: 59, width: 50, height: 30 }, // ptfmodel
  { top: 136, left: 16, width: 36, height: 30 }, // ptfgf (ground floor plan)
  { top: 238, left: 40, width: 52, height: 32 }, // technical
  { top: 184, left: 8, width: 24, height: 38 }, // Page_13 = "stone diagram" (sustainability)
  { top: 192, left: 60, width: 44, height: 38 }, // highlevel (aerial render)
  { top: 26, left: 32, width: 66, height: 40 }, // exhi (top hero, 2x bigger)
  { top: 274, left: 2, width: 36, height: 24 }, // officenew (office render)
  { top: 274, left: 10, width: 50, height: 32 }, // roofrender (monument)
];

// Canvas height = lowest image bottom + top margin, so bottom margin == top margin.
const TOP_MARGIN = Math.min(...CELLS.map((c) => c.top));
const MAX_BOTTOM = Math.max(...CELLS.map((c) => c.top + c.height));
const CANVAS_VH = MAX_BOTTOM + TOP_MARGIN;

export default function ProjectPTF({ title, description, images }: Props) {
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
          Manchester, UK
          <br />
          Undergraduate Project Year 3
        </p>
        <p
          style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
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
                src={item.src}
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
