import React, { useEffect, useState, useMemo } from "react";
import { useProgress } from "@react-three/drei";
import "./LoadingScreen.css";

/**
 * Componente de Pantalla de Carga (Loading Screen)
 * Gestiona la visualización del progreso de carga de activos 3D y datos de la API.
 */
export default function LoadingScreen({ apiLoaded }) {
  // Hook de R3F para obtener el progreso de carga de texturas/modelos
  const { progress: assetsProgress } = useProgress();
  
  const [dots, setDots] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);

  // 1. Animación de puntos suspensivos para el texto de carga
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, [isFinished]);

  // 2. Cálculo de porcentaje "realista" combinado
  // Consideramos que los activos 3D son el 70% de la carga y la API el 30%
  const targetProgress = useMemo(() => {
    const apiWeight = apiLoaded ? 30 : 0;
    const assetsWeight = (assetsProgress / 100) * 70;
    return Math.round(assetsWeight + apiWeight);
  }, [assetsProgress, apiLoaded]);

  // 3. Suavizado del progreso para que no pegue saltos bruscos
  useEffect(() => {
    if (smoothProgress < targetProgress) {
      const timeout = setTimeout(() => {
        setSmoothProgress((prev) => Math.min(prev + 1, targetProgress));
      }, 10); // Incremento suave cada 10ms
      return () => clearTimeout(timeout);
    }
  }, [smoothProgress, targetProgress]);

  // 4. Lógica de finalización
  // Se considera terminado cuando ambos han cargado y la barra visual llega al 100%
  const allLoaded = assetsProgress === 100 && apiLoaded && smoothProgress >= 100;

  useEffect(() => {
    if (allLoaded) {
      // Retraso de cortesía para que el usuario vea el estado final "SISTEMA LISTO"
      const timer = setTimeout(() => setIsFinished(true), 800);
      return () => clearTimeout(timer);
    }
  }, [allLoaded]);

  return (
    <div className={`loading-screen ${isFinished ? "fade-out finished" : ""}`}>
      <div className="loading-content">
        {/* Título dinámico */}
        <div className="text-container">
          <h2 className="loading-text">
            {isFinished ? "SISTEMA LISTO" : `INICIALIZANDO SISTEMA${dots}`}
          </h2>
        </div>
        
        {/* Barra de progreso visual */}
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${smoothProgress}%` }}
          ></div>
        </div>

        {/* Detalles técnicos inferiores */}
        <div className="loading-details">
          <div className="detail-item">
            <span className="detail-label">NIVEL DE CARGA</span>
            <span>{smoothProgress}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">NÚCLEO NASA</span>
            <span>{apiLoaded ? "SINCRO OK" : "CONECTANDO"}</span>
          </div>
        </div>
      </div>

      {/* Efecto visual de barrido (scanline) */}
      <div className="scanline"></div>
    </div>
  );
}
