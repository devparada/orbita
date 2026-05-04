import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Earth() {
	const earthRef = useRef();

	const [colorMap, bumpMap] = useTexture([
		"/textures/earth_color.jpg",
		"/textures/earth_topo.jpg",
	]);

	useFrame((_state, delta) => {
		earthRef.current.rotation.y += delta * 0.05;
	});

	return (
		<mesh ref={earthRef}>
			<sphereGeometry args={[5, 64, 64]} />
			<meshPhongMaterial
				map={colorMap}
				bumpMap={bumpMap}
				bumpScale={0.08}
				shininess={5}
				specular={new THREE.Color("#111111")}
			/>
		</mesh>
	);
}
