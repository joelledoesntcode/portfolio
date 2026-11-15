import CollageCanvas, {
  Block,
  ImageCells,
  type CollageImage,
  textColumn,
  vw,
  type BlockSpec,
} from "./CollageCanvas";
import { META_TEXT } from "../lib/theme";
import { usePhone } from "../lib/usePhone";
import { Figure, Page, Pair, Segments, Spread, TitleBlock } from "./Segments";

type Props = {
  title: string;
  description: string;
  images: CollageImage[];
};
// The canvas height is computed below so the bottom margin (below the lowest
// image) equals the top margin (above the topmost image).
const CELLS: { top: number; left: number; width: number; height: number }[] = [
  { top: 63, left: -6, width: 58, height: 36 }, // omah1.gif
  { top: 21, left: 40, width: 65, height: 40 }, // omah3.gif
  { top: 93, left: 36, width: 34, height: 22 }, // omah_weave1
  { top: 109, left: 64, width: 34, height: 22 }, // omah_weave2 (beside weave1)
  { top: 112, left: 9, width: 20, height: 13 }, // omah_ver1
  { top: 144, left: 18, width: 20, height: 13 }, // omah_ver2 (under ver1)
  { top: 154, left: 30, width: 80, height: 52 }, // omah_plan
  { top: 188, left: -37, width: 72, height: 48 }, // diaomah
];

// Canvas height = lowest image bottom + top margin, so bottom margin == top margin.
const TOP_MARGIN = Math.min(...CELLS.map((c) => c.top));
const MAX_BOTTOM = Math.max(...CELLS.map((c) => c.top + c.height));
const CANVAS_VH = MAX_BOTTOM + TOP_MARGIN;

// Text columns. `top` is in vh to match the image cells; left/width are % of the
// page width. Each is anchored to the image it annotates (noted alongside).
const TITLE: BlockSpec = { top: 0, left: 0, width: 19.5 };
const INTRO: BlockSpec = { top: 40, left: 15, width: 19.5 };
const QUOTE_INCOME: BlockSpec = { top: 88, left: 41, width: 22 }; // above omah_weave1
const QUOTE_SCHOOL: BlockSpec = { top: 120, left: 54, width: 22, phoneOrder: 94 }; // below omah_weave1
const QUOTE_FARMING: BlockSpec = { top: 133, left: 79, width: 22, phoneOrder: 95 }; // under omah_weave2
const CAPTION_BALE: BlockSpec = { top: 130, left: 6, width: 30 }; // under omah_ver1
const CAPTION_GRIDSHELL: BlockSpec = { top: 164, left: 15, width: 30, phoneOrder: 113 }; // under omah_ver2
const CAPTION_RESEARCH: BlockSpec = { top: 166, left: 15, width: 30, phoneOrder: 114 }; // below omah_ver2

// The three gridshell captions. On desktop they sit at three hand-placed spots
// around omah_ver1/2; on phones they read as one run of text, in this order.
const BALE_A = "The Bale Tani is a traditional house";
const BALE_B = "with a woven bamboo gridshell-like structure.";
const RESEARCH_A = "Ethnographic research, cultural studies,";
const RESEARCH_B = "and reflections—from during my time in the village";
const GRIDSHELL = "Ideas inspired by vernacular gridshell.";

const line: React.CSSProperties = { fontSize: "0.7rem", fontWeight: 300, margin: 0 };
const italic: React.CSSProperties = { ...line, fontStyle: "italic", margin: "0 0 4px 0" };

/** The quote/caption columns sit on a narrower inset than the title column. */
const captionColumn = (phone: boolean): React.CSSProperties => ({
  padding: phone ? 0 : "0 24px 0 12px",
  boxSizing: "border-box",
});

// The intro, shared by the desktop and phone layouts.
const INTRO_TEXT = [
  "In Rembitan village, women weave ethnic crafts for income but lack financial control, deepening gender inequality. My proposal envisions a cultural hub to revitalize traditional trade with a sustainable model.",
  "It integrates competition and reward through community building to engage participants, fostering motivation for achievement.",
];

