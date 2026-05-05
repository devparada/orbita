export interface MeteoriteData {
	id: string;
	name: string;
	diameterMax: number;
	velocity: number;
	date: string;
	missDistance: number;
}

/**
 * Servicio optimizado para obtener meteoritos.
 * Los datos ya vienen filtrados, aplanados y ordenados desde el servidor.
 */
export async function getMeteoritos(): Promise<MeteoriteData[]> {
	try {
		const response = await fetch("/api/meteoritos");

		if (!response.ok) {
			throw new Error(`Error en el Proxy: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error en getMeteoritos:", error);
		return [];
	}
}
