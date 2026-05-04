import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef } from "react";
import Earth from "./planets/Earth";
import Meteorites from "./Meteorites";
import Sun from "./planets/Sun";
import Moon from "./planets/Moon";
import LoadingScreen from "../ui/LoadingScreen";
import { useStore } from "../../store/useStore";

/**
 * Componente SunOrbit
 * Hace que el Sol gire alrededor de la Tierra (Vista Geocéntrica).
 * Esto permite que la Tierra sea el centro [0,0,0] para los meteoritos,
 * pero manteniendo el dinamismo de la órbita y el ciclo día/noche.
 */
function SunOrbit() {
  const orbitRef = useRef();
  
  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.1; // Velocidad de la órbita solar
    }
  });

  return (
    <group ref={orbitRef}>
      {/* El Sol se sitúa a una distancia fija de la Tierra */}
      <group position={[150, 0, 0]}>
        <Sun />
      </group>
    </group>
  );
}

/**
 * Componente Experience
 * Mantiene la Tierra en el centro [0,0,0] como foco principal.
 */
export default function Experience() {
	const apiLoaded = useStore((state) => state.apiLoaded);

	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				position: "fixed",
				top: 0,
				left: 0,
				background: "#000",
			}}
		>
			<LoadingScreen apiLoaded={apiLoaded} />

			<Canvas
				camera={{ position: [0, 20, 40], fov: 45 }}
				dpr={[1, 2]}
        shadows
			>
				<Suspense fallback={null}>
					<OrbitControls
						enablePan={false}
						minDistance={15}
						maxDistance={250}
						makeDefault
					/>

					<Stars
						radius={300}
						depth={60}
						count={8000}
						factor={4}
						saturation={0}
						fade
						speed={1}
					/>

					{/* El Sol orbita a la Tierra para mantener el foco en los NEOs */}
					<SunOrbit />
					
					<ambientLight intensity={0.15} />

					{/* La Tierra, Luna y Meteoritos fijos en el centro del sistema de coordenadas */}
					<Earth />
					<Moon />
					<Meteorites />
				</Suspense>
			</Canvas>
		</div>
	);
}
