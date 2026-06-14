import React from "react";
import { asset } from "../lib/asset";

type Props = {
  title: string;
  description: string;
  images: { src: string; caption: string; hero?: boolean; scale?: number }[];
};

// Disjoint cells spread across a tall canvas with plenty of whitespace, matching
// the Fish Market / Pilgrim layout. top/height are in vh; left/width are % of
// page width. Each image fills its own cell, every cell is a DIFFERENT size on
// purpose, and the cells are staggered so no two line up on any edge. Cells are
// ordered to match the images array; the top-left is kept clear for the title.
// The canvas height is computed below so the bottom margin (below the lowest
// image) equals the top margin (above the topmost image).
const CELLS: { top: number; left: number; width: number; height: number }[] = [
  { top: 63, left: -6, width: 58, height: 36 }, // omah1.gif
  { top: 21, left: 40, width: 65, height: 40 }, // omah3.gif
  { top: 93, left: 36, width: 34, height: 22 }, // omah_weave1
  { top: 109, left: 64, width: 34, height: 22 }, // omah_weave2 (beside weave1)
  { top: 112, left: 9, width: 20, height: 13 }, // omah_ver1
  { top: 144, left: 18, width: 20, height: 13 }, // omah_ver2 (under ver1)
  { top: 154, left: 30, width: 80, height: 52 }, // omah_plan
  { top: 218, left: -10, width: 72, height: 48 }, // diaomah
];

// Canvas height = lowest image bottom + top margin, so bottom margin == top margin.
const TOP_MARGIN = Math.min(...CELLS.map((c) => c.top));
const MAX_BOTTOM = Math.max(...CELLS.map((c) => c.top + c.height));
const CANVAS_VH = MAX_BOTTOM + TOP_MARGIN;

export default function ProjectOmah({ title, description, images }: Props) {
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
        <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 8px 0" }}>
          {title}
        </h1>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: "0 0 4px 0" }}>
          “House of Dreams”: A Beacon of Cultural Education
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: "0 0 2px 0" }}>
          Rembitan Village, Lombok, Indonesia
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: "0 0 24px 0" }}>
          Self-initiated project for Titian Foundation (2024)
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, fontStyle: "italic", margin: "0 0 4px 0" }}>
          ‘The Actions Of Others Affect The Way I Act, And My Actions Affect The Decisions Of Others’
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: "0 0 16px 0" }}>
          - Salen, K., Walz, s. P., &amp; Deterding, s. (Eds.). (2014). The Gameful World: Approaches, Issues, Applications. MIT press.
        </p>
      </div>

      {/* "In Rembitan..." split out of the title block, moved 10 right and 5
          down from its original column position. */}
      <div
        style={{
          position: "absolute",
          top: "40vh",
          left: "15%",
          width: "19.5%",
          padding: "0 24px 0 40px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}>
          In Rembitan village, women weave ethnic crafts for income but lack financial control, deepening gender inequality. {description}
        </p>
      </div>

      {/* Quote above omah_weave1 (cell top 96vh). */}
      <div
        style={{
          position: "absolute",
          top: "88vh",
          left: "41%",
          width: "22%",
          padding: "0 24px 0 12px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, fontStyle: "italic", margin: "0 0 4px 0" }}>
          ‘‘I work for all our income and my husband takes the money and gambles’’
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
          - Working mother of 2
        </p>
      </div>

      {/* Quote below omah_weave1 (cell bottom 118vh). */}
      <div
        style={{
          position: "absolute",
          top: "120vh",
          left: "54%",
          width: "22%",
          padding: "0 24px 0 12px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, fontStyle: "italic", margin: "0 0 4px 0" }}>
          ‘‘I stopped school to sell stuff and ask tourists for money, so my parents could eat’’
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
          - 8 year old girl
        </p>
      </div>

      {/* Quote under omah_weave2 (cell bottom 131vh). */}
      <div
        style={{
          position: "absolute",
          top: "133vh",
          left: "79%",
          width: "22%",
          padding: "0 24px 0 12px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, fontStyle: "italic", margin: "0 0 4px 0" }}>
          ‘‘Farming isn’t sustainable anymore, I rely 100% on my wife who weaves cloth for tourists’’
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
          - A father / head of family
        </p>
      </div>

      {/* Caption under omah_ver1 (cell bottom 128vh). */}
      <div
        style={{
          position: "absolute",
          top: "130vh",
          left: "6%",
          width: "30%",
          padding: "0 24px 0 12px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
          The Bale Tani is a traditional house
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0, marginLeft: "5vw" }}>
          with a woven bamboo gridshell-like structure.
        </p>
      </div>

      {/* Caption under omah_ver2 (cell bottom 164vh). */}
      <div
        style={{
          position: "absolute",
          top: "164vh",
          left: "15%",
          width: "30%",
          padding: "0 24px 0 12px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}>
          Ideas inspired by vernacular gridshell.
        </p>
      </div>

      {/* Caption below omah_ver2 (cell top 144vh + 20vh height = 164vh). */}
      <div
        style={{
          position: "absolute",
          top: "166vh",
          left: "15%",
          width: "30%",
          padding: "0 24px 0 12px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0, marginLeft: "5vw" }}>
          Ethnographic research, cultural studies,
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0, marginLeft: "10vw" }}>
          and reflections—from during my time in the village
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
