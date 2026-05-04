import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

/**
 * Componente Earth
 * Renderiza el planeta Tierra con texturas de color y relieve (bump map).
 */
export default function Earth() {
	const earthRef = useRef();

	// Carga de texturas desde la carpeta public/textures
	const [colorMap, bumpMap] = useTexture([
		"/textures/earth_color.jpg",
		"/textures/earth_topo.jpg",
	]);

	// Animación de rotación constante de la Tierra
	useFrame((_state, delta) => {
		if (earthRef.current) {
			earthRef.current.rotation.y += delta * 0.05;
		}
	});

	return (
		<mesh ref={earthRef} castShadow receiveShadow>
			<sphereGeometry args={[5, 64, 64]} />
			{/* Usamos MeshStandardMaterial para una respuesta más realista a la luz del Sol */}
			<meshStandardMaterial
				map={colorMap}
				bumpMap={bumpMap}
				bumpScale={0.15}
				roughness={0.7}
				metalness={0.2}
			/>
		</mesh>
	);
}