// The three villager quotes, shared by the desktop and phone layouts.
const QUOTES = {
  income: {
    text: "‘‘I work for all our income and my husband takes the money and gambles’’",
    by: "- Working mother of 2",
  },
  school: {
    text: "‘‘I stopped school to sell stuff and ask tourists for money, so my parents could eat’’",
    by: "- 8 year old girl",
  },
  farming: {
    text: "‘‘Farming isn’t sustainable anymore, I rely 100% on my wife who weaves cloth for tourists’’",
    by: "- A father / head of family",
  },
};

function Quote({ q }: { q: { text: string; by: string } }) {
  return (
    <>
      <span style={{ display: "block", fontStyle: "italic", marginBottom: "4px" }}>{q.text}</span>
      <span style={{ display: "block" }}>{q.by}</span>
    </>
  );
}

// --- desktop: two-partition segments (see Segments.tsx) -----------------------
//
// Same design language as Pilgrim, Røyk and Peter Tatchell. Pair widths are
// worked out from the images' aspect ratios (noted inline) so the two come out
// the same height, and one is dropped by about half that height to step.
//   1. left: title block, then the Bale Tani pair (ver1, ver2 dropped) with
//      the gridshell captions, docked to the bottom.  right: omah3.gif.
//   2. left: omah1.gif, the mother's quote under it.  right: the two weaving
//      images, at the top, each with its quote under it.
//   3. left: the five diaomah stages as a bento.  right: the plan.
function OmahSegments({ title, images }: { title: string; images: CollageImage[] }) {
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
                “house of dreams”
                <br />
                Rembitan Village, Lombok, Indonesia
                <br />
                Self-initiated project for Titian Foundation (2024)
              </>
            }
          >
            {INTRO_TEXT.map((para, i) => (
              <p
                key={i}
                style={{ ...line, textAlign: "justify", margin: i === 0 ? "14px 0 16px 0" : 0 }}
              >
                {para}
              </p>
            ))}
          </TitleBlock>
          {/* under the project text, docked to the bottom like the Pilgrim
              culverts. ver1 (1.59) 38% and ver2 (1.92) 45.9% are both ~24%
              tall; ver2 drops 12% to step */}
          <Pair style={{ marginTop: "auto", paddingTop: "120px" }}>
            <Figure
              src={img("/omah_ver1.png")}
              width="38%"
              caption={`${BALE_A} ${BALE_B}`}
            />
            <Figure
              src={img("/omah_ver2.png")}
              width="45.9%"
              style={{ marginTop: "12%" }}
              caption={
                <>
                  <span style={{ display: "block", marginBottom: "8px" }}>{GRIDSHELL}</span>
                  <span style={{ display: "block" }}>
                    {RESEARCH_A} {RESEARCH_B}
                  </span>
                </>
              }
            />
          </Pair>
        </Page>
        <Page>
          <Figure src={img("/omah3.gif?v=2")} width="100%" />
        </Page>
      </Spread>

      <Spread>
        <Page>
          <Figure src={img("/omah1.gif")} width="100%" caption={<Quote q={QUOTES.income} />} />
        </Page>
        <Page>
          {/* weave1 (1.45) 48% and weave2 (0.73) 24.2% are both ~33% tall,
              top-aligned (no stagger), with no gap between */}
          {/* at the top of the partition, level with omah1.gif */}
          <Pair gap="0" style={{ justifyContent: "flex-end" }}>
            <Figure
              src={img("/omah_weave1.png")}
              width="48%"
              caption={<Quote q={QUOTES.school} />}
            />
            <Figure
              src={img("/omah_weave2.PNG")}
              width="24.2%"
              caption={<Quote q={QUOTES.farming} />}
            />
          </Pair>
        </Page>
      </Spread>

      {/* left: the five stages of the diaomah diagram as a bento, split out
          of the original vertical strip (public/diaomah_1-5.jpg, each cropped
          to the same 406x170 frame with the ground line at the same height).
          All five are the same size: two per row, with stage 5 centred on the
          last row (a 4-column grid where each panel spans 2).
          right: the plan. */}
      <Spread>
        <Page>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              marginTop: "120px",
            }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <Figure
                key={n}
                src={`/diaomah_${n}.jpg`}
                width="100%"
                style={{ gridColumn: n === 5 ? "2 / span 2" : "span 2" }}
              />
            ))}
          </div>
        </Page>
        <Page>
          <Figure src={img("/omah_plan.png")} width="100%" />
        </Page>
      </Spread>
    </Segments>
  );
}

