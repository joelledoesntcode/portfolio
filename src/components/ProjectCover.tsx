import React, { useState } from "react";
import { asset } from "../lib/asset";

// A single item inside a triptych — a miscellaneous project or a photo series.
// `thumb` is the rectangle image shown in the row; `images` is the full set
// shown on that item's own page when the rectangle is clicked.
type Item = {
  id: string;
  title: string;
  thumb: string;
  images?: { src: string; caption: string }[];
  // when set, the item's page shows this folder of photos in rows of 5
  gallery?: string[];
};

// public/ghana holds 1.png..41.png (no 5.png) — the full field-trip photo set.
const GHANA = Array.from({ length: 41 }, (_, i) => i + 1)
  .filter((n) => n !== 5)
  .map((n) => `/ghana/${n}.png`);

// public/morocco holds 1.png..30.png plus cover.png — gallery excludes cover.
const MOROCCO = Array.from({ length: 30 }, (_, i) => `/morocco/${i + 1}.png`);

// public/bamboo photo set.
const BAMBOO = [
  "/bamboo/bamboo1.png",
  "/bamboo/bamboo2.png",
  "/bamboo/bamboo3.png",
  "/bamboo/bam4.png",
  "/bamboo/bam5.png",
  "/bamboo/bam6.png",
];

// public/stone photo set (mixed filenames, listed explicitly).
const STONE = [
  "/stone/1.png",
  "/stone/2.png",
  "/stone/3.png",
  "/stone/efff.png",
  "/stone/egsdvegewge.png",
  "/stone/ehheaehhererhea.png",
  "/stone/eqfqwfqfqwffqfq.png",
  "/stone/fwewew.png",
  "/stone/sgreszhawhw.png",
];

// The misc page is built from triptychs: rows of three rectangles.
const TRIPTYCHS: Item[][] = [
  [
    {
      id: "bamboobw",
      title: "building with bamboo",
      thumb: "/bamboobw.png",
      gallery: BAMBOO,
    },
    {
      id: "1bw",
      title: "drawing between paper and stone",
      thumb: "/1bw.png",
      gallery: STONE,
    },
    {
      id: "ghanaicon",
      title: "ghana diploma 5 field trip",
      thumb: "/ghanaicon.png",
      gallery: GHANA,
    },
    {
      id: "morocco",
      title: "morocco, 2026",
      thumb: "/morocco/cover.png",
      gallery: MOROCCO,
    },
  ],
];

// Props kept optional so the existing call site (which passes `images`) still
// works — the misc page now sources its content from TRIPTYCHS above.
type Props = { images?: { src: string; caption: string }[] };

export default function ProjectCover(_props: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const allItems = TRIPTYCHS.flat();
  const openItem = allItems.find((it) => it.id === openId) || null;

  // --- full page for a single clicked item ---
  if (openItem) {
    const images = openItem.images ?? [{ src: openItem.thumb, caption: "" }];
    return (
      <div style={{ width: "100%", boxSizing: "border-box", padding: "0 6vw 12vh" }}>
        <button
          onClick={() => setOpenId(null)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "crosshair",
            fontSize: "0.85rem",
            fontWeight: 300,
            padding: "1vh 0 3vh",
          }}
        >
          ← back
        </button>
        {openItem.title && (
          <h2 style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 3vh" }}>
            {openItem.title}
          </h2>
        )}
        {openItem.gallery ? (
          // rows of 5, like the misc page — images at natural aspect ratio
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "2vw",
              alignItems: "start",
            }}
          >
            {openItem.gallery.map((src, i) => (
              <img
                key={i}
                src={asset(src)}
                alt=""
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4vh" }}>
            {images.map((img, i) => (
              <img
                key={i}
                src={asset(img.src)}
                alt=""
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- triptych grid ---
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "4vh 16vw 12vh",
        display: "flex",
        flexDirection: "column",
        gap: "7vw",
      }}
    >
      {TRIPTYCHS.map((row, r) => (
        <div key={r} style={{ display: "flex", gap: "7vw", width: "100%" }}>
          {row.map((item) => (
            <button
              key={item.id}
              onClick={() => setOpenId(item.id)}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId((h) => (h === item.id ? null : h))}
              style={{
                position: "relative",
                flex: 1,
                alignSelf: "flex-start",
                border: "none",
                padding: 0,
                background: "transparent",
                cursor: "crosshair",
              }}
            >
              <img
                src={asset(item.thumb)}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
              {item.title && hoverId === item.id && (
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: "-2.4em",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "#333",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  {item.title}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
