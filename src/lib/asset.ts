// Resolve a path to a file in `public/` against Vite's configured base URL.
//
// On GitHub Pages the site is served from a sub-path (`/portfolio/`), so an
// absolute reference like `/foo.png` would resolve to the domain root and 404.
// Prefixing with import.meta.env.BASE_URL keeps these working both locally
// (base `/`) and when deployed (base `/portfolio/`).
export function asset(path: string): string {
  if (!path) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
