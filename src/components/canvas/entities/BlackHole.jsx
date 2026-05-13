import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * @component BlackHole
 * @description Entidad 3D que representa un Agujero Negro con físicas extremas (estilo "Interstellar").
 * Utiliza múltiples geometrías (esfera negra central y anillos de acreción planares) combinadas
 * con "AdditiveBlending" para simular la radiación térmica y la curvatura de la luz sin necesidad
 * de usar custom shaders complejos.
 * 
 * @param {THREE.Vector3} position - Posición del agujero negro en la escena.
 * @param {number} radius - Radio del event horizon.
 */
export default function BlackHole({ position, radius = 5 }) {
	const diskRef = useRef();
	const glowRef = useRef();
	const lensRef = useRef();

	// Animación: disco de acreción gira, halo pulsa
	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		if (diskRef.current) {
			diskRef.current.rotation.z -= 0.04; // Giro violento
			diskRef.current.rotation.x = Math.sin(t * 0.5) * 0.2; // Cabeceo
		}
		if (glowRef.current) {
			const pulse = 1 + Math.sin(t * 5) * 0.03; // Pulso de radiación
			glowRef.current.scale.setScalar(pulse);
		}
		if (lensRef.current) {
			lensRef.current.rotation.z += 0.02; // Contragiro de materia
		}
	});

	const pos = position ?? new THREE.Vector3(0, 0, 0);

	return (
		<group position={[pos.x, pos.y, pos.z]}>
			{/* ── Event horizon (Singularidad: negro puro sin sombreado) ── */}
			<mesh>
				<sphereGeometry args={[radius, 32, 32]} />
				<meshBasicMaterial color="#000000" />
			</mesh>

			{/* ── Disco de acreción interior (Disco brillante y plano) ── */}
			<mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
				<ringGeometry args={[radius * 1.1, radius * 1.8, 64]} />
				<meshBasicMaterial
					color="#ffaa00"
					transparent
					opacity={0.8}
					side={THREE.DoubleSide}
					blending={THREE.AdditiveBlending}
					depthWrite={false}
				/>
			</mesh>

			{/* ── Disco de acreción exterior (Materia esparcida) ── */}
			<mesh ref={lensRef} rotation={[Math.PI / 2, 0, 0]}>
				<ringGeometry args={[radius * 1.8, radius * 2.5, 64, 1, 0, Math.PI * 1.8]} />
				<meshBasicMaterial
					color="#ff3300"
					transparent
					opacity={0.4}
					side={THREE.DoubleSide}
					blending={THREE.AdditiveBlending}
					depthWrite={false}
				/>
			</mesh>

			{/* ── Halo de radiación (Simulación de lente gravitacional difusa) ── */}
			<mesh ref={glowRef}>
				<sphereGeometry args={[radius * 1.25, 32, 32]} />
				<meshBasicMaterial
					color="#ff1100"
					transparent
					opacity={0.2}
					blending={THREE.AdditiveBlending}
					depthWrite={false}
					side={THREE.BackSide}
				/>
			</mesh>

			{/* ── Luz puntual para iluminar la escena ── */}
			<pointLight
				color="#ff4400"
				intensity={3}
				distance={radius * 10}
				decay={2}
			/>
		</group>
	);
}