export default function ProjectOmah({ title, images }: Props) {
  const phone = usePhone();
  if (!phone) {
    return <OmahSegments title={title} images={images} />;
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
            <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 8px 0" }}>
              {title}
            </h1>
            <p style={{ ...line, ...META_TEXT, margin: "0 0 4px 0" }}>
              “house of dreams”
            </p>
            <p style={{ ...line, ...META_TEXT, margin: "0 0 2px 0" }}>
              Rembitan Village, Lombok, Indonesia
            </p>
            <p style={{ ...line, ...META_TEXT, margin: "0 0 24px 0" }}>
              Self-initiated project for Titian Foundation (2024)
            </p>
          </Block>

          {/* "In Rembitan..." split out of the title block, moved 10 right and 5
              down from its original column position. */}
          <Block phone={phone} spec={INTRO} style={textColumn(phone)}>
            {INTRO_TEXT.map((para, i) => (
              <p key={i} style={{ ...line, textAlign: "justify", margin: i === 0 ? "0 0 16px 0" : 0 }}>
                {para}
              </p>
            ))}
          </Block>

          {/* Quote above omah_weave1 (cell top 96vh). */}
          <Block phone={phone} spec={QUOTE_INCOME} style={captionColumn(phone)}>
            <p style={italic}>{QUOTES.income.text}</p>
            <p style={line}>{QUOTES.income.by}</p>
          </Block>

          {/* Quote below omah_weave1 (cell bottom 118vh). */}
          <Block phone={phone} spec={QUOTE_SCHOOL} style={captionColumn(phone)}>
            <p style={italic}>{QUOTES.school.text}</p>
            <p style={line}>{QUOTES.school.by}</p>
          </Block>

          {/* Quote under omah_weave2 (cell bottom 131vh). */}
          <Block phone={phone} spec={QUOTE_FARMING} style={captionColumn(phone)}>
            <p style={italic}>{QUOTES.farming.text}</p>
            <p style={line}>{QUOTES.farming.by}</p>
          </Block>

          {phone ? (
            // one run of text under the omah_ver pair, in reading order
            <Block
              phone={phone}
              spec={{ ...CAPTION_BALE, phoneOrder: 113 }}
              style={captionColumn(phone)}
            >
              <p style={{ ...line, textAlign: "justify" }}>
                {`${BALE_A} ${BALE_B} ${RESEARCH_A} ${RESEARCH_B}. ${GRIDSHELL}`}
              </p>
            </Block>
          ) : (
            <>
              {/* Caption under omah_ver1 (cell bottom 128vh). */}
              <Block phone={phone} spec={CAPTION_BALE} style={captionColumn(phone)}>
                <p style={line}>{BALE_A}</p>
                <p style={{ ...line, marginLeft: vw(5, phone) }}>{BALE_B}</p>
              </Block>

              {/* Caption under omah_ver2 (cell bottom 164vh). */}
              <Block
                phone={phone}
                spec={CAPTION_GRIDSHELL}
                style={captionColumn(phone)}
              >
                <p style={{ ...line, textAlign: "justify" }}>{GRIDSHELL}</p>
              </Block>

              {/* Caption below omah_ver2 (cell top 144vh + 20vh height = 164vh). */}
              <Block
                phone={phone}
                spec={CAPTION_RESEARCH}
                style={captionColumn(phone)}
              >
                <p style={{ ...line, marginLeft: vw(5, phone) }}>{RESEARCH_A}</p>
                <p style={{ ...line, marginLeft: vw(10, phone) }}>{RESEARCH_B}</p>
              </Block>
            </>
          )}

          {/* Image cells, placed against the page inset by the 40px gutters. */}
          <ImageCells phone={phone} cells={CELLS} images={images} />
        </>
      )}
    </CollageCanvas>
  );
}
