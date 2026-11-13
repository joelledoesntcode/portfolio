import React, { useState, useEffect, useRef } from "react";
import { asset } from "../lib/asset";

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

export default function ProjectProfile({ title }: { title: string }) {
  // Facade: show a clean poster + play button until clicked, then load the
  // YouTube player. Keeps the preview free of the YouTube logo/title.
  const [playing, setPlaying] = useState(false);

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

  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
        height: innerHeight ? `${innerHeight * scale}px` : undefined,
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: `${DESIGN_WIDTH}px`,
          marginLeft: `${marginLeft}px`,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          boxSizing: "border-box",
          padding: "40px 40px 80px 40px",
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
            width: "19.5%",
            paddingRight: "24px",
            boxSizing: "border-box",
          }}
        >
          {title}
        </h1>

        {/* project metadata — under the title, before the intro subtext */}
        <div
          style={{
            width: "19.5%",
            paddingRight: "24px",
            boxSizing: "border-box",
            margin: "0 0 16px 0",
          }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
            medan, indonesia
          </p>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
            masters project year 1
          </p>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
            diploma 5, architectural association
          </p>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
            unit masters: nana biamah ofosu, giles tettey nartey
          </p>
        </div>

        {/* intro subtext — matches other projects' description column */}
        <div
          style={{
            width: "19.5%",
            paddingRight: "24px",
            boxSizing: "border-box",
            margin: "0 0 32px 0",
          }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: "0 0 12px 0" }}>
            The Malacca Strait, between the Indonesian and Malaysian archipelago,
            constitutes a boundary produced through successive layers of mercantile
            inscription. From these transactional ecologies emerged a diasporic
            Peranakan identity, indigenous to the strait itself.
          </p>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: "0 0 12px 0" }}>
            Colonial and postcolonial borders severed these trade routes, while
            persecution and cultural suppression fractured the community, leaving
            its buildings abandoned and in decay.
          </p>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}>
            The proposal is a contemporary clan house that restores street-level
            commerce and adds a selectively accessed archive of ancestral memory,
            enabling the community to rewrite its own spatial history.
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
            maxWidth: "560px",
            height: "auto",
            margin: "0 auto",
            position: "relative",
            left: "420px",
            top: "-250px",
          }}
        />

        {/* silk1/2/3 — small squares next to archive.gif (zero-height wrapper, no shift) */}
        <div style={{ position: "relative", height: 0 }}>
          <div
            style={{
              position: "absolute",
              top: "-550px",
              left: "430px",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: "28px",
            }}
          >
            <img src={asset("/silk1.jpg")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "120px", height: "120px", objectFit: "cover", marginTop: "0px" }} />
            <img src={asset("/silk2.jpg")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "120px", height: "120px", objectFit: "cover", marginTop: "45px" }} />
            <img src={asset("/silk3.jpg")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "120px", height: "120px", objectFit: "cover", marginTop: "90px" }} />
          </div>
        </div>

        {/* text block below archive.gif — same width as other projects' middle subtext */}
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 300,
            textAlign: "justify",
            width: "19.5%",
            paddingRight: "24px",
            boxSizing: "border-box",
            margin: "0 auto 0 0",
            position: "relative",
            left: "800px",
            top: "-50px",
            zIndex: 5,
          }}
        >
          Zheng He’s 15th century Silk Road voyages carried Chinese trade into
          Southeast Asia. Merchants who stayed blended their traditions with the
          local Malay, creating Peranakan culture: people born of the strait.
        </p>

        {/* text above col.gif — zero-height wrapper so it doesn't shift any image */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "180px",
              left: "50px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            The British took Malaya, the Dutch took Indonesia; a fluid corridor
            was split between rival empires. The old informal movements across
            the strait were overwritten, and the strait became a tool of divide
            and conquer.
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
            maxWidth: "980px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            top: "300px",
            left: "-200px",
          }}
        />

        {/* text to the right of col.gif — zero-height wrapper so no other image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "250px",
              left: "1150px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            Peranakan enclaves gathered in Penang and Medan: twin cities across
            the water, split by rival colonial hands and absorbed into the same
            extractive machine.
          </p>
        </div>

        {/* extract.jpg below col.gif — zero-height wrapper so no other image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <img
            src={asset("/extract.jpg")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              top: "380px",
              left: "800px",
              width: "740px",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* text above 111 — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "450px",
              left: "50px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            Then independence came, and with redefining national identity,
            Malaysia chose preservation, while Indonesia systematically erased
            Chinese language and culture.
          </p>
        </div>

        {/* 111/222/333 — row to the left of extract.jpg (zero-height wrapper, no shift) */}
        <div style={{ position: "relative", height: 0 }}>
          <div
            style={{
              position: "absolute",
              top: "580px",
              left: "200px",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <img src={asset("/111.gif")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "140px", height: "auto" }} />
            <img src={asset("/222.gif")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "140px", height: "auto" }} />
            <img src={asset("/333.gif")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "140px", height: "auto" }} />
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
            maxWidth: "740px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            top: "-914px",
            left: "-350px",
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
            maxWidth: "380px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            top: "-1193px",
            left: "600px",
          }}
        />

        {/* film — under everything */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "740px",
            paddingTop: "min(56.25%, 416px)",
            margin: "80px auto 0 auto",
            top: "-250px",
            left: "-450px",
          }}
        >
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
        </div>

        {/* text to the right of the film — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "-600px",
              left: "790px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            Erasure follows rewriting, especially when someone else holds the
            pen. As culture retreats into the home, the altar table becomes the
            last reminder of belonging.
          </p>
        </div>

        {/* medanpenang.jpg below the film — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <img
            src={asset("/medanpenang.jpg")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              top: "-400px",
              left: "850px",
              width: "720px",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* text below medanpenang.jpg — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "-480px",
              left: "1350px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            When tracing enclaves through surviving buildings and family
            accounts, the two cities diverge. In Penang, heritage sits inside the
            city grid. In Medan, they are pushed to the margins.
          </p>
        </div>

        {/* 333.jpg + 777.jpg — stacked under everything (normal flow) */}
        <img
          src={asset("/333.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "150px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            left: "-600px",
            top: "-200px",
          }}
        />
        <img
          src={asset("/777.jpg")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "300px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            left: "-400px",
            top: "-200px",
          }}
        />
        <img
          src={asset("/appa.png")}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "380px",
            height: "auto",
            margin: "40px auto 0 auto",
            /* flush to the right margin: centred left is 623.5, so +623.5 puts the
               380px image's right edge on the 1627px content edge. */
            position: "relative",
            left: "623.5px",
            top: "-200px",
          }}
        />

        {/* modelmalacca.jpg — side by side with appa.png, to its left and
            top-aligned. Absolutely placed inside a zero-height wrapper so adding
            it shifts nothing else. The wrapper sits at appa's flow bottom; appa is
            pulled up 200px and renders 617px tall at 380px wide, so its visible
            top is at -817. appa now starts at 1247 in wrapper coords, so a 380px
            image with a 24px gap starts at 843.5. */}
        <div style={{ position: "relative", height: 0 }}>
          <img
            src={asset("/modelmalacca.jpg")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              top: "-607px",
              left: "843.5px",
              display: "block",
              width: "380px",
              height: "auto",
            }}
          />
        </div>

        {/* text next to 777 — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "-1000px",
              left: "700px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            an apparatus reinterpreting the peranakan ancestral altar. a colonial
            map lies on the lower tier over a lightbox, memories are drawn on the
            surface. lived experience is layered over fixed colonial cartography
            and the two read as one.
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
            maxWidth: "540px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            left: "-400px",
            top: "-750px",
          }}
        />

        {/* text below penangmedangif — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "-720px",
              left: "0px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            the malacca strait once mirrored a shared identity between penang and
            medan. the project seeks to mend this fracture and return agency to
            peranakan communities on both shores.
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
            maxWidth: "680px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            left: "-400px",
            top: "-600px",
          }}
        />

        {/* text below shoptax — zero-height wrapper so no image shifts */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "-1050px",
              left: "800px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            Trade defined the rhythms, hierarchies, and social fabric of
            Peranakan life, producing an architecture where livelihood and
            identity were structurally bound.
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
            maxWidth: "680px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            left: "400px",
            top: "-1100px",
          }}
        />

        {/* mod1/2/3 — staggered row under everything (normal flow) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "48px",
            margin: "40px auto 0 auto",
            position: "relative",
            top: "-1050px",
            left: "500px",
          }}
        >
          <img src={asset("/mod1.png")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "165px", height: "auto", marginTop: "0px" }} />
          <img src={asset("/mod3.png")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "165px", height: "auto", marginTop: "60px" }} />
          <img src={asset("/mod2.png")} alt="" loading="lazy" decoding="async" style={{ display: "block", width: "165px", height: "auto", marginTop: "120px" }} />
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
            maxWidth: "940px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            top: "-1200px",
            left: "-300px",
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
            maxWidth: "840px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            top: "-1200px",
            left: "200px",
          }}
        />

        {/* text under frontrender.jpg — zero-height wrapper so no image shifts.
            The wrapper sits at frontrender's flow bottom; frontrender is pulled up
            1200px, so -1200 + 24 lands 24px below its visible bottom. left 593.5
            is frontrender's own left edge (centred 393.5 + its 200px offset). */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "-1176px",
              left: "593.5px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            Peranakan identity lived in ornament laid over colonial buildings,
            impermanent and easily stripped away. What happens when ornament
            becomes load-bearing, and culture is carved into the structure
            instead of painted onto it?
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
            maxWidth: "700px",
            height: "auto",
            margin: "40px auto 0 auto",
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
            maxWidth: "700px",
            height: "auto",
            margin: "40px auto 0 auto",
            position: "relative",
            top: "-1400px",
            left: "-200px",
          }}
        />

        {/* text under workshop.jpg — zero-height wrapper so no image shifts.
            The wrapper sits at workshop's flow bottom; workshop is pulled up
            1400px, so -1400 + 24 lands 24px below its visible bottom. left 263.5
            is workshop's own left edge (centred 463.5 − its 200px offset). */}
        <div style={{ position: "relative", height: 0 }}>
          <p
            style={{
              position: "absolute",
              top: "-1376px",
              left: "263.5px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            Synonymous to the apparatus, the workshop is a site of active
            re-inscription, a space to protect cultural arts made by and for the
            community.
          </p>
        </div>

        {/* archive.gif (second instance) + its text — below the workshop text.
            Both absolutely placed in a zero-height wrapper so no image shifts.
            Wrapper origin is workshop's flow bottom: the workshop text ends at
            -1331, the gif sits 40px below it (315px tall at 560px wide), and its
            text 24px under that. left 263.5 matches workshop's left edge. */}
        <div style={{ position: "relative", height: 0 }}>
          <img
            src={asset("/archive.gif")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              top: "-1291px",
              left: "263.5px",
              display: "block",
              width: "560px",
              height: "auto",
            }}
          />
          <p
            style={{
              position: "absolute",
              top: "-952px",
              left: "263.5px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            The archive lines the clan house's inner walls, holding ancestral
            tablets and family artefacts that anchor the community's shared
            identity. Carefully placed windows veil the facade, so outsiders can
            glimpse what lies within but never fully enter.
          </p>

          {/* panelrender.jpg + its text — under the archive gif, in the empty
              band left by workshop being pulled up. Kept to 340px wide / left 100
              so the portrait render clears malaccaplan.jpg (which starts at x
              463.5) and still ends above the flow bottom, so the page height and
              bottom margin are unchanged. */}
          <img
            src={asset("/panelrender.jpg")}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              top: "-845px",
              left: "100px",
              display: "block",
              width: "340px",
              height: "auto",
            }}
          />
          <p
            style={{
              position: "absolute",
              top: "-216px",
              left: "100px",
              width: "19.5%",
              paddingRight: "24px",
              boxSizing: "border-box",
              fontSize: "0.7rem",
              fontWeight: 300,
              textAlign: "justify",
              margin: 0,
              zIndex: 5,
            }}
          >
            Detachable castings with family trees are placed on the inside of the
            archive.
          </p>
        </div>
      </div>
    </div>
  );
}
