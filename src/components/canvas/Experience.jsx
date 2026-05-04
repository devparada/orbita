import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense } from "react";
import Earth from "./Earth";
import Meteorites from "./Meteorites";

export default function Experience() {
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
			<Canvas
				camera={{ position: [0, 0, 25], fov: 45 }}
				dpr={[1, 2]}
			>
				<Suspense fallback={null}>
					<OrbitControls
						enablePan={false}
						minDistance={15}
						maxDistance={100}
						makeDefault
					/>

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

					<Earth />
					<Meteorites />
				</Suspense>
			</Canvas>
		</div>
	);
}
