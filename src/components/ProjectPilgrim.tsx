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

// Disjoint cells spread across a tall canvas with plenty of whitespace, matching
// the Fish Market layout. top/height are in vh (vertical units, decoupled from
// the canvas height); left/width are % of page width. Each image fills its own
// cell, every cell is a DIFFERENT size on purpose (no two images render the same
// size), and the cells are staggered so no two line up on any edge. The cells are
// ordered to match the images array. The top-left is kept clear for the title.
// The canvas height is computed below so the bottom margin (below the lowest
// image) matches the Fish Market page's margin gap (see BOTTOM_MARGIN).
const CELLS: { top: number; left: number; width: number; height: number }[] = [
  { top: 26, left: 42, width: 48, height: 28 }, // antecollage (main)
  { top: 26, left: -10, width: 40, height: 24 }, // culv1
  { top: 43, left: -18, width: 80, height: 52 }, // culv2
  { top: 92, left: -9, width: 74, height: 50 }, // mainante (main)
  { top: 107, left: 61, width: 22, height: 24 }, // 1.PNG (pair with 2)
  { top: 112, left: 74, width: 22, height: 24 }, // 2.PNG (pair with 1)
  { top: 138, left: 67, width: 22, height: 24 }, // 3.PNG (aligned under 1.PNG)
  { top: 143, left: 80, width: 22, height: 24 }, // 4.PNG (aligned under 2.PNG)
  { top: 167, left: 20, width: 60, height: 40 }, // backrrender (below all)
];

// Canvas height = lowest image bottom + bottom margin. The bottom margin matches
// the Fish Market page's gap (its smallest cell top, undergif at 11.22vh) rather
// than this page's own top margin.
const BOTTOM_MARGIN = 11.22;
const MAX_BOTTOM = Math.max(...CELLS.map((c) => c.top + c.height));
const CANVAS_VH = MAX_BOTTOM + BOTTOM_MARGIN;

// Text columns. `top` is in vh to match the image cells; left/width are % of the
// page width. Each is anchored to the image it annotates (noted alongside).
const TITLE: BlockSpec = { top: 0, left: 0, width: 19.5 };
const EARTHWORK: BlockSpec = { top: 78, left: 40, width: 19.5 };
const CAPTION_TOWER: BlockSpec = { top: 154, left: 10, width: 19.5 }; // under mainante.png
const CAPTION_PULL: BlockSpec = { top: 107, left: 48, width: 20 }; // beside 1.PNG
const CAPTION_RELEASE: BlockSpec = { top: 109, left: 84, width: 20, height: 24 }; // beside 2.PNG
const CAPTION_LEAVE: BlockSpec = { top: 138, left: 70, width: 16 }; // right of 3.PNG
const CAPTION_FIND: BlockSpec = { top: 164, left: 90, width: 20 }; // below 4.PNG

const line: React.CSSProperties = { fontSize: "0.7rem", fontWeight: 300, margin: 0 };

/** The short captions sit on a narrower inset than the title column. */
const captionColumn = (phone: boolean): React.CSSProperties => ({
  padding: phone ? 0 : "0 24px 0 12px",
  boxSizing: "border-box",
});

export default function ProjectPilgrim({ title, description, images }: Props) {
  // Split the description so everything from "The Earthwork theme" onward renders
  // as its own block, pushed down from the intro paragraphs above it.
  const EARTHWORK_MARKER = "The Earthwork theme";
  const markerIdx = description.indexOf(EARTHWORK_MARKER);
  const introText = markerIdx >= 0 ? description.slice(0, markerIdx) : description;
  const earthworkText = markerIdx >= 0 ? description.slice(markerIdx) : "";

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
            <p style={{ ...line, ...META_TEXT, margin: "0 0 10px 0" }}>
              London, UK
              <br />
              Antepavilion competition entry (2024)
            </p>
            <p
              style={{ ...line, textAlign: "justify" }}
              dangerouslySetInnerHTML={{ __html: introText }}
            />
          </Block>

          {/* "The Earthwork theme..." onward — split out of the intro column so it
              can be positioned independently. */}
          {earthworkText && (
            <Block phone={phone} spec={EARTHWORK} style={textColumn(phone)}>
              <p
                style={{ ...line, textAlign: "justify" }}
                dangerouslySetInnerHTML={{ __html: earthworkText }}
              />
            </Block>
          )}

          {/* Caption text under mainante.png — its cell bottoms out at top 92vh +
              50vh = 142vh. */}
          <Block phone={phone} spec={CAPTION_TOWER} style={textColumn(phone)}>
            <p style={line}>
              Tower: pays homage to historic Roman trusses.
              <br />
              Ballasts: embodies unearthing, honours cycles of creation and demolition.
            </p>
          </Block>

          {/* Caption text beside 1.PNG — right-aligned so it sits against the
              image's left edge, top aligned with 1.PNG's cell top (116vh). */}
          <Block phone={phone} spec={CAPTION_PULL} style={textColumn(phone)}>
            <p style={{ ...line, textAlign: phone ? "left" : "right" }}>
              Pull for refuge...
            </p>
          </Block>

          {/* Caption text beside 2.PNG — left-aligned, bottom aligned with 2.PNG's
              cell bottom (top 121vh + 24vh height = 145vh). */}
          <Block
            phone={phone}
            spec={CAPTION_RELEASE}
            style={
              phone
                ? textColumn(phone)
                : { ...textColumn(phone), display: "flex", alignItems: "flex-end" }
            }
          >
            <p style={line}>...Release for repose, shape your own spaces</p>
          </Block>

          {/* Caption text on the right side of 3.PNG — left-aligned, starting at
              3.PNG's right edge (left 62% + 22% width = 84%), top at 142vh. */}
          <Block phone={phone} spec={CAPTION_LEAVE} style={captionColumn(phone)}>
            <p style={line}>Leave things behind...</p>
          </Block>

          {/* Caption text below 4.PNG — aligned under its left edge (75%), just
              below its cell bottom (142vh + 24vh = 166vh). */}
          <Block phone={phone} spec={CAPTION_FIND} style={captionColumn(phone)}>
            <p style={line}>...For the next pilgrim to find</p>
          </Block>

          {/* Image cells, placed against the page inset by the 40px gutters. */}
          <ImageCells phone={phone} cells={CELLS} images={images} />
        </>
      )}
    </CollageCanvas>
  );
}
