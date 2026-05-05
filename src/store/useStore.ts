import { create } from "zustand";
import * as THREE from "three";
import type { MeteoriteData } from "../services/nasa";

interface GameState {
	apiLoaded: boolean;
	setApiLoaded: (val: boolean) => void;

	meteoritos: MeteoriteData[];
	setMeteoritos: (data: MeteoriteData[]) => void;

	isDraggingMeteorite: boolean;
	setIsDraggingMeteorite: (val: boolean) => void;

	// POSICIONES PLANETARIAS
	sunWorldPos: THREE.Vector3;
	moonWorldPos: THREE.Vector3;
	setSunWorldPos: (pos: THREE.Vector3) => void;
	setMoonWorldPos: (pos: THREE.Vector3) => void;

	// LÓGICA DE JUEGO
	score: number;
	meteoritosRestantes: number;
	addScore: (pts: number) => void;
	resetGame: () => void;
	setInitialCount: (count: number) => void;
}

/**
 * Store global de la aplicación utilizando Zustand.
 * Ahora incluye tipado estricto para la lógica de juego.
 */
export const useStore = create<GameState>((set) => ({
	apiLoaded: false,
	setApiLoaded: (val) => set({ apiLoaded: val }),

	meteoritos: [],
	setMeteoritos: (data) => set({ meteoritos: data, apiLoaded: true }),

	isDraggingMeteorite: false,
	setIsDraggingMeteorite: (val) => set({ isDraggingMeteorite: val }),

	// POSICIONES PLANETARIAS
	sunWorldPos: new THREE.Vector3(150, 0, 0),
	moonWorldPos: new THREE.Vector3(20, 0, 0),
	setSunWorldPos: (pos) => set({ sunWorldPos: pos }),
	setMoonWorldPos: (pos) => set({ moonWorldPos: pos }),

	// LÓGICA DE JUEGO
	score: 0,
	meteoritosRestantes: 0,
	addScore: (pts) =>
		set((state) => {
			const newScore = state.score + Number(pts);
			const newRemaining = Math.max(0, state.meteoritosRestantes - 1);
			return { score: newScore, meteoritosRestantes: newRemaining };
		}),
	resetGame: () => set({ score: 0, meteoritos: [] }),
	setInitialCount: (count) => set({ meteoritosRestantes: count }),
}));
