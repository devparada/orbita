import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { useStore } from "../../store/useStore";

import HUD from "../ui/HUD";
import LoadingScreen from "../ui/LoadingScreen";
import RulesScreen from "../ui/RulesScreen";

import Earth from "./planets/Earth";
import Moon from "./planets/Moon";
import Meteorites from "./Meteorites";
import BlackHoles from "./BlackHoles";
import SunOrbit from "./logic/SunOrbit";

/**
 * @component Experience
 * @description Orquestador principal de la escena 3D de ÓRBITA.
 * Aquí se inicializa el Canvas de React Three Fiber y se inyectan todos los elementos del juego:
 * - Luces globales (hemisferio) y cámara principal.
 * - Astros celestes (Tierra, Luna, Sol).
 * - Entidades dinámicas (Meteoritos y Agujeros Negros).
 * - Interfaz gráfica HTML superpuesta (HUD, LoadingScreen, RulesScreen).
 */
export default function Experience() {
  const apiLoaded = useStore((state) => state.apiLoaded);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000" }}>
      {/* 1. PANTALLA DE CARGA */}
      <LoadingScreen apiLoaded={apiLoaded} />

      {/* 2. PANTALLA DE REGLAS */}
      <RulesScreen apiLoaded={apiLoaded} />

      {/* 3. CAPA DE INTERFAZ DE JUEGO */}
      <HUD />

      {/* 3. CAPA DE SIMULACIÓN 3D */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 160, 200]} fov={45} />

        <Controls />

        {/* Ambientación Cinematográfica */}
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        
        {/* Luz de hemisferio: Simula el rebote de luz espacial.
            Arriba (estrellas) tono azul muy oscuro, abajo (vacío) casi negro.
            Esto evita que el lado oscuro de la Tierra se vea 100% negro. */}
        <hemisphereLight skyColor="#0a1a3a" groundColor="#000000" intensity={0.4} />

        {/* Sistema Planetario */}
        <SunOrbit />
        <Earth />
        <Moon />

        {/* Motor de Juego */}
        <Meteorites />
        <BlackHoles />
      </Canvas>
    </div>
  );
}
/**
 * @component Controls
 * @description Sub-componente para aislar los re-renders de isDraggingMeteorite.
 */
function Controls() {
  const isDragging = useStore((state) => state.isDraggingMeteorite);
  
  return (
    <OrbitControls
      makeDefault
      enabled={!isDragging}
      enablePan={false}
      maxDistance={400}
      minDistance={50}
      maxPolarAngle={Math.PI / 2.1}
    />
  );
}
