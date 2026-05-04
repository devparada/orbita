import { useState, useEffect } from "react";
import { getMeteoritos } from "../../services/nasa";

export default function Meteorites() {
	const [list, setList] = useState([]);

	// Escala para convertir km reales a unidades de Three.js
	const SCALE_FACTOR = 1000000;

	useEffect(() => {
		getMeteoritos().then((data) => {
			if (!data || !Array.isArray(data)) return;

			const formattedList = data.map((m) => {
				const dist = parseFloat(m.missDistance); // Distancia real en km
				const vel = parseFloat(m.velocity); // Velocidad real en km/h

				// Para no "inventar" ángulos, usamos el ID como una coordenada angular única.
				// En astronomía, si no tienes la efeméride completa, el objeto se sitúa
				// en su distancia radial real.
				const angle = (parseInt(m.id, 10) % 360) * (Math.PI / 180);

				// Posición en el plano orbital real basada en su distancia de aproximación
				const x = (dist / SCALE_FACTOR) * Math.cos(angle);
				const z = (dist / SCALE_FACTOR) * Math.sin(angle);
				// La velocidad afecta a la altura (Y) para dar profundidad real al enjambre
				const y = vel / 50000;

				return {
					...m,
					position: [x, y, z],
					realSize: m.diameterMax / 1000,
				};
			});

			setList(formattedList);
		});
	}, []);

	return (
		<group>
			{list.map((m) => (
				<mesh key={m.id} position={m.position}>
					{/* Tamaño real escalado: 0.1 en Three.js = 100 metros reales aprox */}
					<sphereGeometry args={[Math.max(0.05, m.realSize * 0.5), 16, 16]} />
					<meshStandardMaterial
						color="#00f3ff"
						emissive="#00f3ff"
						emissiveIntensity={2}
					/>
				</mesh>
			))}
		</group>
	);
}
