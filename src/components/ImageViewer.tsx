import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { META_TEXT } from "../lib/theme";
import { usePhone } from "../lib/usePhone";
import { toFullRes } from "../lib/asset";

export type ViewerImage = { src: string; preview: string; alt: string; caption: string };

/**
 * Collects every viewable picture inside `root`, in reading order. Pictures
 * that sit inside a button or link already do something on click (the
 * miscellaneous gallery covers), so they are left out.
 */
export function collectImages(root: HTMLElement): HTMLImageElement[] {
  return Array.from(root.querySelectorAll("img")).filter(
    (img) => !img.closest("button, a, [data-no-viewer]"),
  );
}

export function toViewerImage(img: HTMLImageElement): ViewerImage {
  return {
    preview: img.currentSrc || img.src,
    src: toFullRes(img.currentSrc || img.src),
    alt: img.alt,
    caption: img.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ?? "",
  };
}

const control: React.CSSProperties = {
  padding: 0,
  border: "none",
  background: "transparent",
  color: "#fff",
  cursor: "crosshair",
  fontWeight: 300,
  lineHeight: 1,
};

/**
 * Full-screen viewer for project pictures. Click outside the picture, press
 * Escape or ✕ to close; arrows (keys, buttons, or a swipe on phones) step
 * through the other pictures on the page.
 */
export default function ImageViewer({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: ViewerImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const phone = usePhone();
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const step = (d: number) => onIndex((index + d + count) % count);

  useEffect(() => {
    // Capture phase on window runs before the app's own Escape handler, so
    // Escape closes only the viewer rather than the whole project page.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  // Show the preview (already loaded on the page) at once, and swap in the
  // full-resolution original once it has downloaded.
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const current = images[index];
  useEffect(() => {
    if (!current || ready[current.src]) return;
    const full = new Image();
    full.onload = () => setReady((r) => ({ ...r, [current.src]: true }));
    full.src = current.src;
    return () => {
      full.onload = null;
    };
  }, [current, ready]);

  if (!current) return null;
  const full = !!ready[current.src];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        // translucent dark scrim: the page stays faintly visible behind it
        backgroundColor: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: phone ? "56px 20px" : "64px 96px",
        boxSizing: "border-box",
        cursor: "zoom-out",
        textTransform: "lowercase",
        animation: "viewer-in 180ms ease-out",
      }}
    >
      <style>{`@keyframes viewer-in { from { opacity: 0 } to { opacity: 1 } }`}</style>

      <figure
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <img
          key={current.src}
          src={full ? current.src : current.preview}
          alt={current.alt}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: `calc(100vh - ${phone ? 112 : 128}px - ${current.caption ? 24 : 0}px)`,
            width: "auto",
            height: "auto",
            objectFit: "contain",
            // transparent PNGs/GIFs would otherwise sit on the dark scrim
            backgroundColor: "#fff",
            cursor: "default",
            animation: "viewer-in 180ms ease-out",
          }}
        />
        {current.caption && (
          <figcaption
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: "0.7rem", fontWeight: 300, marginTop: "8px", cursor: "default" }}
          >
            {current.caption}
          </figcaption>
        )}
      </figure>

      <button
        aria-label="Close"
        onClick={onClose}
        style={{ ...control, position: "fixed", top: "20px", right: phone ? "20px" : "30px", fontSize: "1.2rem" }}
      >
        ✕
      </button>

      {count > 1 && (
        <>
          <span
            style={{ ...META_TEXT, color: "rgba(255, 255, 255, 0.6)", position: "fixed", top: "24px", left: phone ? "20px" : "30px" }}
          >
            {index + 1} / {count}
          </span>
          {!phone && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                style={{ ...control, position: "fixed", left: "30px", top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem" }}
              >
                <span style={{ textDecoration: "underline" }}>←</span>
              </button>
              <button
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                style={{ ...control, position: "fixed", right: "30px", top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem" }}
              >
                <span style={{ textDecoration: "underline" }}>→</span>
              </button>
            </>
          )}
        </>
      )}
    </div>,
    document.body,
  );
}
