import CollageCanvas, {
  Block,
  ImageCells,
  type CollageImage,
  textColumn,
  type BlockSpec,
} from "./CollageCanvas";
import { META_TEXT } from "../lib/theme";

type Props = {
  title: string;
  description: string;
  images: CollageImage[];
};

// Disjoint cells spread across a two-viewport (200vh) canvas, with plenty of
// whitespace. top/height are % of the 200vh canvas (50% = one viewport);
// left/width are % of page width. Each image fills its own cell, cells never
// overlap, and every cell is a DIFFERENT size on purpose (no two images render
// the same size). The cells are ordered to match the images array. For now every
// image is roughly hero-scale (all cells large, ~40-48 wide / ~12-18 tall), each
// a slightly different size so no two match — the user will say later which ones
// should shrink. The gif (index 0) is at the very top; siteplanberg2 + vern3
// (indices 1/2) stay an adjacent pair. Images are staggered so NO two line up on
// any edge: every top, every bottom, every left and every right is a distinct
// value (so no vertical or horizontal alignment). Cells are grouped into y-bands
// with gaps so nothing overlaps. The top-left is clear for the title.
// top/height are in vh (vertical units, decoupled from the canvas height);
// left/width are % of page width. The canvas height is computed below so that
// the bottom margin (below the lowest image) always equals the top margin
// (above the topmost image) — this holds automatically whenever any image's
// vertical position/size changes.
const CELLS: { top: number; left: number; width: number; height: number }[] = [
  { top: 11.22, left: 33, width: 74.88, height: 46.79 }, // undergif
  { top: 40.03, left: -7, width: 57.2, height: 33.80 }, // siteplanberg2
  { top: 82.78, left: 25, width: 46, height: 27.01 }, // vern3
  { top: 121.98, left: 13, width: 73.1, height: 52.71 }, // harberg
  { top: 63.60, left: 44, width: 94, height: 64.00 }, // bergsketch
  { top: 85.98, left: -37, width: 97.01, height: 59.17 }, // model
  { top: 186.75, left: -22, width: 83.16, height: 67.33 }, // axo berg
  { top: 279.09, left: 61, width: 45, height: 33.00 }, // filletberg
  { top: 232.67, left: 44, width: 44.22, height: 39.79 }, // back berg
];

// Canvas height = lowest image bottom + top margin, so bottom margin == top margin.
const TOP_MARGIN = Math.min(...CELLS.map((c) => c.top));
const MAX_BOTTOM = Math.max(...CELLS.map((c) => c.top + c.height));
const CANVAS_VH = MAX_BOTTOM + TOP_MARGIN;

// Text columns. `top` is in vh to match the image cells (the title sits at the
// very top); left/width are % of the page width.
const TITLE: BlockSpec = { top: 0, left: 0, width: 19.5 };
const CAPTION_SMOKEHOUSE: BlockSpec = { top: 108, left: 58, width: 19.5 };
const CAPTION_MARKET: BlockSpec = { top: 215, left: 33, width: 19.5 };

const body: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 300,
  textAlign: "justify",
  margin: 0,
};

export default function ProjectFishMarket({ title, description, images }: Props) {
  return (
    <CollageCanvas heightVh={CANVAS_VH} cells={CELLS} images={images}>
      {(phone) => (
        <>
          {/* Title + description, top-left of the first viewport */}
          <Block
            phone={phone}
            spec={TITLE}
            style={{ ...textColumn(phone), marginTop: phone ? 0 : "40px" }}
          >
            <h1
              style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 6px 0" }}
            >
              {title}
            </h1>
            <p style={{ ...META_TEXT, margin: "0 0 10px 0" }}>
              Bergen, Norway
              <br />
              Undergraduate Project Year 3
            </p>
            <p style={body}>{description}</p>
          </Block>

          {/* Caption paragraph below the undergif.gif — same column width/font as
              the subtext above. Adjust top/left to reposition. */}
          <Block phone={phone} spec={CAPTION_SMOKEHOUSE} style={textColumn(phone)}>
            <p style={body}>
              Studying Scandinavia's iconic smokehouses inspired a merging of the
              traditional roof and tower-like smokestack, their abstracted forms
              giving rise to a deconstructive architecture rooted in tradition.
            </p>
          </Block>

          {/* Caption paragraph beside axo berg.jpg — same column width/font as
              the subtext. Adjust top/left to reposition. */}
          <Block phone={phone} spec={CAPTION_MARKET} style={textColumn(phone)}>
            <p style={body}>
              The market invites sensory engagement, its openness carrying aromas
              through the air and fish displayed like works of art. Tradition here
              is not only seen, but experienced.
            </p>
          </Block>

          {/* Image cells, placed against the page inset by the 40px gutters. */}
          <ImageCells phone={phone} cells={CELLS} images={images} />
        </>
      )}
    </CollageCanvas>
  );
}
