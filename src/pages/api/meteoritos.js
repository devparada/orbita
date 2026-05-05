export const prerender = false;

export async function GET() {
	const API_KEY = import.meta.env.NASA_API_KEY;
	const hoy = new Date().toISOString().split("T")[0];
	const URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${hoy}&api_key=${API_KEY}`;

	try {
		const response = await fetch(URL);

		if (!response.ok) {
			return new Response(JSON.stringify({ error: "Error de la NASA" }), {
				status: response.status,
			});
		}

		const data = await response.json();

		// Extraemos y aplanamos los objetos
		const rawObjects = data.near_earth_objects
			? Object.values(data.near_earth_objects).flat()
			: [];

		const cleanData = rawObjects.map((m) => {
			const firstApproach = m.close_approach_data?.[0];

			return {
				id: m.id,
				name: m.name,
				diameterMax: m.estimated_diameter?.meters?.estimated_diameter_max || 0,
				velocity: parseFloat(
					firstApproach?.relative_velocity?.kilometers_per_hour || "0",
				),
				date: firstApproach?.close_approach_date || "",
				missDistance: parseFloat(
					firstApproach?.miss_distance?.kilometers || "0",
				),
			};
		});

		// Ordenamos por cercanía (los más cercanos primero)
		cleanData.sort((a, b) => a.missDistance - b.missDistance);

		return new Response(JSON.stringify(cleanData), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
			},
		});
	} catch (error) {
		console.error("Fallo en la API Meteoritos:", error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}
