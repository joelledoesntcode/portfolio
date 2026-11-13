import CollageCanvas, {
  Block,
  ImageCells,
  type CollageImage,
  textColumn,
  vw,
  type BlockSpec,
} from "./CollageCanvas";
import { META_TEXT } from "../lib/theme";

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
  { top: 218, left: -10, width: 72, height: 48 }, // diaomah
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

export default function ProjectOmah({ title, description, images }: Props) {
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
              “House of Dreams”: A Beacon of Cultural Education
            </p>
            <p style={{ ...line, ...META_TEXT, margin: "0 0 2px 0" }}>
              Rembitan Village, Lombok, Indonesia
            </p>
            <p style={{ ...line, ...META_TEXT, margin: "0 0 24px 0" }}>
              Self-initiated project for Titian Foundation (2024)
            </p>
            <p style={italic}>
              ‘The Actions Of Others Affect The Way I Act, And My Actions Affect The Decisions Of Others’
            </p>
            <p style={{ ...line, margin: "0 0 16px 0" }}>
              - Salen, K., Walz, s. P., &amp; Deterding, s. (Eds.). (2014). The Gameful World: Approaches, Issues, Applications. MIT press.
            </p>
          </Block>

          {/* "In Rembitan..." split out of the title block, moved 10 right and 5
              down from its original column position. */}
          <Block phone={phone} spec={INTRO} style={textColumn(phone)}>
            <p style={{ ...line, textAlign: "justify" }}>
              In Rembitan village, women weave ethnic crafts for income but lack financial control, deepening gender inequality. {description}
            </p>
          </Block>

          {/* Quote above omah_weave1 (cell top 96vh). */}
          <Block phone={phone} spec={QUOTE_INCOME} style={captionColumn(phone)}>
            <p style={italic}>
              ‘‘I work for all our income and my husband takes the money and gambles’’
            </p>
            <p style={line}>- Working mother of 2</p>
          </Block>

          {/* Quote below omah_weave1 (cell bottom 118vh). */}
          <Block phone={phone} spec={QUOTE_SCHOOL} style={captionColumn(phone)}>
            <p style={italic}>
              ‘‘I stopped school to sell stuff and ask tourists for money, so my parents could eat’’
            </p>
            <p style={line}>- 8 year old girl</p>
          </Block>

          {/* Quote under omah_weave2 (cell bottom 131vh). */}
          <Block phone={phone} spec={QUOTE_FARMING} style={captionColumn(phone)}>
            <p style={italic}>
              ‘‘Farming isn’t sustainable anymore, I rely 100% on my wife who weaves cloth for tourists’’
            </p>
            <p style={line}>- A father / head of family</p>
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
