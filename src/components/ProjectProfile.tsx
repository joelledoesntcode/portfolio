import React, { useState } from "react";
import { asset } from "../lib/asset";

// The title for this project is rendered by App.tsx (left column).
const VIDEO_ID = "DjP4-UcvrB8";

export default function ProjectProfile({ title }: { title: string }) {
  // Facade: show a clean poster + play button until clicked, then load the
  // YouTube player. Keeps the preview free of the YouTube logo/title.
  const [playing, setPlaying] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
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
          Colonial and postcolonial territorial reorganisation severed these
          trade circuits; ethnic persecution and cultural suppression fractured
          the community, precipitating the abandonment and dilapidation of its
          built fabric.
        </p>
        <p style={{ fontSize: "0.7rem", fontWeight: 300, textAlign: "justify", margin: 0 }}>
          The proposal revitalises these structures as a contemporary clan
          house, reinstating commerce at the street threshold while embedding a
          collective cultural archive where artefacts and ancestral memory are
          selectively accessed, enabling the community to reinscribe its own
          spatial historiography.
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
        At the height of the maritime Silk Road, Zheng He's fifteenth-century
        voyages extended China's trade into Southeast Asia. Some Chinese
        merchants stayed, intertwining their traditions with local Malay
        communities. From this exchange emerged Peranakan culture. meaning,
        people born of the strait.
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
          The British settled Malaysia. The Dutch took Indonesia. A fluid
          corridor was divided between competing empires. The foreign empires
          overwrote the pre-existing informal mobilities of the Strait. The
          strait was reorganised into a strategy to divide and conquer.
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
          Peranakan enclaves thickened around two key ports: Penang and Medan.
          Two cities facing each other across the water, shaped by the same
          networks, pulled by different colonial hands. both became central
          nodes in the extractive machine, organised entirely by the logic of
          colonial commodification.
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
          Then independence arrived. With it, the hunger to reinscribe national
          identity. Culture became a tool of differentiation. Penang turned
          toward preservation. Across the Strait, Indonesia's government
          systematically erased Peranakan identity, names, language, and
          culture.
        </p>
      </div>

      {/* 111/222/333 — column to the left of extract.jpg (zero-height wrapper, no shift) */}
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

      {/* movement.jpg — standalone, original size/position */}
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
          Erasure is an inevitable effect of re-inscription, especially when the
          hand drawing the lines are held by someone else. Where cultural nodes
          shrink back into the domestic space, the altar table is the only
          surviving reminder of belonging.
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
            top: "120px",
            left: "550px",
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
          In modern day, tracing enclaves from surviving buildings and ancestral
          accounts, a difference in geography emerges. Heritage is embedded in
          Penang's grid, whereas temples and clan houses were pushed to Medan's
          margins.
        </p>
      </div>
    </div>
  );
}
