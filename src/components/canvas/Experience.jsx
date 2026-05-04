import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { useStore } from "../../store/useStore";

import HUD from "../ui/HUD";
import LoadingScreen from "../ui/LoadingScreen";

import Earth from "./planets/Earth";
import Moon from "./planets/Moon";
import Meteorites from "./Meteorites";
import SunOrbit from "./logic/SunOrbit";

/**
 * @component Experience
 * @description Orquestador principal de la escena 3D de ÓRBITA.
 */
export default function Experience() {
  const isDragging = useStore((state) => state.isDraggingMeteorite);
  const apiLoaded = useStore((state) => state.apiLoaded);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000" }}>
      {/* 1. PANTALLA DE CARGA */}
      <LoadingScreen apiLoaded={apiLoaded} />

      {/* 2. CAPA DE INTERFAZ DE JUEGO */}
      <HUD />

      {/* 3. CAPA DE SIMULACIÓN 3D */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 160, 200]} fov={45} />

        <OrbitControls
          makeDefault
          enabled={!isDragging}
          enablePan={false}
          maxDistance={400}
          minDistance={50}
          maxPolarAngle={Math.PI / 2.1}
        />

        {/* Ambientación */}
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />

        {/* Sistema Planetario */}
        <SunOrbit />
        <Earth />
        <Moon />

        {/* Motor de Juego */}
        <Meteorites />
      </Canvas>
    </div>
  );
}
