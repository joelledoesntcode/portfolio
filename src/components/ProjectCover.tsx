import { useState } from "react";
import { asset } from "../lib/asset";
import { usePhone } from "../lib/usePhone";

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

export function getNextMiscGallery(openId: string): string {
  const items = TRIPTYCHS.flat();
  const index = items.findIndex((item) => item.id === openId);
  return items[(index + 1) % items.length].id;
}

type Props = {
  openId: string | null;
  onOpenGallery: (id: string) => void;
};

export default function ProjectCover({ openId, onOpenGallery }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  // On phones both the thumbnail row and the gallery grid stack into a single
  // vertical column — five across is unreadable at that width.
  const phone = usePhone();

  const allItems = TRIPTYCHS.flat();
  const openItem = allItems.find((it) => it.id === openId) || null;

  // --- full page for a single clicked item ---
  if (openItem) {
    const images = openItem.images ?? [{ src: openItem.thumb, caption: "" }];
    return (
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          // top padding clears the fixed close button
          padding: phone ? "52px 20px 10vh" : "52px 6vw 12vh",
        }}
      >
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
              gridTemplateColumns: phone ? "1fr" : "repeat(5, 1fr)",
              gap: phone ? "2px" : "2vw",
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: phone ? "2px" : "4vh",
            }}
          >
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
        padding: phone ? "2vh 20px 10vh" : "4vh 16vw 12vh",
        display: "flex",
        flexDirection: "column",
        gap: phone ? "28px" : "7vw",
      }}
    >
      <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: 0 }}>
        miscellaneous
      </h1>
      {TRIPTYCHS.map((row, r) => (
        <div
          key={r}
          style={
            phone
              ? // 2 x 2 on phones
                {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  alignItems: "start",
                  width: "100%",
                }
              : { display: "flex", flexDirection: "row", gap: "7vw", width: "100%" }
          }
        >
          {row.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onOpenGallery(item.id)}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId((h) => (h === item.id ? null : h))}
              style={{
                position: "relative",
                flex: 1,
                // Keep thumbnails level when neighboring captions wrap differently.
                alignSelf: phone ? "start" : "flex-start",
                width: phone ? "100%" : undefined,
                border: "none",
                padding: 0,
                background: "transparent",
                color: "#333",
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
              {item.title && (phone || hoverId === item.id) && (
                <span
                  style={{
                    position: phone ? "static" : "absolute",
                    display: phone ? "block" : undefined,
                    marginTop: phone ? "6px" : undefined,
                    right: 0,
                    bottom: phone ? undefined : "-2.4em",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "#333",
                    // on phones the captions alternate sides down the column
                    textAlign: phone && i % 2 === 0 ? "left" : "right",
                    whiteSpace: phone ? "normal" : "nowrap",
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
