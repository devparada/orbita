import { create } from "zustand";
import * as THREE from "three";

/**
 * Store global de la aplicación utilizando Zustand.
 * Ahora incluye lógica de juego para el billar espacial.
 */
export const useStore = create((set) => ({
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
  addScore: (pts) => set((state) => {
    const newScore = state.score + Number(pts);
    const newRemaining = Math.max(0, state.meteoritosRestantes - 1);
    return { score: newScore, meteoritosRestantes: newRemaining };
  }),
  resetGame: () => set({ score: 0, meteoritos: [] }),
  setInitialCount: (count) => set({ meteoritosRestantes: count }),
}));
