import React from "react";
import { asset } from "../lib/asset";

type Props = { images: { src: string; caption: string }[] };

// Scattered collage layout: images of varying sizes placed at irregular
// positions across the canvas, with plenty of whitespace.
const SCATTER: { top: string; left: string; width: string }[] = [
  { top: "3%", left: "6%", width: "16%" },
  { top: "8%", left: "68%", width: "13%" },
  { top: "18%", left: "30%", width: "22%" },
  { top: "26%", left: "82%", width: "11%" },
  { top: "34%", left: "10%", width: "18%" },
  { top: "40%", left: "55%", width: "24%" },
  { top: "52%", left: "33%", width: "14%" },
  { top: "58%", left: "74%", width: "17%" },
  { top: "64%", left: "8%", width: "20%" },
  { top: "74%", left: "48%", width: "21%" },
  { top: "82%", left: "20%", width: "15%" },
  { top: "88%", left: "70%", width: "16%" },
];

export default function ProjectCover({ images }: Props) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        // tall enough to scatter the images with whitespace; grows with count
        height: `${Math.max(120, Math.ceil(images.length / 2) * 45)}vh`,
        boxSizing: "border-box",
      }}
    >
      {images.map((item, i) => {
        const p = SCATTER[i % SCATTER.length];
        return (
          <img
            key={i}
            src={asset(item.src)}
            alt=""
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              width: p.width,
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        );
      })}
    </div>
  );
}
