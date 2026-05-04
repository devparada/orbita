import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense } from "react";
import Earth from "./Earth";
import Meteorites from "./Meteorites";
import LoadingScreen from "../ui/LoadingScreen";
import { useStore } from "../../store/useStore";

/**
 * Componente Experience
 * Punto de entrada principal de la escena 3D.
 * Configura el Canvas de Three.js, la iluminación, la cámara y los componentes del universo.
 */
export default function Experience() {
	// Suscripción al estado de carga de la API
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
			{/* Pantalla de carga superpuesta */}
			<LoadingScreen apiLoaded={apiLoaded} />

			<Canvas
				camera={{ position: [0, 0, 25], fov: 45 }}
				dpr={[1, 2]} // Optimización para pantallas Retina
			>
				{/* Suspense gestiona la carga asíncrona de texturas y modelos */}
				<Suspense fallback={null}>
					<OrbitControls
						enablePan={false}
						minDistance={15}
						maxDistance={100}
						makeDefault
					/>

					{/* Fondo de estrellas procedimentales */}
					<Stars
						radius={100}
						depth={50}
						count={5000}
						factor={4}
						saturation={0}
						fade
						speed={1}
					/>

					{/* Iluminación Cinematográfica */}
					<directionalLight position={[10, 10, 10]} intensity={3} />
					<ambientLight intensity={0.3} />
					<pointLight position={[-10, -5, -10]} intensity={2} color="#2255ff" />

					{/* Elementos de la Escena */}
					<Earth />
					<Meteorites />
				</Suspense>
			</Canvas>
		</div>
	);
}
