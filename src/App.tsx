import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { a as aWeb, useSpring as useWebSpring } from "@react-spring/web";
import { OrbitControls, useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import ProjectProfile from "./components/ProjectProfile";
import ProjectPilgrim from "./components/ProjectPilgrim";
import ProjectFishMarket from "./components/ProjectFishMarket";
import ProjectPTF from "./components/ProjectPTF";
import ProjectOmah from "./components/ProjectOmah";
import ProjectCover from "./components/ProjectCover";
import { asset } from "./lib/asset";
import { BG_COLOR } from "./lib/theme";
import { usePhone } from "./lib/usePhone";
import LoadingScreen from "./components/LoadingScreen";

const CUBE_SIZE = 11;
const UNFOLD_MULTIPLIER = 1.4;
const DASH_SIZE = CUBE_SIZE * 0.06;
const GAP_SIZE = CUBE_SIZE * 0.035;
const LINE_COLOR = "#888888";
const EDGE_COLOR = "#000000";
const ACCENT_RED = "#8d0104";
const LINE_OPACITY = 1;

type Project = {
  title: string;
  description: string;
  images: {
    src: string;
    caption: string;
    hero?: boolean;
    scale?: number;
    /** on phones, images sharing this tag sit side by side (see CollageCanvas) */
    pair?: string;
    /** on phones, width as a % of the space available (see CollageCanvas) */
    phoneWidth?: number;
    /** within a phone pair, sit against the top or bottom of the row */
    phoneAlign?: "top" | "bottom";
    /** within a phone pair, push down by this % of the row width (stagger) */
    phoneOffsetY?: number;
    /** push the pair to opposite edges of its row on phones */
    phoneRowSpread?: boolean;
    /** extra row height on phones, as a % of its width */
    phoneRowExtraHeight?: number;
    /** on phones, order as if the cell sat at this vh (see CollageCanvas) */
    phoneOrder?: number;
  }[];
};

type FaceProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  unfoldPosition: [number, number, number];
  unfoldRotation: [number, number, number];
  unfold: boolean;
  texture: string;
  project: Project;
  onClickFace: (project: Project) => void;
  unfoldCube: () => void;
  isUnfolded: boolean;
  /** this face is currently the one closest to the camera */
  isNearest: boolean;
  /** lets the cube measure this face's world position each frame */
  registerRef: (g: THREE.Group | null) => void;
  entrance: any;
};

// --- helper for dashed lines ---
function setDashDistances(geom: THREE.BufferGeometry) {
  const pos = geom.attributes.position as THREE.BufferAttribute;
  const count = pos.count;
  const distances = new Float32Array(count);
  for (let i = 0; i < count; i += 2) {
    const sx = pos.getX(i),
      sy = pos.getY(i),
      sz = pos.getZ(i);
    const ex = pos.getX(i + 1),
      ey = pos.getY(i + 1),
      ez = pos.getZ(i + 1);
    const dx = ex - sx,
      dy = ey - sy,
      dz = ez - sz;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    distances[i] = 0;
    distances[i + 1] = len;
  }
  geom.setAttribute("lineDistance", new THREE.BufferAttribute(distances, 1));
}

// --- dotted outline of one face ---
function FaceDottedEdges({ size, opacity }: { size: number; opacity: number }) {
  const geom = useMemo(
    () => new THREE.EdgesGeometry(new THREE.PlaneGeometry(size, size)),
    [size]
  );
  useEffect(() => {
    setDashDistances(geom);
  }, [geom]);
  return (
    <a.lineSegments geometry={geom}>
      <a.lineDashedMaterial
        color={EDGE_COLOR}
        dashSize={DASH_SIZE}
        gapSize={GAP_SIZE}
        transparent
        opacity={opacity}
      />
    </a.lineSegments>
  );
}

