import { create } from "zustand";

/**
 * Store global de la aplicación utilizando Zustand.
 * Centraliza el estado de carga y los datos de los meteoritos obtenidos de la NASA.
 */
export const useStore = create((set) => ({
  // Estado de sincronización con la API
  apiLoaded: false,
  
  // Setter manual para el estado de la API
  setApiLoaded: (val) => set({ apiLoaded: val }),
  
  // Lista de meteoritos formateados para Three.js
  meteoritos: [],
  
  // Función para actualizar los meteoritos y marcar la carga como completada
  setMeteoritos: (data) => set({ meteoritos: data, apiLoaded: true }),
}));
