import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../../store/useStore";
import * as THREE from "three";

/**
 * Componente Moon
 * Renderiza la Luna orbitando alrededor de la Tierra.
 */
export default function Moon() {
  const moonRef = useRef();
  const orbitRef = useRef();

  const setMoonWorldPos = useStore((state) => state.setMoonWorldPos);

  // Animación de traslación (órbita) y rotación de la Luna
  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.1; // Velocidad de órbita
      
      const moonPos = new THREE.Vector3(20, 0, 0);
      moonPos.applyEuler(orbitRef.current.rotation);
      setMoonWorldPos(moonPos);
    }
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.05; // Rotación propia
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh 
        ref={moonRef} 
        position={[20, 0, 0]} // Distancia relativa a la Tierra (centro)
        receiveShadow
      >
        <sphereGeometry args={[1.36, 32, 32]} /> {/* Tamaño escalado respecto a la Tierra */}
        <meshStandardMaterial 
          color="#888888" 
          roughness={1} 
          metalness={0} 
        />
      </mesh>
    </group>
  );
}
