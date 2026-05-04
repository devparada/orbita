import React, { useEffect, useState, useMemo } from "react";
import { useProgress } from "@react-three/drei";
import "./LoadingScreen.css";

/**
 * @component LoadingScreen
 * @description Pantalla de carga técnica con telemetría de activos y sincronización de API.
 * Proporciona una transición fluida entre el estado de carga y el inicio del juego.
 */
export default function LoadingScreen({ apiLoaded }) {
  const { progress: assetsProgress } = useProgress();
  const [dots, setDots] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);

  // 1. Efecto de terminal: Puntos suspensivos animados
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, [isFinished]);

  // 2. Telemetría combinada: 70% Activos 3D, 30% Datos NASA
  const targetProgress = useMemo(() => {
    const apiWeight = apiLoaded ? 30 : 0;
    const assetsWeight = (assetsProgress / 100) * 70;
    return Math.round(assetsWeight + apiWeight);
  }, [assetsProgress, apiLoaded]);

  // 3. Interpolación suave de la barra de progreso
  useEffect(() => {
    if (smoothProgress < targetProgress) {
      const timer = setTimeout(() => {
        setSmoothProgress((prev) => Math.min(prev + 1, targetProgress));
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [smoothProgress, targetProgress]);

  // 4. Lógica de transición final
  const allLoaded = assetsProgress === 100 && apiLoaded && smoothProgress >= 100;

  useEffect(() => {
    if (allLoaded) {
      // Delay táctico para mostrar el mensaje de éxito
      const timer = setTimeout(() => setIsFinished(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [allLoaded]);

  return (
    <div
      className={`loading-screen ${isFinished ? "fade-out finished" : ""}`}
      style={{ pointerEvents: isFinished ? 'none' : 'auto' }}
    >
      <div className="loading-content">
        <div className="loading-brand">
          <span className="brand-accent">SISTEMA</span>
          <h1 className="brand-title">ÓRBITA</h1>
        </div>

        <div className="status-box">
          <h2 className="loading-text">
            {isFinished ? "NÚCLEO OPERATIVO" : `INICIALIZANDO ESCÁNER${dots}`}
          </h2>

          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${smoothProgress}%` }}>
              <div className="bar-glow"></div>
            </div>
          </div>
        </div>

        <div className="loading-details">
          <div className="detail-item">
            <span className="detail-label">CONEXIÓN</span>
            <span className="detail-value">{smoothProgress}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">NODO NASA</span>
            <span className={`detail-value ${apiLoaded ? "status-ok" : "status-wait"}`}>
              {apiLoaded ? "SINCRO_OK" : "BUSCANDO..."}
            </span>
          </div>
        </div>
      </div>

      {/* Efecto de interferencia CRT */}
      <div className="scanline"></div>
      <div className="noise-overlay"></div>
    </div>
  );
}
