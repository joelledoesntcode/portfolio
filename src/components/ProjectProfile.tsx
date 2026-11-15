import React, { useState, useEffect, useRef } from "react";
import { asset } from "../lib/asset";
import { usePhone } from "../lib/usePhone";
import { META_TEXT } from "../lib/theme";
import { Figure, Page, Pair, Segments, Spread, TitleBlock, Trio, line } from "./Segments";

// The title for this project is rendered by App.tsx (left column).
const VIDEO_ID = "DjP4-UcvrB8";

// The page is pixel-tuned at one fixed DESIGN_WIDTH (the author's effective CSS
// width: a 2560px display at 150% OS scaling ≈ 1707 CSS px). We lock the canvas
// to that width so the text↔image arrangement is byte-identical at every screen
// size — text can never slide onto an image. We only ever scale DOWN, never up:
//   • wider screens  → content stays its tuned size and just gains side margins
//                      (so the *text's margins* change, images don't move);
//   • narrower screens → the whole canvas shrinks uniformly to fit (no overlap,
//                      no horizontal scrollbar).
const DESIGN_WIDTH = 1707;

// Copy shared by the desktop and phone layouts.
const TEXT = {
  intro1:
    "The Malacca Strait, between the Indonesian and Malaysian archipelago, constitutes a boundary produced through successive layers of mercantile inscription. From these transactional ecologies emerged a diasporic Peranakan identity, indigenous to the strait itself.",
  intro2:
    "Colonial and postcolonial borders severed these trade routes, while persecution and cultural suppression fractured the community, leaving its buildings abandoned and in decay.",
  intro3:
    "The proposal is a contemporary clan house that restores street-level commerce and adds a selectively accessed archive of ancestral memory, enabling the community to rewrite its own spatial history.",
  zhengHe:
    "Zheng He’s 15th century Silk Road voyages carried Chinese trade into Southeast Asia. Merchants who stayed blended their traditions with the local Malay, creating Peranakan culture: people born of the strait.",
  british:
    "The British took Malaya, the Dutch took Indonesia; a fluid corridor was split between rival empires. The old informal movements across the strait were overwritten, and the strait became a tool of divide and conquer.",
  enclaves:
    "Peranakan enclaves gathered in Penang and Medan: twin cities across the water, split by rival colonial hands and absorbed into the same extractive machine.",
  independence:
    "Then independence came, and with redefining national identity, Malaysia chose preservation, while Indonesia systematically erased Chinese language and culture.",
  erasure:
    "Erasure follows rewriting, especially when someone else holds the pen. As culture retreats into the home, the altar table becomes the last reminder of belonging.",
  tracing:
    "When tracing enclaves through surviving buildings and family accounts, the two cities diverge. In Penang, heritage sits inside the city grid. In Medan, they are pushed to the margins.",
  apparatus:
    "an apparatus reinterpreting the peranakan ancestral altar. a colonial map lies on the lower tier over a lightbox, memories are drawn on the surface. lived experience is layered over fixed colonial cartography and the two read as one.",
  mirrored:
    "the malacca strait once mirrored a shared identity between penang and medan. the project seeks to mend this fracture and return agency to peranakan communities on both shores.",
  trade:
    "Trade defined the rhythms, hierarchies, and social fabric of Peranakan life, producing an architecture where livelihood and identity were structurally bound.",
  ornament:
    "Peranakan identity lived in ornament laid over colonial buildings, impermanent and easily stripped away. What happens when ornament becomes load-bearing, and culture is carved into the structure instead of painted onto it?",
  workshop:
    "Synonymous to the apparatus, the workshop is a site of active re-inscription, a space to protect cultural arts made by and for the community.",
  archive:
    "The archive lines the clan house's inner walls, holding ancestral tablets and family artefacts that anchor the community's shared identity. Carefully placed windows veil the facade, so outsiders can glimpse what lies within but never fully enter.",
  castings:
    "Detachable castings with family trees are placed on the inside of the archive.",
};


