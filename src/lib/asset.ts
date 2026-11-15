// Resolve a path to a file in `public/` against Vite's configured base URL.
//
// On GitHub Pages the site is served from a sub-path (`/portfolio/`), so an
// absolute reference like `/foo.png` would resolve to the domain root and 404.
// Prefixing with import.meta.env.BASE_URL keeps these working both locally
// (base `/`) and when deployed (base `/portfolio/`).
//
// Pictures resolve to their downscaled WebP preview in `public/sm/` (made by
// scripts/make-previews.mjs) so pages load quickly; `fullAsset` gives the
// original, which the image viewer loads when a picture is opened.
const BASE = import.meta.env.BASE_URL;
const IMAGE = /\.(jpe?g|png|gif)$/i;
const PREVIEW = "sm/";

export function fullAsset(path: string): string {
  if (!path) return path;
  return BASE + path.replace(/^\//, "");
}

export function asset(path: string): string {
  if (!path) return path;
  const rel = path.replace(/^\//, "");
  return IMAGE.test(rel) ? BASE + PREVIEW + rel + ".webp" : BASE + rel;
}

/** Maps a preview URL (as the browser resolved it) back to its original. */
export function toFullRes(url: string): string {
  const marker = BASE + PREVIEW;
  const i = url.indexOf(marker);
  if (i === -1 || !url.endsWith(".webp")) return url;
  return url.slice(0, i) + BASE + url.slice(i + marker.length, -".webp".length);
}
