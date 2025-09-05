import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { a as aWeb, useSpring as useWebSpring } from "@react-spring/web";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

const CUBE_SIZE = 11;
const UNFOLD_MULTIPLIER = 1.4;
const DASH_SIZE = CUBE_SIZE * 0.06;
const GAP_SIZE = CUBE_SIZE * 0.035;
const LINE_COLOR = "#888888";
const LINE_OPACITY = 0.5;

type Project = {
  title: string;
  description: string;
  images: { src: string; caption: string }[];
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
        color={LINE_COLOR}
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
  entrance,
}: FaceProps) {
  const { pos, rot, edgeOpacity } = useSpring({
    pos: unfold ? unfoldPosition : position,
    rot: unfold ? unfoldRotation : rotation,
    edgeOpacity: unfold ? LINE_OPACITY : 0,
    config: { tension: 140, friction: 18 },
  });

  const tex = useTexture(texture);

  return (
    <a.group
      position={pos}
      rotation={rot}
      onClick={(e) => {
        e.stopPropagation();
        if (isUnfolded) onClickFace(project);
        else unfoldCube();
      }}
      className="canvas-face"
    >
      <mesh>
        <planeGeometry args={[CUBE_SIZE, CUBE_SIZE]} />
        <a.meshBasicMaterial
          map={tex}
          transparent
          opacity={entrance}
          alphaTest={0.1}
          side={THREE.DoubleSide}
          color={"white"}
        />
      </mesh>
      <FaceDottedEdges
        size={CUBE_SIZE}
        opacity={edgeOpacity as unknown as number}
      />
    </a.group>
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
        color={LINE_COLOR}
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
}: {
  onSelect: (project: Project) => void;
  unfold: boolean;
  setUnfold: (v: boolean) => void;
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
          "The Earthwork theme invited me to engage with the site’s layered history—Roman tracks and ancient brick culverts. <br/><br/>Inspired by Roman engineers, the “Fathers of Trusses,” and Canterbury builders who raised cathedrals, I reflected on humanity’s timeless pursuit of progress and creation.",
        images: [
          { src: "/culv1.jpg", caption: "Wooden beam from Roman railway" },
          { src: "/culv2.jpg", caption: "Roman culvert" },
          { src: "/antecollage.png", caption: "Main collage" },
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
        title: "The People's Fish Market",
        description: "Main description for Berg.",
        images: [{ src: "/berg.png", caption: "Filler caption" }],
      },
    },
    {
      position: [0, half, 0],
      rotation: [-Math.PI / 2, 0, 0],
      unfoldPosition: [0, spread, 0],
      unfoldRotation: [-Math.PI / 2, 0, 0],
      texture: "/joelle.png",
      project: {
        title: "Profile",
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
        description: "Main description for PTF.",
        images: [{ src: "/ptf.png", caption: "Filler caption" }],
      },
    },
    {
      position: [half, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      unfoldPosition: [spread, 0, 0],
      unfoldRotation: [0, Math.PI / 2, 0],
      texture: "/omah.png",
      project: {
        title: "Omah",
        description: "Main description for Omah.",
        images: [{ src: "/omah.png", caption: "Filler caption" }],
      },
    },
    {
      position: [-half, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      unfoldPosition: [-spread, 0, 0],
      unfoldRotation: [0, -Math.PI / 2, 0],
      texture: "/cover.png",
      project: {
        title: "Cover",
        description: "Main description for Cover.",
        images: [{ src: "/cover.png", caption: "Filler caption" }],
      },
    },
  ];

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
          entrance={entrance}
        />
      ))}
    </a.group>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [unfold, setUnfold] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUnfold(false);
        setSelectedProject(null);
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
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        html, body, #root { height: 100%; }
        body { margin: 0; font-family: 'Open Sans', sans-serif; cursor: crosshair; }
        .canvas-face { cursor: crosshair; }
        a, button { cursor: crosshair; }
      `}</style>

      {/* Header */}
      <h1
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          margin: 0,
          fontSize: "1rem",
          fontWeight: 300,
          color: "#333",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        joelle warsono architectural portfolio
      </h1>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          fontSize: "0.75rem",
          fontWeight: 300,
          color: "#333",
          zIndex: 10,
        }}
      >
        <div>contact: joellewarsono15@gmail.com</div>
        <div>
          <a
            href="https://www.linkedin.com/in/joellewarsono"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#333" }}
          >
            linkedin
          </a>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [CUBE_SIZE * 2.6, CUBE_SIZE * 2.6, CUBE_SIZE * 2.6],
          fov: 50,
        }}
        onPointerMissed={() => setUnfold(false)}
      >
        <ambientLight intensity={1} />
        <Cube
          onSelect={(p) => setSelectedProject(p)}
          unfold={unfold}
          setUnfold={setUnfold}
        />
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>

      {/* Project Page */}
      {selectedProject && (
        <aWeb.div
          style={{
            ...popupSpring,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            zIndex: 20,
            overflowY: "auto",
          }}
        >
          {/* Title + description */}
          <div style={{ padding: "40px 40px 0 40px" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 300 }}>
              {selectedProject.title}
            </h1>
            <p style={{}}>{}</p>
          </div>

          {selectedProject.title === "Profile" ? (
            <div style={{ display: "flex", gap: 40, padding: "20px" }}>
              <img src="/joelleprofile.jpg" style={{ width: "50%" }} />
              <img src="/joelleprofile2.jpg" style={{ width: "40%" }} />
            </div>
          ) : selectedProject.title === "Ode to the Modern Pilgrim" ? (
            // Editorial grid layout
            <div
              style={{
                display: "flex",
                gap: "20px",
                padding: "0 40px 40px 40px",
                height: "fit-content", // lock both sides equal
              }}
            >
              {/* Left side: stacked culvert images */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  width: "20%",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                    textAlign: "justify",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: selectedProject.description,
                  }}
                ></div>
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      marginTop: "4px",
                      minWidth: "20%",
                      fontWeight: 300,
                    }}
                  >
                    Wooden beam from Roman railway
                  </div>
                  <div>
                    <img
                      src="/culv1.jpg"
                      alt="Wooden beam"
                      style={{
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "flex-end",
                  }}
                >
                  <div>
                    <img
                      src="/culv2.jpg"
                      alt="Roman culvert"
                      style={{
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      marginTop: "4px",
                      minWidth: "20%",
                      fontWeight: 300,
                    }}
                  >
                    Roman culvert
                  </div>
                </div>
              </div>
              {/* Right side: collage */}
              <div style={{ display: "flex", height: "100%", width: "80%" }}>
                <img
                  src="/antecollage.png"
                  alt="Collage"
                  style={{
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: "6px",
                  }}
                />
              </div>
            </div>
          ) : (
            // Default layout for other projects
            selectedProject.images.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "flex-start",
                  marginBottom: "60px",
                  padding: "0 20px",
                }}
              >
                <div style={{ width: "33.3%", padding: "0 40px" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 300 }}>
                    {item.caption}
                  </p>
                </div>
                <div style={{ width: "66.6%", padding: "0 20px" }}>
                  <img
                    src={item.src}
                    alt=""
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "6px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            ))
          )}

          {/* Close button */}
          <button
            onClick={() => {
              setSelectedProject(null);
              setUnfold(false);
            }}
            style={{
              position: "fixed",
              top: "20px",
              right: "30px",
              fontSize: "1.2rem",
              border: "none",
              background: "transparent",
              cursor: "crosshair",
              zIndex: 1000,
            }}
          >
            ✕
          </button>
        </aWeb.div>
      )}
    </div>
  );
}
