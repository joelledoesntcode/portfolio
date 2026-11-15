import CollageCanvas, {
  Block,
  ImageCells,
  type CollageImage,
  textColumn,
  type BlockSpec,
} from "./CollageCanvas";
import { META_TEXT } from "../lib/theme";
import { usePhone } from "../lib/usePhone";
import { Figure, Page, Pair, SEGMENT_GAP, Segments, Spread, TitleBlock } from "./Segments";

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

const SMOKEHOUSE_TEXT =
  "Studying Scandinavia's iconic smokehouses inspired a merging of the traditional roof and tower-like smokestack, their abstracted forms giving rise to a deconstructive architecture rooted in tradition.";
const MARKET_TEXT =
  "The market invites sensory engagement, its openness carrying aromas through the air and fish displayed like works of art.";

// --- desktop: two-partition segments (see Segments.tsx) -----------------------
//
// Same design language as Ode to the Modern Pilgrim:
//   1. left: title block, then the site plan + vernacular study docked
//      bottom-right as a staggered pair.  right: the hero gif, with the
//      smokehouse paragraph under it.
//   2+3, one section whose partitions flow independently:
//      left: harberg, then axo berg (right), then filletberg (left).
//      right: bergsketch + model staggered, then back berg with the market
//      paragraph under it.
function FishMarketSegments({
  title,
  description,
  images,
}: {
  title: string;
  description: string;
  images: CollageImage[];
}) {
  // look images up by file so the layout doesn't depend on array order
  const img = (name: string) =>
    (images.find((im) => im.src === name) ?? { src: name }).src;

  return (
    <Segments>
      <Spread>
        <Page>
          <TitleBlock
            title={title}
            meta={
              <>
                Bergen, Norway
                <br />
                Undergraduate Project Year 3
              </>
            }
          >
            {description.split("\n\n").map((para, i) => (
              <p key={i} style={{ ...body, margin: i > 0 ? "10px 0 0 0" : 0 }}>
                {para}
              </p>
            ))}
          </TitleBlock>
          {/* Docked bottom-right, like the Pilgrim culverts. In partition
              terms siteplan is 45% wide (1.38, so ~33% tall) and vern3 29.4%
              (1.23, ~24% tall), with a 16% gap between: a 90.4% block. vern3
              drops 12% of the partition to step. */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "120px",
              alignSelf: "flex-end",
              width: "90.4%",
            }}
          >
            <Pair gap="17.7%">
              <Figure src={img("/siteplanberg2.jpg")} width="49.78%" outline />
              <Figure
                src={img("/vern3.png")}
                width="32.52%"
                style={{ marginTop: "13.27%" }}
              />
            </Pair>
          </div>
        </Page>
        <Page>
          <Figure src={img("/undergif.gif")} width="100%" />
          <p style={{ ...body, marginTop: "8px" }}>{SMOKEHOUSE_TEXT}</p>
        </Page>
      </Spread>

      {/* segments 2 + 3 share one two-partition section, so each partition
          flows on its own: filletberg follows harberg by the usual segment gap
          instead of waiting for the much taller model column on the right. */}
      <Spread>
        <Page>
          <Figure src={img("/harberg.jpg")} width="100%" />
          {/* axo berg (0.71) at 55%, set to the right, then filletberg at 75%
              under it on the left, so the two step diagonally */}
          <Figure
            src={img("/axo berg.jpg")}
            width="55%"
            outline
            style={{ marginTop: `${SEGMENT_GAP}px`, alignSelf: "flex-end" }}
          />
          <Figure src={img("/filletberg.jpg")} width="75%" style={{ marginTop: "120px" }} />
        </Page>
        <Page>
          {/* bergsketch (0.47) at 20% is ~42.5% tall; model (0.85) runs at
              74% (~87% tall), which needs a narrower 6% gap to fit; it drops
              21% to step */}
          <Pair gap="6%">
            <Figure src={img("/bergsketch.jpg")} width="20%" />
            <Figure src={img("/model.png")} width="74%" style={{ marginTop: "21%" }} />
          </Pair>
          <Figure
            src={img("/back berg.jpg")}
            width="100%"
            style={{ marginTop: `${SEGMENT_GAP}px` }}
          />
          <p style={{ ...body, marginTop: "8px" }}>{MARKET_TEXT}</p>
        </Page>
      </Spread>
    </Segments>
  );
}

export default function ProjectFishMarket({ title, description, images }: Props) {
  const phone = usePhone();
  if (!phone) {
    return <FishMarketSegments title={title} description={description} images={images} />;
  }

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
            {description.split("\n\n").map((para, i) => (
              <p key={i} style={{ ...body, margin: i > 0 ? "10px 0 0 0" : 0 }}>
                {para}
              </p>
            ))}
          </Block>

          {/* Caption paragraph below the undergif.gif — same column width/font as
              the subtext above. Adjust top/left to reposition. */}
          <Block phone={phone} spec={CAPTION_SMOKEHOUSE} style={textColumn(phone)}>
            <p style={body}>{SMOKEHOUSE_TEXT}</p>
          </Block>

          {/* Caption paragraph beside axo berg.jpg — same column width/font as
              the subtext. Adjust top/left to reposition. */}
          <Block phone={phone} spec={CAPTION_MARKET} style={textColumn(phone)}>
            <p style={body}>{MARKET_TEXT}</p>
          </Block>

          {/* Image cells, placed against the page inset by the 40px gutters. */}
          <ImageCells phone={phone} cells={CELLS} images={images} />
        </>
      )}
    </CollageCanvas>
  );
}
