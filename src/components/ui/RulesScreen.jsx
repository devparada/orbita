import { useState, useEffect } from "react";
import "./RulesScreen.css";

const RULES = [
  {
    icon: "🌙",
    name: "Luna",
    desc: "Lanza un meteorito hacia la Luna para anotarte puntos.",
    pts: "+50",
    type: "positive",
  },
  {
    icon: "☀️",
    name: "Sol",
    desc: "El objetivo más difícil. ¡Alto riesgo, alta recompensa!",
    pts: "+150",
    type: "positive",
  },
  {
    icon: "🌍",
    name: "Tierra",
    desc: "Impactar la Tierra penaliza tu puntuación. ¡Evítalo!",
    pts: "-20",
    type: "negative",
  },
  {
    icon: "🕳️",
    name: "Agujero Negro",
    desc: "Si tu meteorito en vuelo toca uno, es absorbido y pierdes puntos.",
    pts: "-30",
    type: "negative",
  },
];

/**
 * @component RulesScreen
 * @description Modal de reglas que aparece tras el LoadingScreen.
 * Se muestra cuando apiLoaded es true y desaparece al pulsar INICIAR.
 */
export default function RulesScreen({ apiLoaded }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Espera a que la carga termine para mostrarse
  useEffect(() => {
    if (!apiLoaded) return;
    // Pequeño delay para que el fade-out del LoadingScreen termine primero
    const timer = setTimeout(() => setVisible(true), 1400);
    return () => clearTimeout(timer);
  }, [apiLoaded]);

  const handleStart = () => {
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className={`rules-screen ${!visible ? "hidden" : ""}`}>
      <div className="rules-panel">
        {/* CRT scanline */}
        <div className="rules-scanline" />

        {/* Cabecera */}
        <div className="rules-header">
          <span className="rules-eyebrow">PROTOCOLO DE MISIÓN</span>
          <h2 className="rules-title">ÓRBITA</h2>
          <span className="rules-subtitle">
            SISTEMA DE INTERCEPCIÓN DE NEOs // NASA JPL DATA
          </span>
        </div>

        <div className="rules-divider" />

        {/* Lista de reglas */}
        <div className="rules-list">
          {RULES.map((rule) => (
            <div className="rule-item" key={rule.name}>
              <span className="rule-icon">{rule.icon}</span>
              <div className="rule-body">
                <span className="rule-name">{rule.name}</span>
                <span className="rule-desc">{rule.desc}</span>
              </div>
              <span className={`rule-pts pts-${rule.type}`}>{rule.pts}</span>
            </div>
          ))}
        </div>

        <div className="rules-divider" />

        {/* Instrucción de control */}
        <div className="rule-item">
          <span className="rule-icon">🖱️</span>
          <div className="rule-body">
            <span className="rule-name">Control</span>
            <span className="rule-desc">
              Haz <strong>click y arrastra</strong> sobre un meteorito para apuntar.
              Suelta para disparar. La dirección y potencia dependen del arrastre.
            </span>
          </div>
        </div>

        {/* Botón de inicio */}
        <button
          id="rules-start-btn"
          className="rules-start-btn"
          onClick={handleStart}
        >
          ▶ &nbsp; INICIAR MISIÓN
        </button>
      </div>
    </div>
  );
}
