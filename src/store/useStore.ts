import { create } from "zustand";
import * as THREE from "three";
import type { MeteoriteData } from "../services/nasa";
import gameConfig from "../config/gameConfig.json";

// ─── Helper: puntuación con multiplicador ──────────────────────
export const calculateScore = (basePoints: number): number => {
	return Math.round(basePoints * gameConfig.scoreMultiplier);
};

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

	// AGUJEROS NEGROS
	blackHolePositions: THREE.Vector3[];
	setBlackHolePositions: (positions: THREE.Vector3[]) => void;

	// LÓGICA DE JUEGO
	score: number;
	meteoritosRestantes: number;
	addScore: (pts: number) => void;
	resetGame: () => void;
	setInitialCount: (count: number) => void;
}

/**
 * @module useStore
 * @description Estado global de la aplicación gestionado con Zustand.
 * Actúa como "cerebro" o Single Source of Truth del juego, permitiendo que
 * componentes separados (HUD de UI y Canvas 3D) compartan información en tiempo real
 * sin necesidad de pasar props (prop-drilling).
 * 
 * Gestiona:
 * - Puntuación y contador de meteoritos.
 * - Posiciones dinámicas de astros (Sol, Luna, Agujeros Negros) para la física.
 * - Datos brutos extraídos de la API de la NASA.
 * - Estados de control de la interfaz (apiLoaded, isDraggingMeteorite).
 */
export const useStore = create<GameState>((set, get) => ({
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

	// AGUJEROS NEGROS
	blackHolePositions: [],
	setBlackHolePositions: (positions) => set({ blackHolePositions: positions }),

	// LÓGICA DE JUEGO
	score: 0,
	meteoritosRestantes: 0,

	addScore: (pts) =>
		set((state) => {
			const scaled = calculateScore(pts);
			const newScore = state.score + scaled;
			const newRemaining = Math.max(0, state.meteoritosRestantes - 1);
			return { score: newScore, meteoritosRestantes: newRemaining };
		}),

	resetGame: () =>
		set({ score: 0, meteoritos: [], meteoritosRestantes: 0 }),

	setInitialCount: (count) => set({ meteoritosRestantes: count }),
}));

// ─── Exporta las constantes de puntuación para usarlas en los componentes ─────
export const SCORES = gameConfig.scores;
