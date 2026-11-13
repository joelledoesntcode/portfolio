import React, { useEffect, useMemo, useRef, useState } from "react";
import { asset } from "../lib/asset";
import { PHONE_BREAKPOINT } from "../lib/usePhone";
import { IMAGE_ASPECTS } from "../lib/imageAspects";

// --- the collage pages (Fish Market, PTF, Omah, Pilgrim) ---------------------
//
// These pages are hand-composed collages: every image and text block sits at a
// coordinate the author tuned by eye — horizontal in % of the page width,
// vertical in vh. Two layouts keep that readable at any width:
//
//  • >= PHONE_BREAKPOINT — the collage is locked to a fixed DESIGN_WIDTH canvas
//    and scaled uniformly to fit. Locking the width is what removes the
//    collisions: text always wraps to the same line count the author tuned
//    against, so a paragraph can never grow downwards into the image below it.
//    Vertical coordinates stay in real vh, so at the design width the page is
//    identical to the hand-placed composition. Wider screens gain side margins
//    (we only ever scale down, never up); narrower ones shrink the whole
//    composition uniformly.
//
//  • < PHONE_BREAKPOINT — the collage is abandoned (it would be illegible at
//    that scale) and the same blocks reflow into one column, ordered by the
//    vertical position the author gave them.
//
// The author tuned the pages at an effective 1707 CSS-pixel width (a 2560px
// display at 150% OS scaling), the same figure ProjectProfile uses.
export const DESIGN_WIDTH = 1707;
export { PHONE_BREAKPOINT };

// Side gutter the image cells are inset by; cell left/width are percentages of
// the page width *inside* these gutters.
export const GUTTER = 40;



export type BlockSpec = {
  /** vertical position, in vh */
  top: number;
  /** horizontal position, as a percentage of the block's frame */
  left: number;
  /** width, as a percentage of the block's frame */
  width: number;
  /** height, in vh; omit to size to content */
  height?: number;
  /**
   * "page" measures left/width against the full canvas (text columns);
   * "gutter" measures them against the canvas inset by GUTTER (image cells).
   */
  frame?: "page" | "gutter";
  /**
   * On phones, order this block as if it sat at this vh. Lets the column be
   * re-sequenced without moving anything on desktop. Defaults to `top`.
   */
  phoneOrder?: number;
};

/**
 * One positioned element of a collage: absolutely placed on the fixed-width
 * canvas on desktop, a full-width row in reading order on phones.
 */