// --- one cube face ---
function Face({
  position,
  rotation,
  unfoldPosition,
  unfoldRotation,
  unfold,
  texture,
  project,
  onClickFace,
  unfoldCube,
  isUnfolded,
  isNearest,
  registerRef,
  entrance,
}: FaceProps) {
  const [hovered, setHovered] = useState(false);

  // The miscellaneous and Malacca Strait tiles have no cover image and show
  // only their text + dotted edges, so nothing on them may paint — neither the
  // blank panel nor the backing behind it.
  const blankTile =
    project.title === "miscellaneous" ||
    project.title.startsWith("Waters of Unfinished Maps");

  const { pos, rot, edgeOpacity } = useSpring({
    pos: unfold ? unfoldPosition : position,
    rot: unfold ? unfoldRotation : rotation,
    edgeOpacity: unfold ? LINE_OPACITY : 0,
    config: { tension: 140, friction: 18 },
  });

  // small "lift" scale when hovering a panel — only once the cube is unfolded
  const { scale } = useSpring({
    scale: isUnfolded && hovered ? 1.2 : 1,
    config: { tension: 220, friction: 18 },
  });

  return (
    <a.group
      ref={registerRef}
      position={pos}
      rotation={rot as THREE.EulerTuple}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (isUnfolded) onClickFace(project);
        else unfoldCube();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      className="canvas-face"
    >
      {/* Opaque backing so the folded cube reads as a solid box rather than a
          wireframe. FrontSide (not DoubleSide) so it is culled when a panel is
          seen from behind — otherwise it would hide that panel's drawing.
          Skipped entirely on the blank tiles, which stay see-through. */}
      {!blankTile && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[CUBE_SIZE, CUBE_SIZE]} />
          <a.meshBasicMaterial
            transparent
            opacity={entrance}
            side={THREE.FrontSide}
            color={BG_COLOR}
          />
        </mesh>
      )}
      <mesh>
        <planeGeometry args={[CUBE_SIZE, CUBE_SIZE]} />
        {texture ? (
          <TexturedFaceMaterial texture={texture} entrance={entrance} />
        ) : (
          // blank panel — no image yet. The miscellaneous and Malacca Strait
          // tiles stay fully transparent (only text + dotted edges show);
          // any other blank face is white.
          <a.meshBasicMaterial
            transparent
            opacity={blankTile ? 0 : entrance}
            side={THREE.DoubleSide}
            color={BG_COLOR}
          />
        )}
      </mesh>
      {project.title === "miscellaneous" && (
        <Text
          position={[0, 0, 0.01]}
          font={asset("/open-sans-300.woff")}
          fontSize={CUBE_SIZE * 0.125}
          color="#333"
          anchorX="center"
          anchorY="middle"
        >
          ???
        </Text>
      )}
      <FaceDottedEdges
        size={CUBE_SIZE}
        opacity={edgeOpacity as unknown as number}
      />
      {(hovered || isNearest) && (
        <Text
          position={[-CUBE_SIZE / 2, -CUBE_SIZE / 2 - 0.45, 0.01]}
          font={asset("/open-sans-300.woff")}
          fontSize={0.45}
          color="#333"
          anchorX="left"
          anchorY="top"
          maxWidth={CUBE_SIZE * 1.6}
        >
          {project.title}
        </Text>
      )}
    </a.group>
  );
}

// --- material that loads a face's texture (kept separate so the texture
// hook only runs for faces that actually have an image) ---
function TexturedFaceMaterial({
  texture,
  entrance,
}: {
  texture: string;
  entrance: any;
}) {
  const tex = useTexture(asset(texture));
  return (
    <a.meshBasicMaterial
      map={tex}
      transparent
      opacity={entrance}
      alphaTest={0.1}
      side={THREE.DoubleSide}
      color={BG_COLOR}
    />
  );
}

// --- dotted box when folded ---
function BoxDottedEdges({ opacity }: { opacity: number }) {
  const geom = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
      ),
    []
  );
  useEffect(() => {
    setDashDistances(geom);
  }, [geom]);
  return (
    <a.lineSegments geometry={geom}>
      <a.lineDashedMaterial
        color={EDGE_COLOR}
        dashSize={DASH_SIZE}
        gapSize={GAP_SIZE}
        transparent
        opacity={opacity}
      />
    </a.lineSegments>
  );
}

