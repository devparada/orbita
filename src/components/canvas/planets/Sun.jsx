import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Componente Sun
 * Representa el Sol. Su posición es controlada por el componente padre.
 */
export default function Sun() {
  const sunRef = useRef();

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* El Sol visual */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshStandardMaterial
          emissive="#ffcc00"
          emissiveIntensity={2}
          color="#ffaa00"
        />
      </mesh>

      {/* Luz Direccional que siempre apunta al centro (la Tierra) */}
      <directionalLight 
        intensity={3.5} 
        color="#fffdeb"
        target-position={[0, 0, 0]}
        castShadow
      />
      
      {/* Luz puntual para el brillo local del Sol */}
      <pointLight 
        intensity={2000} 
        distance={150} 
        color="#ffcc00" 
      />
    </group>
  );
}
