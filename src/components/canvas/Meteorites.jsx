import { useEffect } from "react";
import { getMeteoritos } from "../../services/nasa";
import { useStore } from "../../store/useStore";

/**
 * Componente Meteorites
 * Renderiza los objetos cercanos a la Tierra (NEOs) en la escena 3D.
 * Se encarga de obtener los datos de la API y transformarlos a coordenadas espaciales.
 */
export default function Meteorites() {
	const { meteoritos, setMeteoritos } = useStore();

	// Factor para escalar las distancias astronómicas (km) a unidades manejables en Three.js
	const SCALE_FACTOR = 1000000;

	useEffect(() => {
		// Evitamos llamadas duplicadas si ya tenemos datos
		if (meteoritos.length > 0) return;

		// Petición al servicio de la NASA
		getMeteoritos().then((data) => {
			if (!data || !Array.isArray(data)) return;

			// Transformación de datos crudos a propiedades útiles para la escena 3D
			const formattedList = data.map((m) => {
				const dist = parseFloat(m.missDistance); // Distancia en km
				const vel = parseFloat(m.velocity);     // Velocidad en km/h
				
				// Generamos un ángulo basado en el ID para situar los objetos en una órbita circular
				const angle = (parseInt(m.id, 10) % 360) * (Math.PI / 180);

				// Cálculo de posición X, Z (plano orbital) e Y (basado en velocidad para profundidad)
				const x = (dist / SCALE_FACTOR) * Math.cos(angle);
				const z = (dist / SCALE_FACTOR) * Math.sin(angle);
				const y = vel / 50000;

				return {
					...m,
					position: [x, y, z],
					realSize: m.diameterMax / 1000, // Tamaño en km (convertido para escala visual)
				};
			});

			// Actualizamos el estado global
			setMeteoritos(formattedList);
		});
	}, [meteoritos.length, setMeteoritos]);

	return (
		<group>
			{meteoritos.map((m) => (
				<mesh key={m.id} position={m.position}>
					{/* Esferas que representan los meteoritos con brillo cian */}
					<sphereGeometry args={[Math.max(0.05, m.realSize * 0.5), 16, 16]} />
					<meshStandardMaterial
						color="#00f3ff"
						emissive="#00f3ff"
						emissiveIntensity={5}
					/>
				</mesh>
			))}
		</group>
	);
}
