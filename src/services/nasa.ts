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
		const timeout = new Promise<never>((_, reject) =>
			setTimeout(() => reject(new Error("NASA API timeout")), 10000)
		);
		const response = await Promise.race([
			fetch("/api/meteoritos"),
			timeout,
		]) as Response;

		if (!response.ok) {
			throw new Error(`Error en el Proxy: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error en getMeteoritos:", error);
		return [];
	}
}
