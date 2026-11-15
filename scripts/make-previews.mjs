// Generates the downscaled previews the pages load (public/sm/), so the
// full-resolution originals are only fetched when a picture is opened in the
// image viewer.
//
//   public/antecollage.png  ->  public/sm/antecollage.png.webp
//
// The preview keeps the original filename plus ".webp", so src/lib/asset.ts can
// map between the two without a lookup table. GIFs become animated WebPs.
//
// Runs before `dev` and `build`. A manifest of source hashes means only new or
// changed images are processed; pass --force to rebuild everything.
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const OUT = path.join(PUBLIC, "sm");
const MANIFEST = path.join(OUT, "manifest.json");
const MAX = 1800; // longest side, px: sharp on a retina half-page partition
const IMAGE = /\.(jpe?g|png|gif)$/i;
const force = process.argv.includes("--force");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full !== OUT) yield* walk(full);
    } else if (IMAGE.test(entry.name)) yield full;
  }
}

const manifest = !force && existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
const next = {};
let made = 0;

for await (const src of walk(PUBLIC)) {
  const rel = path.relative(PUBLIC, src).split(path.sep).join("/");
  const out = path.join(OUT, rel + ".webp");
  const buf = await readFile(src);
  const hash = createHash("sha1").update(buf).digest("hex");
  next[rel] = hash;
  if (manifest[rel] === hash && existsSync(out)) continue;

  const animated = /\.gif$/i.test(rel);
  await mkdir(path.dirname(out), { recursive: true });
  try {
    await sharp(buf, { animated, limitInputPixels: false })
      .rotate()
      .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(out);
    made++;
    console.log(`preview  ${rel}`);
  } catch (err) {
    delete next[rel];
    console.warn(`preview  FAILED ${rel}: ${err.message}`);
  }
}

// Drop previews whose source image is gone.
for (const rel of Object.keys(manifest)) {
  if (!(rel in next)) await rm(path.join(OUT, rel + ".webp"), { force: true });
}

await writeFile(MANIFEST, JSON.stringify(next, null, 2) + "\n");
console.log(`previews: ${made} generated, ${Object.keys(next).length} total`);