// --- cube wrapper ---
function Cube({
  onSelect,
  unfold,
  setUnfold,
  onProjects,
}: {
  onSelect: (project: Project) => void;
  unfold: boolean;
  setUnfold: (v: boolean) => void;
  onProjects?: (projects: Project[]) => void;
}) {
  const half = CUBE_SIZE / 2;
  const spread = CUBE_SIZE * UNFOLD_MULTIPLIER;

  const { bounceY, entrance } = useSpring({
    from: { bounceY: 20, entrance: 0 },
    to: { bounceY: 0, entrance: 1 },
    config: { mass: 1, tension: 190, friction: 10 },
  });

  const { boxOpacity } = useSpring({
    from: { boxOpacity: 0 },
    boxOpacity: unfold ? 0 : LINE_OPACITY,
    config: { tension: 140, friction: 18 },
  });

  // Track which face is currently closest to the camera, so the cube always
  // names the project the viewer is looking at (not just the hovered one).
  const faceRefs = useRef<(THREE.Group | null)[]>([]);
  const [nearest, setNearest] = useState<number | null>(null);
  const probe = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    let best = -1;
    let bestDistance = Infinity;
    faceRefs.current.forEach((g, i) => {
      if (!g) return;
      g.getWorldPosition(probe);
      const d = probe.distanceTo(camera.position);
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    // Hysteresis: two faces can sit at almost the same distance while the cube
    // turns, and switching on every frame would re-render the whole cube. Only
    // hand over once the new face is clearly in front.
    if (best === -1 || best === nearest) return;
    const current = faceRefs.current[nearest ?? -1];
    if (current) {
      current.getWorldPosition(probe);
      if (bestDistance > probe.distanceTo(camera.position) * 0.98) return;
    }
    setNearest(best);
  });

  const faces = [
    {
      position: [0, 0, half],
      rotation: [0, 0, 0],
      unfoldPosition: [0, 0, spread],
      unfoldRotation: [0, 0, 0],
      texture: "/ante.png",
      project: {
        title: "Ode to the Modern Pilgrim",
        description:
          "We have an innate desire to shape the earth for our own, echoing our ancestral pilgrims’ relentless pursuit of innovation. Now, we are simply contemporary travellers, finding spaces we can control in a city so unforgiving to ownership of our environment. <br/><br/>My proposal pays tribute to the drive to transform the earth, through an adaptable tower that invites users to shape their environment - an exploration of the human condition. <br/><br/>The Earthwork theme invited me to engage with the site’s layered history—Roman tracks and ancient brick culverts. <br/><br/>Inspired by Roman engineers, the “Fathers of Trusses,” and Canterbury builders who raised cathedrals, I reflected on humanity’s timeless pursuit of progress and creation.",
        images: [
          { src: "/antecollage.png", caption: "", scale: 1.8 },
          { src: "/culv1.jpg", caption: "Wooden beam from Roman railway", scale: 0.85, pair: "roman", phoneWidth: 40, phoneAlign: "top" as const },
          { src: "/culv2.jpg", caption: "Roman culvert", scale: 0.42, pair: "roman", phoneWidth: 36, phoneAlign: "bottom" as const, phoneRowSpread: true, phoneRowExtraHeight: 10 },
          { src: "/mainante.png", caption: "Mhehehe", scale: 1.05 },
          { src: "/1.PNG", caption: "", pair: "sketches-a" },
          { src: "/2.PNG", caption: "", pair: "sketches-a" },
          { src: "/3.png", caption: "", pair: "sketches" },
          { src: "/4.png", caption: "", pair: "sketches" },
          { src: "/backrrender.png", caption: "", scale: 0.8 },
        ],
      },
    },
    {
      position: [0, 0, -half],
      rotation: [0, Math.PI, 0],
      unfoldPosition: [0, 0, -spread],
      unfoldRotation: [0, Math.PI, 0],
      texture: "/berg.png",
      project: {
        title: "Røyk — A Bergen Fish Market",
        description:
          "This market celebrates the art of smoking fish, a cultural practice revered in Bergen. The design aims to capture the beauty of communal dining and the magic of food preparation. The structure aspires to exist as a unique modern building among its historical surroundings while referencing the site’s vernacular architecture. It is centered around placemaking, inviting in the whole community.",
        images: [
          { src: "/undergif.gif", caption: "", hero: true },
          { src: "/siteplanberg2.jpg", caption: "", pair: "berg-site" },
          { src: "/vern3.png", caption: "", pair: "berg-site" },
          { src: "/harberg.jpg", caption: "", hero: true },
          { src: "/bergsketch.jpg", caption: "", phoneWidth: 70 },
          { src: "/model.png", caption: "" },
          { src: "/axo berg.jpg", caption: "" },
          { src: "/filletberg.jpg", caption: "" },
          { src: "/back berg.jpg", caption: "", hero: true, phoneOrder: 41 },
        ],
      },
    },

    {
      position: [0, half, 0],
      rotation: [-Math.PI / 2, 0, 0],
      unfoldPosition: [0, spread, 0],
      unfoldRotation: [-Math.PI / 2, 0, 0],
      texture: "", // blank panel until a replacement image is chosen
      project: {
        title: "Waters of Unfinished Maps: Reinscribing the Malacca Strait",
        description: `As a dedicated part 1...`,
        images: [
          { src: "/joelleprofile.jpg", caption: "" },
          { src: "/joelleprofile2.jpg", caption: "" },
        ],
      },
    },
    {
      position: [0, -half, 0],
      rotation: [Math.PI / 2, 0, 0],
      unfoldPosition: [0, -spread, 0],
      unfoldRotation: [Math.PI / 2, 0, 0],
      texture: "/ptf.png",
      project: {
        title: "Peter Tatchell Foundation",
        description:
          "Peter Tatchell has dedicated his activist career to championing LGBTQIA+ rights through his foundation. The institution needs expanding, including an exhibition of his activism, a historical archive, and an office space.<br/><br/>The design aimed to embody queer identity—a monument standing boldly. It is a sanctuary for the LGBTQIA+ and an inclusive educational space for all. It is a statement of activism and a tribute to Tatchell’s unwavering dedication for a more equitable world.",
        images: [
          { src: "/bigsiteptf.png", caption: "Site — the King's Arms, Salford / Manchester", scale: 1.3 },
          { src: "/kingsarms.png", caption: "The existing King's Arms pub", scale: 0.5 },
          { src: "/kingsarms2.png", caption: "King's Arms — existing fabric", scale: 0.5 },
          { src: "/kingsarms3.png", caption: "King's Arms Ale House", scale: 0.5 },
          { src: "/sketchcompilation2.png", caption: "Initial sketches — 'squaring the circle'", scale: 1.2 },
          { src: "/diaptf.jpg", caption: "Concept — the visitor journey", scale: 0.85 },
          { src: "/ptfmodel.PNG", caption: "Site model" },
          { src: "/ptfgf.png", caption: "Ground floor plan", scale: 1.9 },
          { src: "/technical.jpg", caption: "Retrofit construction detail", scale: 1.2 },
          { src: "/joelle_warsono_portfolio_Page_13.jpg", caption: "Locally sourced stone — minimised emissions" },
          { src: "/highlevel.png", caption: "Aerial view in context" },
          { src: "/exhi.png", caption: "Exhibition space", scale: 1.45 },
          { src: "/officenew.png", caption: "Office space", scale: 2 },
          { src: "/roofrender.png", caption: "The monument in its greenspace" },
        ],
      },
    },
    {
      position: [half, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      unfoldPosition: [spread, 0, 0],
      unfoldRotation: [0, Math.PI / 2, 0],
      texture: "/omah.png",
      project: {
        title: "Omah Mimpi",
        description: "My proposal envisions a cultural hub to revitalize traditional trade with a sustainable model. Drawing from behavioural economics and gamification theory, it integrates competition and reward through community building to engage participants, fostering motivation for achievement.",
        images: [
          { src: "/omah1.gif", caption: "" },
          { src: "/omah3.gif?v=2", caption: "", scale: 1.3 },
          { src: "/omah_weave1.png", caption: "", pair: "weave", phoneWidth: 60 },
          { src: "/omah_weave2.PNG", caption: "", pair: "weave", phoneWidth: 30 },
          { src: "/omah_ver1.png", caption: "", pair: "ver" },
          { src: "/omah_ver2.png", caption: "", pair: "ver" },
          { src: "/omah_plan.png", caption: "" },
          { src: "/diaomah.jpg", caption: "", scale: 1.8 },
        ],
      },
    },
    {
      position: [-half, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      unfoldPosition: [-spread, 0, 0],
      unfoldRotation: [0, -Math.PI / 2, 0],
      texture: "", // no cover image — show a "?" in the middle instead
      project: {
        title: "miscellaneous",
        description: "Main description for Cover.",
        images: [],
      },
    },
  ];

  // report the ordered project list up to App (for "next project" navigation)
  useEffect(() => {
    onProjects?.(faces.map((f) => f.project as Project));
  }, []);

  return (
    <a.group position-y={bounceY}>
      {!unfold && <BoxDottedEdges opacity={boxOpacity as unknown as number} />}
      {faces.map((f, i) => (
        <Face
          key={i}
          position={f.position}
          rotation={f.rotation}
          unfoldPosition={f.unfoldPosition}
          unfoldRotation={f.unfoldRotation}
          unfold={unfold}
          texture={f.texture}
          project={f.project}
          onClickFace={(project) => onSelect(project)}
          unfoldCube={() => setUnfold(true)}
          isUnfolded={unfold}
          isNearest={nearest === i}
          registerRef={(g) => (faceRefs.current[i] = g)}
          entrance={entrance}
        />
      ))}
    </a.group>
  );
}

// --- small wireframe cube that tumbles (matches the dotted cube aesthetic) ---
// `size` is in em so the cube tracks the surrounding text height.
function RotatingCube({ size = 1 }: { size?: number }) {
  const half = size / 2;
  const face: React.CSSProperties = {
    position: "absolute",
    width: `${size}em`,
    height: `${size}em`,
    border: `1px dashed ${LINE_COLOR}`,
    boxSizing: "border-box",
  };
  return (
    <span
      style={{
        display: "inline-block",
        width: `${size}em`,
        height: `${size}em`,
        perspective: `${size * 3}em`,
        verticalAlign: "middle",
        marginLeft: "-1em",
        // the cube tumbles in 3D, so its corners sweep outside the 1em box —
        // leave enough clearance that it never clips into "next project"
        marginRight: "1.1em",
      }}
    >
      <span
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          animation: "spin-cube 4s linear infinite",
        }}
      >
        <span style={{ ...face, transform: `translateZ(${half}em)` }} />
        <span style={{ ...face, transform: `rotateY(180deg) translateZ(${half}em)` }} />
        <span style={{ ...face, transform: `rotateY(90deg) translateZ(${half}em)` }} />
        <span style={{ ...face, transform: `rotateY(-90deg) translateZ(${half}em)` }} />
        <span style={{ ...face, transform: `rotateX(90deg) translateZ(${half}em)` }} />
        <span style={{ ...face, transform: `rotateX(-90deg) translateZ(${half}em)` }} />
      </span>
    </span>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [unfold, setUnfold] = useState(false);
  const [showCV, setShowCV] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const phone = usePhone();
  // the project page is its own scroll container, so resetting scroll means scrolling this node
  const projectPageRef = useRef<HTMLDivElement | null>(null);

  // advance to the next project in cube order (wraps around)
  const goToNextProject = () => {
    if (!selectedProject || projects.length === 0) return;
    const idx = projects.findIndex((p) => p.title === selectedProject.title);
    const next = projects[(idx + 1) % projects.length];
    setSelectedProject(next);
    // jump back to the top of the new project page
    projectPageRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUnfold(false);
        setSelectedProject(null);
        setShowCV(false);
        setShowContact(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const popupSpring = useWebSpring({
    opacity: selectedProject ? 1 : 0,
    transform: selectedProject ? "translateY(0%)" : "translateY(5%)",
    config: { tension: 200, friction: 20 },
  });

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Fonts + Styles */}
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        html, body, #root { height: 100%; }
        body { margin: 0; font-family: 'Open Sans', sans-serif; cursor: crosshair; background: ${BG_COLOR}; }
        .canvas-face { cursor: crosshair; }
        a, button { cursor: crosshair; }
        @keyframes spin-cube {
          from { transform: rotateX(-25deg) rotateY(0deg); }
          to   { transform: rotateX(-25deg) rotateY(360deg); }
        }
      `}</style>

      {/* Header. On phones the logo grows, the name and the portfolio label are
          pushed to opposite edges, and contact/cv drop to a bar at the bottom of
          the screen. */}
      <h1
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          margin: 0,
          fontSize: "1.05rem",
          fontWeight: 300,
          color: "#333",
          zIndex: 10,
          pointerEvents: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: phone ? "10px" : 0 }}>
          <img
            src={asset("/joelle.png")}
            alt=""
            style={{
              // Sized in `em` so it always tracks the header text height —
              // keep it em-based whenever the opening-page text/font changes.
              // On phones it is scaled to the height of the stacked two-line
              // name block, and centred against it.
              height: phone ? "2.8em" : "1em",
              width: "auto",
              verticalAlign: "middle",
              marginRight: phone ? 0 : "8px",
              flexShrink: 0,
            }}
          />
          {phone ? (
            // stacked: the portfolio label sits under the name
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
              <span style={{ color: "#000", fontWeight: 600 }}>joelle warsono</span>
              <span>architectural portfolio</span>
            </span>
          ) : (
            <>
              <span style={{ color: "#000", fontWeight: 600 }}>joelle warsono</span>
              &nbsp;architectural portfolio
            </>
          )}
        </span>
        {!phone && (
          <span style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              onClick={() => setShowContact(true)}
              style={{
                pointerEvents: "auto",
                cursor: "crosshair",
                textDecoration: "underline",
              }}
            >
              contact
            </span>
            <span
              onClick={() => setShowCV(true)}
              style={{
                pointerEvents: "auto",
                cursor: "crosshair",
                textDecoration: "underline",
              }}
            >
              cv
            </span>
          </span>
        )}
      </h1>

      {/* On phones contact/cv live at the bottom of the screen instead. */}
      {phone && (
        <div
          style={{
            position: "absolute",
            left: "20px",
            right: "20px",
            bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "1.05rem",
            fontWeight: 300,
            color: "#333",
            zIndex: 10,
          }}
        >
          <span
            onClick={() => setShowContact(true)}
            style={{ cursor: "crosshair", textDecoration: "underline" }}
          >
            contact
          </span>
          <span
            onClick={() => setShowCV(true)}
            style={{ cursor: "crosshair", textDecoration: "underline" }}
          >
            cv
          </span>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{
          // Phones start further back: the viewport is much narrower, so the
          // cube (and the unfolded panels) need the extra distance to fit.
          // Applied on mount, which is what sets the opening view.
          position: phone
            ? [CUBE_SIZE * 3.6, CUBE_SIZE * 3.6, CUBE_SIZE * 3.6]
            : [CUBE_SIZE * 2.4, CUBE_SIZE * 2.4, CUBE_SIZE * 2.4],
          fov: 50,
        }}
        onPointerMissed={() => setUnfold(false)}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Cube
            onSelect={(p) => setSelectedProject(p)}
            unfold={unfold}
            setUnfold={setUnfold}
            onProjects={setProjects}
          />
        </Suspense>
        <OrbitControls
          target={[0, 0, 0]}
          autoRotate={!unfold && !selectedProject}
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Loading overlay while 3D textures load */}
      <LoadingScreen />

      {/* Project Page */}
      {selectedProject && (
        <aWeb.div
          ref={projectPageRef}
          style={{
            ...popupSpring,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: BG_COLOR,
            zIndex: 20,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* Title + description (Omah / Pilgrim / Fish Market / PTF render their own title inside their component) */}
          {selectedProject.title !== "Omah Mimpi" && selectedProject.title !== "Ode to the Modern Pilgrim" && selectedProject.title !== "Røyk — A Bergen Fish Market" && selectedProject.title !== "Peter Tatchell Foundation" && selectedProject.title !== "Waters of Unfinished Maps: Reinscribing the Malacca Strait" && selectedProject.title !== "miscellaneous" && (
            <div
              style={{
                display: "flex",
                padding: "40px 20px 0 20px",
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "33.3%",
                  padding: "0 40px",
                  boxSizing: "border-box",
                }}
              >
                <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: 0 }}>
                  {selectedProject.title}
                </h1>
              </div>
            </div>
          )}

          {selectedProject.title === "Waters of Unfinished Maps: Reinscribing the Malacca Strait" ? (
            <ProjectProfile title={selectedProject.title} />
          ) : selectedProject.title === "Ode to the Modern Pilgrim" ? (
            <ProjectPilgrim title={selectedProject.title} description={selectedProject.description} images={selectedProject.images} />
          ) : selectedProject.title === "Røyk — A Bergen Fish Market" ? (
            <ProjectFishMarket title={selectedProject.title} description={selectedProject.description} images={selectedProject.images} />
          ) : selectedProject.title === "Peter Tatchell Foundation" ? (
            <ProjectPTF title={selectedProject.title} description={selectedProject.description} images={selectedProject.images} />
          ) : selectedProject.title === "Omah Mimpi" ? (
            <ProjectOmah title={selectedProject.title} description={selectedProject.description} images={selectedProject.images} />
          ) : selectedProject.title === "miscellaneous" ? (
            <ProjectCover images={selectedProject.images} />
          ) : null}

          {/* Close button */}
          <button
            onClick={() => {
              setSelectedProject(null);
              setUnfold(false);
            }}
            style={{
              position: "fixed",
              top: "20px",
              // on phones it lines up with the 20px page margin; `padding: 0`
              // keeps the glyph itself flush rather than the button box
              right: phone ? "20px" : "30px",
              padding: 0,
              fontSize: "1.2rem",
              lineHeight: 1,
              border: "none",
              background: "transparent",
              cursor: "crosshair",
              zIndex: 1000,
            }}
          >
            ✕
          </button>

          {/* Next project — sits at the very bottom-right of the page content */}
          <div
            style={{
              textAlign: "right",
              padding: "0 30px 24px 30px",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={goToNextProject}
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "0.8rem",
                fontWeight: 300,
                color: "#333",
                border: "none",
                background: "transparent",
                cursor: "crosshair",
              }}
            >
              <RotatingCube />
              <span style={{ textDecoration: "underline" }}>next project →</span>
            </button>
          </div>
        </aWeb.div>
      )}

      {/* CV Page */}
      {showCV && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: BG_COLOR,
            zIndex: 30,
            overflowY: "auto",
            padding: "60px 60px 60px 60px",
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 24px 0" }}>
            cv
          </h1>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: 0 }}>
            CV content goes here.
          </p>

          <button
            onClick={() => setShowCV(false)}
            style={{
              position: "fixed",
              top: "20px",
              // on phones it lines up with the 20px page margin; `padding: 0`
              // keeps the glyph itself flush rather than the button box
              right: phone ? "20px" : "30px",
              padding: 0,
              fontSize: "1.2rem",
              lineHeight: 1,
              border: "none",
              background: "transparent",
              cursor: "crosshair",
              zIndex: 1000,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Contact Page */}
      {showContact && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: BG_COLOR,
            zIndex: 30,
            overflowY: "auto",
            padding: "60px 60px 60px 60px",
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ fontSize: "0.9rem", fontWeight: 300, margin: "0 0 24px 0" }}>
            contact
          </h1>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: "0 0 8px 0" }}>
            email:{" "}
            <a href="mailto:joellewarsono15@gmail.com" style={{ color: "inherit" }}>
              joellewarsono15@gmail.com
            </a>
          </p>
          <p style={{ fontSize: "0.7rem", fontWeight: 300, margin: "0 0 8px 0" }}>
            <a
              href="https://www.linkedin.com/in/joellewarsono"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              linkedin
            </a>
          </p>

          <button
            onClick={() => setShowContact(false)}
            style={{
              position: "fixed",
              top: "20px",
              // on phones it lines up with the 20px page margin; `padding: 0`
              // keeps the glyph itself flush rather than the button box
              right: phone ? "20px" : "30px",
              padding: 0,
              fontSize: "1.2rem",
              lineHeight: 1,
              border: "none",
              background: "transparent",
              cursor: "crosshair",
              zIndex: 1000,
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
