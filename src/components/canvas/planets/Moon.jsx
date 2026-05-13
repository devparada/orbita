import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useStore } from "../../../store/useStore";
import * as THREE from "three";

/**
 * @component Moon
 * @description Renderiza la Luna. Contiene lógica propia de rotación y traslación
 * para orbitar dinámicamente alrededor de la Tierra de forma infinita. 
 * Actualiza constantemente su posición global en el Store para que el sistema 
 * de gravedad general y los Agujeros Negros defensores la detecten.
 */
export default function Moon() {
  const moonRef = useRef();
  const orbitRef = useRef();

  const setMoonWorldPos = useStore((state) => state.setMoonWorldPos);

  const [colorMap, setColorMap] = useState(null);

  useEffect(() => {
    // Carga segura: si el archivo local no existe, no crashea la app
    new THREE.TextureLoader().load(
      "/textures/moon.jpg",
      (tex) => setColorMap(tex)
    );
  }, []);

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
        <sphereGeometry args={[1.36, 32, 32]} />
        {colorMap ? (
          <meshStandardMaterial 
            map={colorMap} 
            roughness={0.9} 
            metalness={0.1} 
            emissive="#1a2b3c" 
            emissiveIntensity={0.8}
          />
        ) : (
          <meshStandardMaterial 
            color="#888888" 
            roughness={1} 
            metalness={0} 
            emissive="#1a2b3c" 
            emissiveIntensity={0.8}
          />
        )}
        {/* Luz lunar local: ilumina sutilmente los asteroides cercanos */}
        <pointLight color="#88ccff" intensity={50} distance={40} decay={2} />
      </mesh>
    </group>
  );
}
