import { useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import "./HUD.css";

/**
 * @component HUD
 * @description Interfaz de usuario reactiva (Heads-Up Display).
 * Ahora incluye un sistema de cooldown para la recarga del escáner.
 */
export default function HUD() {
  const score = useStore(state => state.score);
  const remaining = useStore(state => state.meteoritosRestantes);
  const resetGame = useStore(state => state.resetGame);

  // Lógica de Cooldown (30 segundos)
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleReset = () => {
    if (cooldown === 0) {
      resetGame();
      setCooldown(30); // Inicia el bloqueo de 30 segundos
    }
  };

  return (
    <div className="hud-container" key={score}>
      <div className="hud-header-wrapper">
        <div className="header-bg-gradient"></div>
        <div className="hud-top-left">
          <div className="brand-group">
            <h1 className="brand-text">ÓRBITA</h1>
          </div>
          <div className="divider-vertical"></div>
          <div className="game-metrics">
            <div className="metric-box">
              <span className="m-label">SCORE</span>
              <span className="m-value">{score.toLocaleString()}</span>
            </div>
            <div className="metric-box">
              <span className="m-label">NEOS</span>
              <span className="m-value">{remaining}</span>
            </div>
          </div>
        </div>
        <div className="hud-top-right">
          <div className="status-indicator">
            <span className={cooldown > 0 ? "status-value-orange" : "status-value-green"}>
              SISTEMA: {cooldown > 0 ? `RECALIBRANDO [${cooldown}S]` : "ONLINE"}
            </span>
          </div>
        </div>
      </div>

      <div className="hud-bottom-bar">
        <div className="footer-bg-gradient"></div>
        <div className="horizontal-divider"></div>
        <div className="bottom-layout">
          <div className="bottom-left">
            <div className="controls-info">INTERACCIÓN: [ CLICK + ARRASTRE ]</div>
            <div className="api-info">DATA_SOURCE: NASA JPL API // REAL-TIME MONITORING</div>
          </div>
          <div className="bottom-center"></div>
          <div className="bottom-right">
            <button 
              className={`scanner-btn ${cooldown > 0 ? "disabled" : ""}`} 
              onClick={handleReset}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `ESCANER BLOQUEADO [${cooldown}S]` : "RECARGAR ESCÁNER"}
            </button>
          </div>
        </div>
      </div>
      <div className="crt-overlay"></div>
    </div>
  );
}