/**
 * The project film, as a facade: a clean poster + play button until clicked,
 * then the YouTube player. Keeps the preview free of the YouTube logo/title.
 * Fills its (positioned) parent.
 */
function FilmEmbed() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
    {playing ? (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
        title="Waters of Unfinished Maps: Reinscribing the Malacca Strait"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    ) : (
      <button
        onClick={() => setPlaying(true)}
        aria-label="Play film"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          padding: 0,
          color: "#333",
          cursor: "crosshair",
          backgroundImage: `url(https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              width: 0,
              height: 0,
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
              borderLeft: "20px solid white",
              marginLeft: "4px",
            }}
          />
        </span>
      </button>
    )}
    </>
  );
}

// --- desktop: two-partition segments (see Segments.tsx) -----------------------
//
// Same design language as Pilgrim, Røyk, Peter Tatchell and Omah Mimpi, in the
// story's order. Each paragraph sits 8px under the picture it belongs to. Pair
// widths come from the images' aspect ratios (noted inline) so the two come out
// the same height, and one is dropped about half that height to step; trios
// step the same way.
//   1. title block, move1 docked bottom-left      | archive.gif + Zheng He,
//                                                   penangmedangif + mirrored
//   2. movement.jpg + independence                | col.gif
//   3. 111/222/333 trio + British                 | extract.jpg + enclaves
//   4. the film + erasure                         | silk trio
//   5. 333.jpg / 777.jpg + tracing                | medanpenang.jpg
//   6. appa / modelmalacca + apparatus            | (empty)
//   7. explode.jpg, mod trio docked under it      | shoptax over shophouse + trade
//   8. workshop.jpg + workshop                    | frontrender + ornament
//   9. malaccaplan.jpg on its own, centred
//  10. archive.gif + archive                      | panel2.gif + castings
const para: React.CSSProperties = { ...line, textAlign: "justify", marginTop: "8px" };

function MalaccaSegments({ title }: { title: string }) {
  const dock: React.CSSProperties = { marginTop: "auto" };
  return (
    <Segments>
      <Spread>
        <Page>
          <TitleBlock
            title={title}
            meta={
              <>
                medan, indonesia
                <br />
                masters project year 1, diploma 5, architectural association
                <br />
                unit masters: nana biamah ofosu, giles tettey nartey
              </>
            }
          >
            <p style={{ ...line, textAlign: "justify", margin: "0 0 12px 0" }}>{TEXT.intro1}</p>
            <p style={{ ...line, textAlign: "justify", margin: "0 0 12px 0" }}>{TEXT.intro2}</p>
            <p style={{ ...line, textAlign: "justify" }}>{TEXT.intro3}</p>
          </TitleBlock>
          {/* move1 (portrait, 0.69) docked to the bottom, aligned left; at 50%
              it is ~72% of the partition tall */}
          <Figure
            src="/move1.jpg"
            width="50%"
            style={{ ...dock, paddingTop: "120px" }}
          />
        </Page>
        <Page>
          <Figure src="/archive.gif" width="100%" />
          <p style={para}>{TEXT.zhengHe}</p>
          {/* penangmedangif below the archive, docked to the bottom so it ends
              level with move1 on the left */}
          <div style={{ ...dock, paddingTop: "200px" }}>
            <Figure src="/penangmedangif.gif" width="100%" />
            <p style={para}>{TEXT.mirrored}</p>
          </div>
        </Page>
      </Spread>

      <Spread>
        <Page>
          <Figure src="/movement.jpg" width="100%" />
          <p style={para}>{TEXT.independence}</p>
        </Page>
        <Page>
          <Figure src="/col.gif" width="100%" />
        </Page>
      </Spread>

      <Spread>
        <Page>
          {/* one level line, no step */}
          <Trio srcs={["/111.gif", "/222.gif", "/333.gif"]} width="26%" gap="11%" step={0} />
          <p style={{ ...para, width: "63%" }}>{TEXT.british}</p>
        </Page>
        <Page>
          <Figure src="/extract.jpg" width="100%" />
          <p style={para}>{TEXT.enclaves}</p>
        </Page>
      </Spread>

      <Spread>
        <Page>
          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
            <FilmEmbed />
          </div>
          <p style={para}>{TEXT.erasure}</p>
        </Page>
        <Page>
          {/* the silk squares, level in one line (no step), centred both ways
              in the partition (auto margins top and bottom) */}
          <Trio
            srcs={["/silk1.jpg", "/silk2.jpg", "/silk3.jpg"]}
            width="28%"
            gap="6%"
            step={0}
            justify="center"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
        </Page>
      </Spread>

      <Spread>
        <Page>
          {/* 333 (0.67) 26% and 777 (1.5) 58.5% are both ~39% tall; 777 drops
              20% */}
          <Pair gap="15.5%">
            <Figure src="/333.jpg" width="26%" />
            <Figure src="/777.jpg" width="58.5%" style={{ marginTop: "20%" }} />
          </Pair>
          <p style={para}>{TEXT.tracing}</p>
        </Page>
        <Page>
          <Figure src="/medanpenang.jpg" width="100%" />
        </Page>
      </Spread>

      <Spread>
        <Page>
          {/* mirrored: the first is dropped. appa (0.62) 28% and the model
              (1.32) 59% are both ~45% tall; appa drops 22% */}
          <Pair gap="13%">
            <Figure src="/appa.png" width="28%" style={{ marginTop: "22%" }} />
            <Figure src="/modelmalacca.jpg" width="59%" />
          </Pair>
          <p style={para}>{TEXT.apparatus}</p>
        </Page>
        <Page>{null}</Page>
      </Spread>

      <Spread>
        <Page>
          <Figure src="/explode.jpg" width="100%" />
          {/* the mods under explode, docked to the bottom so they finish level
              with the tall shoptax / shophouse stack on the right */}
          <Trio
            srcs={["/mod1.png", "/mod3.png", "/mod2.png"]}
            width="26%"
            gap="11%"
            step={12}
            style={{ ...dock, paddingTop: "48px" }}
          />
        </Page>
        <Page>
          {/* stacked: shoptax (square) at 70% width, centred, then the shophouse
              diagram across the partition under it, 48px apart (the gap used
              between stacked pictures on Røyk) */}
          <Figure src="/shoptax.jpg" width="70%" style={{ alignSelf: "center" }} />
          <Figure src="/shophousediagram.jpg" width="100%" style={{ marginTop: "48px" }} />
          <p style={para}>{TEXT.trade}</p>
        </Page>
      </Spread>

      <Spread>
        <Page>
          <Figure src="/workshop.jpg" width="100%" />
          <p style={para}>{TEXT.workshop}</p>
        </Page>
        <Page>
          <Figure src="/frontrender.jpg" width="100%" />
          <p style={para}>{TEXT.ornament}</p>
        </Page>
      </Spread>

      {/* the plan on its own, centred at one partition's width (45%), like
          the Omah plan */}
      <Figure src="/malaccaplan.jpg" width="45%" style={{ alignSelf: "center" }} />

      <Spread>
        <Page>
          <Figure src="/archive.gif" width="100%" />
          <p style={para}>{TEXT.archive}</p>
        </Page>
        <Page>
          {/* panel2 is portrait (0.56): at 45% it is ~80% tall */}
          <Figure src="/panel2.gif" width="45%" />
          <p style={{ ...para, width: "45%" }}>{TEXT.castings}</p>
        </Page>
      </Spread>
    </Segments>
  );
}

export default function ProjectProfile({ title }: { title: string }) {
  const phone = usePhone();

  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // Left margin that centres the (possibly scaled) canvas on wider screens.
  const [marginLeft, setMarginLeft] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const s = Math.min(1, vw / DESIGN_WIDTH);
      setScale(s);
      setMarginLeft(Math.max(0, (vw - DESIGN_WIDTH * s) / 2));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Track the unscaled content height (also as images load) so the outer
  // wrapper can reserve the *scaled* height — no extra whitespace, correct scroll.
  useEffect(() => {
    if (!innerRef.current) return;
    const measure = () => setInnerHeight(innerRef.current!.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, []);

  // Desktop uses the two-partition segments; the fixed-canvas JSX below now
  // only renders the phone column.
  if (!phone) return <MalaccaSegments title={title} />;

  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
        height: phone || !innerHeight ? undefined : `${innerHeight * scale}px`,
      }}
    >
      <div
        ref={innerRef}
        style={{
          // On phones the fixed design canvas is abandoned: the page becomes a
          // plain full-width vertical column (see usePhone / CollageCanvas).
          width: phone ? "100%" : `${DESIGN_WIDTH}px`,
          marginLeft: phone ? 0 : `${marginLeft}px`,
          transformOrigin: "top left",
          transform: phone ? "none" : `scale(${scale})`,
          boxSizing: "border-box",
          padding: phone ? "32px 20px 60px 20px" : "40px 40px 80px 40px",
          // 12px matches the paragraph rhythm inside each text block, so
          // consecutive paragraphs read as one column of copy rather than as
          // separately spaced sections. Images add their own margin on top.
          gap: phone ? "12px" : undefined,
          textTransform: "lowercase",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* title — same position as other project titles (top-left, 19.5% column) */}
        <h1
          style={{
            fontSize: "0.9rem",
            fontWeight: 300,
            margin: "0 0 6px 0",
            width: phone ? "100%" : "19.5%",
            paddingRight: "24px",
            boxSizing: "border-box",
          }}
        >
          {title}
        </h1>

        {/* project metadata — under the title, before the intro subtext */}
        <div
          style={{
            width: phone ? "100%" : "19.5%",
            paddingRight: "24px",
            boxSizing: "border-box",
            // On phones the title, this block and the intro are separate flex
            // children, so each pair also picks up the column gap. Pull them
            // back together to the 6px/8px the other project pages use.
            margin: phone ? "-12px 0 0 0" : "0 0 16px 0",
          }}
        >
          <p style={{ ...META_TEXT, margin: 0 }}>
            medan, indonesia
          </p>
          <p style={{ ...META_TEXT, margin: 0 }}>
            masters project year 1, diploma 5, architectural association
          </p>
          <p style={{ ...META_TEXT, margin: 0 }}>
            unit masters: nana biamah ofosu, giles tettey nartey
          </p>
        </div>

        {/* intro subtext — matches other projects' description column */}
        <div
          style={{
            width: phone ? "100%" : "19.5%",
            paddingRight: "24px",
            boxSizing: "border-box",
            margin: phone ? "-4px 0 0 0" : "0 0 32px 0",
          }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: "0 0 12px 0" }}>
            {TEXT.intro1}
          </p>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: "0 0 12px 0" }}>
            {TEXT.intro2}
          </p>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}>
            {TEXT.intro3}
          </p>
        </div>

        {/* archive.gif — top of the page */}
        <img
          src={asset("/archive.gif")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "560px",
            height: "auto",
            // phone: 12px on top of the column's 12px gap, so the gif gets a
            // 24px breather before the silk squares
            margin: phone ? "0 auto 12px auto" : "0 auto",
            position: "relative",
            left: phone ? "auto" : "420px",
            top: phone ? "auto" : "-250px",
          }}
        />

        {/* silk1/2/3 — small squares next to archive.gif (zero-height wrapper, no shift) */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <div
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-550px",
              left: phone ? "auto" : "430px",
              display: "flex",
              flexDirection: "row",
            flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: phone ? "space-between" : undefined,
              gap: phone ? "6px" : "28px",
            }}
          >
            <img src={asset("/silk1.jpg")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "120px", height: phone ? "auto" : "120px", objectFit: "cover", marginTop: phone ? 0 : "0px" }} />
            <img src={asset("/silk2.jpg")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "120px", height: phone ? "auto" : "120px", objectFit: "cover", marginTop: phone ? 0 : "45px" }} />
            <img src={asset("/silk3.jpg")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "120px", height: phone ? "auto" : "120px", objectFit: "cover", marginTop: phone ? 0 : "90px" }} />
          </div>
        </div>

        {/* text block below archive.gif — same width as other projects' middle subtext */}
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 300,
            textAlign: "justify",
            width: phone ? "100%" : "19.5%",
            paddingRight: "24px",
            boxSizing: "border-box",
            margin: "0 auto 0 0",
            position: "relative",
            left: phone ? "auto" : "800px",
            top: phone ? "auto" : "-50px",
            zIndex: 5,
          }}
        >
            {TEXT.zhengHe}
          </p>

        {/* text above col.gif — zero-height wrapper so it doesn't shift any image */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "180px",
              left: phone ? "auto" : "50px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.british}
          </p>
        </div>

        {/* col.gif */}
        <img
          src={asset("/col.gif")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "980px",
            height: "auto",
            margin: phone ? "12px 0 0 0" : "40px auto 0 auto",
            position: "relative",
            top: phone ? "auto" : "300px",
            left: phone ? "auto" : "-200px",
          }}
        />

        {/* text to the right of col.gif — zero-height wrapper so no other image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "250px",
              left: phone ? "auto" : "1150px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.enclaves}
          </p>
        </div>

        {/* extract.jpg below col.gif — zero-height wrapper so no other image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <img
            src={asset("/extract.jpg")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "380px",
              left: phone ? "auto" : "800px",
              width: phone ? "100%" : "740px",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* text above 111 — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "450px",
              left: phone ? "auto" : "50px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.independence}
          </p>
        </div>

        {/* 111/222/333 — row to the left of extract.jpg (zero-height wrapper, no shift) */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <div
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "580px",
              left: phone ? "auto" : "200px",
              display: "flex",
              flexDirection: "row",
            flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: phone ? "space-between" : undefined,
              gap: phone ? "6px" : "16px",
            }}
          >
            <img src={asset("/111.gif")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "140px", height: "auto" }} />
            <img src={asset("/222.gif")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "140px", height: "auto" }} />
            <img src={asset("/333.gif")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "140px", height: "auto" }} />
          </div>
        </div>

        {/* movement.jpg — standalone */}
        <img
          src={asset("/movement.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "740px",
            height: "auto",
            margin: phone ? "12px 0 0 0" : "40px auto 0 auto",
            position: "relative",
            top: phone ? "auto" : "-914px",
            left: phone ? "auto" : "-350px",
          }}
        />


        {/* move1.jpg */}
        <img
          src={asset("/move1.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "380px",
            height: "auto",
            margin: phone ? "12px auto 0 auto" : "40px auto 0 auto",
            position: "relative",
            top: phone ? "auto" : "-1193px",
            left: phone ? "auto" : "600px",
          }}
        />

        {/* film — under everything */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: phone ? "none" : "740px",
            paddingTop: "min(56.25%, 416px)",
            margin: "80px auto 0 auto",
            top: phone ? "auto" : "-250px",
            left: phone ? "auto" : "-450px",
          }}
        >
          <FilmEmbed />
        </div>

        {/* text to the right of the film — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-600px",
              left: phone ? "auto" : "790px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.erasure}
          </p>
        </div>

        {/* medanpenang.jpg below the film — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <img
            src={asset("/medanpenang.jpg")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-400px",
              left: phone ? "auto" : "850px",
              width: phone ? "100%" : "720px",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* text below medanpenang.jpg — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-480px",
              left: phone ? "auto" : "1350px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.tracing}
          </p>
        </div>

        {/* 333.jpg + 777.jpg — stacked under everything (normal flow); side by side on phone */}
        <div
          style={{
            display: phone ? "flex" : "contents",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginTop: phone ? "12px" : undefined,
          }}
        >
        <img
          src={asset("/333.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            // phone: 333 is 2:3 and 777 is 3:2, so widths of 28% and 63% give
            // both the same height (42% of the row), with 9% left between them
            width: phone ? "28%" : "100%",
            maxWidth: phone ? "none" : "150px",
            height: "auto",
            margin: phone ? 0 : "40px auto 0 auto",
            position: "relative",
            left: phone ? "auto" : "-600px",
            top: phone ? "auto" : "-200px",
          }}
        />
        <img
          src={asset("/777.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: phone ? "63%" : "100%",
            maxWidth: phone ? "none" : "300px",
            height: "auto",
            margin: phone ? 0 : "40px auto 0 auto",
            position: "relative",
            left: phone ? "auto" : "-400px",
            top: phone ? "auto" : "-200px",
          }}
        />
        </div>
        <img
          src={asset("/appa.png")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "380px",
            height: "auto",
            margin: phone ? "12px auto 0 auto" : "40px auto 0 auto",
            /* flush to the right margin: centred left is 623.5, so +623.5 puts the
               380px image's right edge on the 1627px content edge. */
            position: "relative",
            left: phone ? "auto" : "623.5px",
            top: phone ? "auto" : "-200px",
          }}
        />

        {/* modelmalacca.jpg — side by side with appa.png, to its left and
            top-aligned. Absolutely placed inside a zero-height wrapper so adding
            it shifts nothing else. The wrapper sits at appa's flow bottom; appa is
            pulled up 200px and renders 617px tall at 380px wide, so its visible
            top is at -817. appa now starts at 1247 in wrapper coords, so a 380px
            image with a 24px gap starts at 843.5. */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <img
            src={asset("/modelmalacca.jpg")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-607px",
              left: phone ? "auto" : "843.5px",
              display: "block",
              width: phone ? "100%" : "380px",
              height: "auto",
            }}
          />
        </div>

        {/* text next to 777 — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-1000px",
              left: phone ? "auto" : "700px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.apparatus}
          </p>
        </div>

        {/* penangmedangif.gif — below all (normal flow) */}
        <img
          src={asset("/penangmedangif.gif")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "540px",
            height: "auto",
            margin: phone ? "12px auto 0 auto" : "40px auto 0 auto",
            position: "relative",
            left: phone ? "auto" : "-400px",
            top: phone ? "auto" : "-750px",
          }}
        />

        {/* text below penangmedangif — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-720px",
              left: phone ? "auto" : "0px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.mirrored}
          </p>
        </div>

        {/* shoptax.jpg — below the gif (normal flow) */}
        <img
          src={asset("/shoptax.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "680px",
            height: "auto",
            margin: phone ? "12px 0 0 0" : "40px auto 0 auto",
            position: "relative",
            left: phone ? "auto" : "-400px",
            top: phone ? "auto" : "-600px",
          }}
        />

        {/* text below shoptax — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-1050px",
              left: phone ? "auto" : "800px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.trade}
          </p>
        </div>

        {/* shophousediagram.jpg — under everything (normal flow) */}
        <img
          src={asset("/shophousediagram.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "680px",
            height: "auto",
            margin: phone ? "12px 0 0 0" : "40px auto 0 auto",
            position: "relative",
            left: phone ? "auto" : "400px",
            top: phone ? "auto" : "-1100px",
          }}
        />

        {/* mod1/2/3 — staggered row under everything (normal flow) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: phone ? "space-between" : "center",
            gap: phone ? "6px" : "48px",
            // `auto` side margins make a flex item shrink-to-fit rather than
            // stretch, which would collapse the percentage-width children
            margin: phone ? "0" : "40px auto 0 auto",
            width: phone ? "100%" : undefined,
            position: "relative",
            top: phone ? "auto" : "-1050px",
            left: phone ? "auto" : "500px",
          }}
        >
          <img src={asset("/mod1.png")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "165px", height: "auto", marginTop: phone ? 0 : "0px" }} />
          <img src={asset("/mod3.png")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "165px", height: "auto", marginTop: phone ? 0 : "60px" }} />
          <img src={asset("/mod2.png")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: phone ? "32%" : "165px", height: "auto", marginTop: phone ? 0 : "120px" }} />
        </div>

        {/* explode.jpg — under everything (normal flow) */}
        <img
          src={asset("/explode.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "940px",
            height: "auto",
            margin: phone ? "12px 0 0 0" : "40px auto 0 auto",
            position: "relative",
            top: phone ? "auto" : "-1200px",
            left: phone ? "auto" : "-300px",
          }}
        />

        {/* malaccaplan.jpg — under explode (normal flow) */}
        <img
          src={asset("/frontrender.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "840px",
            height: "auto",
            margin: phone ? "12px 0 0 0" : "40px auto 0 auto",
            position: "relative",
            top: phone ? "auto" : "-1200px",
            left: phone ? "auto" : "200px",
          }}
        />

        {/* text under frontrender.jpg — zero-height wrapper so no image shifts.
            The wrapper sits at frontrender's flow bottom; frontrender is pulled up
            1200px, so -1200 + 24 lands 24px below its visible bottom. left 593.5
            is frontrender's own left edge (centred 393.5 + its 200px offset). */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-1176px",
              left: phone ? "auto" : "593.5px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.ornament}
          </p>
        </div>

        {/* malaccaplan.jpg — under frontrender (normal flow) */}
        <img
          src={asset("/malaccaplan.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "700px",
            height: "auto",
            margin: phone ? "12px 0 0 0" : "40px auto 0 auto",
          }}
        />

        {/* workshop.jpg — below frontrender (normal flow) */}
        <img
          src={asset("/workshop.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: phone ? "none" : "700px",
            height: "auto",
            margin: phone ? "12px 0 0 0" : "40px auto 0 auto",
            position: "relative",
            top: phone ? "auto" : "-1420px",
            left: phone ? "auto" : "-220px",
          }}
        />

        {/* text above workshop.jpg — zero-height wrapper so no image shifts.
            The wrapper sits at workshop's flow bottom; workshop is pulled up
            1420px and is 393.75px tall (700px wide, 16:9), so its visible top
            is at -1813.75. Anchored by `bottom` so the text ends 24px above that
            whatever its line count. left 233.5 = workshop's left edge (centred
            463.5 − its 220px offset) − 10. */}
        <div style={{ position: "relative", height: phone ? "auto" : 0 }}>
          <p
            style={{
              position: phone ? "static" : "absolute",
              bottom: phone ? "auto" : "1837.75px",
              left: phone ? "auto" : "233.5px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.workshop}
          </p>
        </div>

        {/* archive.gif (second instance) + its text — below the workshop text.
            Both absolutely placed in a zero-height wrapper so no image shifts.
            Wrapper origin is workshop's flow bottom: the workshop text ends at
            -1331, the gif sits 40px below it (315px tall at 560px wide), and its
            text 24px under that. left 263.5 matches workshop's left edge. */}
        <div style={{ position: "relative", height: phone ? "auto" : 0, display: phone ? "flex" : "block", flexDirection: "column", gap: phone ? "12px" : undefined }}>
          <img
            src={asset("/archive.gif")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-1291px",
              left: phone ? "auto" : "263.5px",
              display: "block",
              width: phone ? "100%" : "560px",
              height: "auto",
            }}
          />
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-952px",
              left: phone ? "auto" : "263.5px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.archive}
          </p>

          {/* panelrender.jpg + its text — under the archive gif, in the empty
              band left by workshop being pulled up. Kept to 340px wide / left 100
              so the portrait render clears malaccaplan.jpg (which starts at x
              463.5) and still ends above the flow bottom, so the page height and
              bottom margin are unchanged. */}
          <img
            src={asset("/panel2.gif")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-845px",
              left: phone ? "auto" : "100px",
              display: "block",
              width: phone ? "100%" : "340px",
              height: "auto",
            }}
          />
          <p
            style={{
              position: phone ? "static" : "absolute",
              top: phone ? "auto" : "-216px",
              left: phone ? "auto" : "100px",
              width: phone ? "100%" : "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            {TEXT.castings}
          </p>
        </div>
      </div>
    </div>
  );
}
