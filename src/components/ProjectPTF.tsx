import CollageCanvas, {
  Block,
  ImageCells,
  type CollageImage,
  textColumn,
  type BlockSpec,
} from "./CollageCanvas";
import { META_TEXT } from "../lib/theme";
import { usePhone } from "../lib/usePhone";
import { Figure, Page, Pair, Segments, Spread, TitleBlock, line } from "./Segments";

type Props = {
  title: string;
  description: string;
  images: CollageImage[];
};

// Disjoint cells spread across a tall canvas with plenty of whitespace, matching
// the Fish Market / Pilgrim / Omah layout. top/height are in vh; left/width are %
// of page width. Each image fills its own cell, every cell is a DIFFERENT size on
// purpose, and the cells are staggered into non-overlapping vertical bands (all
// within 0-100% horizontally so nothing clips off the viewport). Cells are ordered
// to match the images array; the top-left is kept clear for the title. The canvas
// height is computed below so the bottom margin equals the top margin.
const CELLS: { top: number; left: number; width: number; height: number }[] = [
  { top: 56, left: 4, width: 34, height: 32 }, // bigsiteptf (site map)
  { top: 76, left: 50, width: 20, height: 26 }, // kingsarms (staggered)
  { top: 99, left: 53, width: 18, height: 26 }, // kingsarms2 (staggered)
  { top: 117, left: 64, width: 22, height: 28 }, // kingsarms3 (staggered)
  { top: 109, left: -5, width: 26, height: 36 }, // sketchcompilation2
  { top: 154, left: 48, width: 56, height: 18 }, // diaptf (wide concept diagram)
  { top: 88, left: 59, width: 50, height: 30 }, // ptfmodel
  { top: 136, left: 16, width: 36, height: 30 }, // ptfgf (ground floor plan)
  { top: 238, left: 40, width: 52, height: 32 }, // technical
  { top: 184, left: 8, width: 24, height: 38 }, // Page_13 = "stone diagram" (sustainability)
  { top: 192, left: 60, width: 44, height: 38 }, // highlevel (aerial render)
  { top: 26, left: 32, width: 66, height: 40 }, // exhi (top hero, 2x bigger)
  { top: 274, left: 2, width: 36, height: 24 }, // officenew (office render)
  { top: 274, left: 10, width: 50, height: 32 }, // roofrender (monument)
];

// Canvas height = lowest image bottom + top margin, so bottom margin == top margin.
const TOP_MARGIN = Math.min(...CELLS.map((c) => c.top));
const MAX_BOTTOM = Math.max(...CELLS.map((c) => c.top + c.height));
const CANVAS_VH = MAX_BOTTOM + TOP_MARGIN;

// Text column. `top` is in vh to match the image cells; left/width are % of the
// page width.
const TITLE: BlockSpec = { top: 0, left: 0, width: 19.5 };

// --- desktop: two-partition segments (see Segments.tsx) -----------------------
//
// Same design language as Pilgrim and Røyk: each segment pairs one large
// picture with a staggered pair, the pair switching sides every segment, and
// every caption set 8px under its picture. Pair widths are worked out from the
// images' aspect ratios (noted inline) so the two come out the same height,
// and the second is dropped by about half that height to step diagonally
// (in the mirrored segment the first is dropped instead).
//   1. left: title block, then site plan + King's Arms docked bottom-right.
//      right: exhibition space.
//   2. left: site model.  right: King's Arms fabric pair, docked bottom.
//   3. mirrored. left: sketches + stone diagram.  right: ground floor plan.
//   4. left: construction detail.  right: aerial view + office, docked bottom.
//   5. left: visitor-journey diagram.  right: the monument.
function PTFSegments({
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
    images.find((im) => im.src === name) ?? { src: name, caption: "" };
  // a plain function, not a component defined in render, so React keeps the
  // same <figure> elements across re-renders
  // drawings on white get the thin faded outline so their edges read
  const OUTLINED = new Set(["/technical.jpg", "/ptfgf.png", "/bigsiteptf.png"]);
  const pic = (name: string, width: string, style?: React.CSSProperties) => {
    const im = img(name);
    return (
      <Figure
        src={im.src}
        width={width}
        caption={im.caption}
        style={style}
        outline={OUTLINED.has(name)}
      />
    );
  };
  const dock: React.CSSProperties = { marginTop: "auto" };

  return (
    <Segments>
      <Spread>
        <Page>
          <TitleBlock
            title={title}
            meta={
              <>
                Manchester, UK
                <br />
                Undergraduate Project Year 3
              </>
            }
          >
            <p
              style={{ ...line, textAlign: "justify" }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </TitleBlock>
          {/* docked bottom-right like the Pilgrim culverts. In partition terms:
              site plan (1.13) 40% and King's Arms (0.74) 26.2%, both ~35% tall,
              16% gap = an 82.2% block; King's Arms drops ~18% to step */}
          <div
            style={{ ...dock, paddingTop: "120px", alignSelf: "flex-end", width: "82.2%" }}
          >
            <Pair gap="19.46%">
              {pic("/bigsiteptf.png", "48.66%")}
              {pic("/kingsarms.png", "31.87%", { marginTop: "21.5%" })}
            </Pair>
          </div>
        </Page>
        <Page>
          {pic("/exhi.png", "100%")}
        </Page>
      </Spread>

      <Spread>
        <Page>
          {pic("/ptfmodel.PNG", "100%")}
        </Page>
        <Page>
          {/* both 0.75: 34% wide is ~45% tall; the second drops 22% */}
          <Pair style={dock}>
            {pic("/kingsarms2.png", "34%")}
            {pic("/kingsarms3.png", "34%", { marginTop: "22%" })}
          </Pair>
        </Page>
      </Spread>

      <Spread>
        <Page>
          {/* mirrored: the first is dropped. sketches (0.51) and stone diagram
              (0.53) at 30% are both ~58% tall; the drop is 29% */}
          <Pair>
            {pic("/sketchcompilation2.png", "30%", { marginTop: "29%" })}
            {pic("/joelle_warsono_portfolio_Page_13.jpg", "30%")}
          </Pair>
        </Page>
        <Page>
          {pic("/ptfgf.png", "100%")}
        </Page>
      </Spread>

      <Spread>
        <Page>
          {pic("/technical.jpg", "100%")}
        </Page>
        <Page>
          {/* aerial (1.46) 42.6% and office (1.76) 51.4% are both ~29% tall,
              with a narrower 6% gap to fit; the office drops 15% */}
          <Pair gap="6%" style={dock}>
            {pic("/highlevel.png", "42.6%")}
            {pic("/officenew.png", "51.4%", { marginTop: "15%" })}
          </Pair>
        </Page>
      </Spread>

      <Spread>
        <Page>
          {/* docked to the bottom, level with the monument render's bottom */}
          {pic("/diaptf.jpg", "100%", dock)}
        </Page>
        <Page>
          {pic("/roofrender.png", "100%")}
        </Page>
      </Spread>
    </Segments>
  );
}

export default function ProjectPTF({ title, description, images }: Props) {
  const phone = usePhone();
  if (!phone) {
    return <PTFSegments title={title} description={description} images={images} />;
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
            <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 6px 0" }}>
              {title}
            </h1>
            <p style={{ ...META_TEXT, margin: "0 0 10px 0" }}>
              Manchester, UK
              <br />
              Undergraduate Project Year 3
            </p>
            <p
              style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </Block>

          {/* Image cells, placed against the page inset by the 40px gutters. */}
          <ImageCells phone={phone} cells={CELLS} images={images} />
        </>
      )}
    </CollageCanvas>
  );
}
