import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";

/**
 * @component ScoreLabel
 * @description Etiqueta de puntuación flotante que asciende y se desvanece.
 */
export default function ScoreLabel({ position, text }) {
  const ref = useRef();
  const [active, setActive] = useState(true);
  
  useFrame((state, delta) => {
    if (!active || !ref.current) return;
    
    // Movimiento vertical
    ref.current.position.y += delta * 15;
    
    // Desvanecimiento
    if (ref.current.material) {
      ref.current.material.opacity -= delta * 0.8;
      if (ref.current.material.opacity <= 0) setActive(false);
    }
  });

  return active ? (
    <Billboard position={[position.x, 15, position.z]}>
      <Text 
        ref={ref} 
        fontSize={6} 
        color="#00ff64" 
        anchorX="center" 
        anchorY="middle" 
        transparent 
        fontWeight="bold"
      >
        {text}
      </Text>
    </Billboard>
  ) : null;
}