export function Block({
  phone,
  spec,
  style,
  children,
}: {
  phone: boolean;
  spec: BlockSpec;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const fit = React.useContext(FitContext);
  if (phone) {
    return (
      // `order` re-sorts the flat child list by the authored vertical position,
      // so blocks stack the way they read on the collage even though the JSX
      // groups all the text before all the images.
      <div
        style={{
          order: Math.round((spec.phoneOrder ?? spec.top) * 100),
          width: "100%",
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  const frameWidth =
    spec.frame === "gutter" ? DESIGN_WIDTH - GUTTER * 2 : DESIGN_WIDTH;
  const originX = spec.frame === "gutter" ? GUTTER : 0;
  // text columns and image cells share the same shift, so captions stay beside
  // the images they annotate
  const { shiftPx } = fit;

  return (
    <div
      style={{
        position: "absolute",
        top: `${spec.top}vh`,
        left: `${originX + (frameWidth * spec.left) / 100 + shiftPx}px`,
        width: `${(frameWidth * spec.width) / 100}px`,
        height: spec.height != null ? `${spec.height}vh` : undefined,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type CollageImage = {
  src: string;
  caption: string;
  hero?: boolean;
  scale?: number;
  /**
   * On phones, images sharing a `pair` tag are rendered side by side in one row
   * at half width each, instead of each taking a full-width row. The two need
   * not be adjacent in the array. Ignored on desktop, where both keep their
   * hand-placed cells.
   */
  pair?: string;
  /**
   * On phones, render this image at this percentage of the width available to
   * it instead of filling it — for images that read better small. That is the
   * column width for a lone image (which is then centred), or the shared row
   * for one half of a `pair` (which defaults to 50 each).
   */
  phoneWidth?: number;
  /**
   * Within a `pair` on phones, sit against the top or the bottom of the row
   * (they are different heights, so this staggers them). Defaults to top.
   */
  phoneAlign?: "top" | "bottom";
  /**
   * On phones, order this image as if its cell sat at this vh instead of where
   * it actually sits, to re-sequence the column without moving the image on
   * desktop. Ignored on desktop.
   */
  phoneOrder?: number;
  /**
   * Within a `pair` on phones, push this image down by this percentage of
   * the row width, to stagger the two instead of having them share a top
   * edge. (Percentage margins resolve against width, so it scales.)
   */
  phoneOffsetY?: number;
  /**
   * Set on either image of a `pair` to push the two to opposite edges of their
   * row on phones, instead of sitting together behind a gap.
   */
  phoneRowSpread?: boolean;
  /**
   * Set on either image of a `pair` to add this much height to the row on
   * phones, as a percentage of its width (so it scales with the screen).
   */
  phoneRowExtraHeight?: number;
};

/**
 * A length the author expressed in `vw`, resolved against the fixed canvas so
 * it stays put instead of tracking the visitor's window (e.g. hanging indents).
 * Collapses to 0 on phones, where the column is already full width.
 */
export const vw = (n: number, phone = false) =>
  phone ? 0 : `${(DESIGN_WIDTH * n) / 100}px`;

/** Padding for a text column: the 40px gutter on desktop, none on phones. */
export const textColumn = (phone: boolean): React.CSSProperties => ({
  padding: phone ? 0 : "0 24px 0 40px",
  boxSizing: "border-box",
});

export type Cell = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type Fit = {
  /** px to push the whole composition right so nothing bleeds off the left */
  shiftPx: number;
  /** canvas width needed to hold the composition plus both gutters */
  canvasWidth: number;
};

export const NO_FIT: Fit = { shiftPx: 0, canvasWidth: DESIGN_WIDTH };

const FitContext = React.createContext<Fit>(NO_FIT);

/**
 * Several cells are authored outside the page frame (negative lefts, or a right
 * edge past 100%) so their images used to bleed off the screen with no margin.
 *
 * The fix is a pure translation plus a wider canvas — never a horizontal
 * squeeze. Squeezing x alone would pull columns closer together while heights
 * stayed in vh, changing the composition's proportions and pushing images into
 * each other. Shifting the whole thing right and widening the canvas leaves
 * every px distance (and so every line break) exactly as authored; the
 * scale-to-fit then shrinks both axes together, which is what keeps the
 * hand-placed geometry intact.
 *
 * `scale` is taken into account because an image only paints the middle
 * `scale` fraction of its cell, so a scaled-down cell may not really bleed.
 */
export function fitCellsToFrame(
  cells: Cell[],
  images: CollageImage[],
  viewportHeight: number
): Fit {
  if (images.length === 0) return NO_FIT;

  const frame = DESIGN_WIDTH - GUTTER * 2;
  const vh = viewportHeight / 100;

  const painted = images.map((item, i) => {
    const c = cells[i % cells.length];
    const fill = item.scale ?? 1;
    // the cell is the image's upper bound; object-fit: contain then letterboxes
    // it inside, so the real painted width can be narrower
    const capWidth = (frame * c.width * fill) / 100;
    const aspect = IMAGE_ASPECTS[item.src];
    const widthPct = aspect
      ? (Math.min(capWidth, c.height * fill * vh * aspect) / frame) * 100
      : c.width * fill;
    const centre = c.left + c.width / 2;
    return { left: centre - widthPct / 2, right: centre + widthPct / 2 };
  });
  const contentLeft = GUTTER + (frame * Math.min(...painted.map((p) => p.left))) / 100;
  const contentRight = GUTTER + (frame * Math.max(...painted.map((p) => p.right))) / 100;

  const shiftPx = Math.max(0, GUTTER - contentLeft);
  return {
    shiftPx,
    canvasWidth: Math.max(DESIGN_WIDTH, contentRight + shiftPx + GUTTER),
  };
}

/**
 * The image half of a collage: each image fills its own hand-placed cell on
 * desktop, or becomes a full-width row on phones. Cells are matched to images
 * by index, cycling if there are more images than cells.
 */
export function ImageCells({
  phone,
  cells,
  images,
}: {
  phone: boolean;
  cells: Cell[];
  images: CollageImage[];
}) {
  const cellFor = (i: number) => cells[i % cells.length];
  const specFor = (i: number): BlockSpec => ({
    ...cellFor(i),
    frame: "gutter",
    phoneOrder: images[i].phoneOrder,
  });

  const nodes: React.ReactNode[] = [];
  const consumed = new Set<number>();

  for (let i = 0; i < images.length; i++) {
    if (consumed.has(i)) continue;
    const item = images[i];

    // a phone-only pair: the two images share one row, splitting it evenly
    // unless either gives an explicit phoneWidth
    const partner = phone && item.pair
      ? images.findIndex((other, k) => k !== i && other.pair === item.pair)
      : -1;
    if (partner !== -1) {
      consumed.add(partner);
      // order the row by whichever of the two sits higher on the collage
      const anchor = cellFor(i).top <= cellFor(partner).top ? i : partner;
      // row options may be set on either half of the pair
      const spread = item.phoneRowSpread ?? images[partner].phoneRowSpread;
      const extraHeight =
        item.phoneRowExtraHeight ?? images[partner].phoneRowExtraHeight;
      nodes.push(
        <Block
          key={i}
          phone={phone}
          spec={specFor(anchor)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: spread ? "space-between" : "flex-start",
            gap: spread ? 0 : "12px",
            paddingBottom: extraHeight ? `${extraHeight}%` : undefined,
          }}
        >
          {[images[i], images[partner]].map((im) => (
            // each half sits in its own wrapper, which carries the width and
            // the cross-axis alignment; the image just fills it
            <div
              key={im.src}
              style={{
                width: `${im.phoneWidth ?? 50}%`,
                alignSelf:
                  im.phoneAlign === "bottom" ? "flex-end" : "flex-start",
                marginTop: im.phoneOffsetY ? `${im.phoneOffsetY}%` : undefined,
              }}
            >
              <img
                src={asset(im.src)}
                alt={im.caption}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          ))}
        </Block>
      );
      continue;
    }

    // each image fills its own (uniquely sized) cell; `scale` shrinks or grows
    // an individual image further
    const fill = (item.scale ?? 1) * 100;
    nodes.push(
      <Block
        key={i}
        phone={phone}
        spec={specFor(i)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={asset(item.src)}
          alt={item.caption}
          loading="lazy"
          decoding="async"
          style={
            phone
              ? {
                  width: `${item.phoneWidth ?? 100}%`,
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }
              : {
                  // the cell bounds keep the image inside its own area, so
                  // images never overlap
                  maxWidth: `${fill}%`,
                  maxHeight: `${fill}%`,
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }
          }
        />
      </Block>
    );
  }

  return <>{nodes}</>;
}

export default function CollageCanvas({
  heightVh,
  cells,
  images,
  children,
}: {
  /** height of the composition, in vh */
  heightVh: number;
  /** the page's image cells, used to fit the composition inside the gutters */
  cells: Cell[];
  images: CollageImage[];
  children: (phone: boolean) => React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState(
    typeof window !== "undefined" && window.innerWidth < PHONE_BREAKPOINT
  );
  const [scale, setScale] = useState(1);
  const [marginLeft, setMarginLeft] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const [phoneHeight, setPhoneHeight] = useState(0);

  // Heights are authored in vh, so how much of its cell an image paints — and
  // therefore whether it bleeds past a gutter — depends on the window height.
  // The fit is recomputed with it rather than baked in.
  const fit = useMemo(
    () => fitCellsToFrame(cells, images, viewportHeight),
    [cells, images, viewportHeight]
  );

  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      setViewportHeight(window.innerHeight);
      if (vw < PHONE_BREAKPOINT) {
        setPhone(true);
        setScale(1);
        setMarginLeft(0);
        return;
      }
      setPhone(false);
      // only ever scale down, never up
      const s = Math.min(1, vw / fit.canvasWidth);
      setScale(s);
      setMarginLeft(Math.max(0, (vw - fit.canvasWidth * s) / 2));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fit.canvasWidth]);

  // In phone mode the column's height is content-driven, so measure it rather
  // than deriving it from heightVh.
  useEffect(() => {
    if (!phone || !innerRef.current) return;
    const measure = () => setPhoneHeight(innerRef.current!.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [phone]);

  if (phone) {
    return (
      <FitContext.Provider value={fit}>
      <div
        ref={innerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          width: "100%",
          padding: "40px 20px 60px 20px",
          boxSizing: "border-box",
          overflowX: "hidden",
          textTransform: "lowercase",
          minHeight: phoneHeight ? undefined : "100vh",
        }}
      >
        {children(true)}
      </div>
      </FitContext.Provider>
    );
  }

  return (
    <FitContext.Provider value={fit}>
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
        // reserve the *scaled* height so the page scrolls to exactly the
        // content and no further
        height: `${(heightVh / 100) * viewportHeight * scale}px`,
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: "relative",
          width: `${fit.canvasWidth}px`,
          height: `${heightVh}vh`,
          marginLeft: `${marginLeft}px`,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          boxSizing: "border-box",
          textTransform: "lowercase",
        }}
      >
        {children(false)}
      </div>
    </div>
    </FitContext.Provider>
  );
}
