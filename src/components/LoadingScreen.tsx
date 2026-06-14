import { useProgress } from "@react-three/drei";
import { Loader } from "@fremtind/jkl-loader-react";

// Full-screen overlay shown while the 3D scene's textures are loading.
// Uses the Jøkul (Fremtind) Loader component.
export default function LoadingScreen() {
  const { active } = useProgress();

  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Loader variant="large" textDescription="Loading …" />
    </div>
  );
}
