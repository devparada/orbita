import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../store/useStore";
import BlackHole from "./entities/BlackHole";
import gameConfig from "../../config/gameConfig.json";

const BH_COUNT = gameConfig.blackHoles.count;
const BH_RADIUS = gameConfig.blackHoles.radius;

/**
 * @component BlackHoles
 * @description Generador y orquestador de las defensas de Agujeros Negros.
 * Distribuye la mitad de los agujeros negros en órbita alrededor de la Luna,
 * y la otra mitad en órbita alrededor del Sol. Calcula constantemente sus 
 * nuevas posiciones en el mapa y actualiza el Store global para que el 
 * motor de físicas (Meteorites.jsx) sepa dónde se encuentran.
 */
export default function BlackHoles() {
	const localOrbits = useRef([]);
	const blackHolePositions = useStore((state) => state.blackHolePositions);
	const setBlackHolePositions = useStore((state) => state.setBlackHolePositions);

	useEffect(() => {
		const orbits = [];
		for (let i = 0; i < BH_COUNT; i++) {
			// Dividir mitad y mitad entre Luna y Sol
			const target = i < Math.floor(BH_COUNT / 2) ? "moon" : "sun";
			const initialAngle = Math.random() * Math.PI * 2;
			
			// Radios ajustados al tamaño del astro que protegen
			const radius = target === "moon" 
				? 6 + Math.random() * 4    // Luna: cerca
				: 18 + Math.random() * 10; // Sol: lejos (es muy grande)

			// Velocidad orbital
			const speed = (0.3 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
			orbits.push({ target, initialAngle, radius, speed });
		}
		localOrbits.current = orbits;
		setBlackHolePositions(new Array(BH_COUNT).fill(new THREE.Vector3(0, 0, 0)));
	}, [setBlackHolePositions]);

	useFrame(({ clock }) => {
		if (localOrbits.current.length > 0) {
			const { sunWorldPos, moonWorldPos } = useStore.getState();
			const t = clock.getElapsedTime();
			
			const newWorldPos = localOrbits.current.map(orbit => {
				const center = orbit.target === "sun" ? sunWorldPos : moonWorldPos;
				const angle = orbit.initialAngle + t * orbit.speed;
				
				return new THREE.Vector3(
					center.x + Math.cos(angle) * orbit.radius,
					0,
					center.z + Math.sin(angle) * orbit.radius
				);
			});
			setBlackHolePositions(newWorldPos);
		}
	});

	return (
		<group>
			{blackHolePositions.map((pos, i) => (
				<BlackHole key={`bh-${i}`} position={pos} radius={BH_RADIUS} />
			))}
		</group>
	);
}
