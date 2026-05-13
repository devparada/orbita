import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

/**
 * @component Sun
 * @description Representa la estrella gigante (el objetivo final de mayor puntuación).
 * Almacena las luces principales del juego (PointLight masiva y DirectionalLight para las sombras).
 * Utiliza un sistema de "Fake Bloom" con un material extra en AdditiveBlending para lograr 
 * su característico resplandor abrasador sin recurrir a efectos pesados de postprocesado.
 */
export default function Sun() {
  const sunRef = useRef();
  const glowRef = useRef();

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.02);
    }
  });

  return (
    <group>
      {/* 1. Esfera base incandescente (sin textura) */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshStandardMaterial 
          emissive="#ff8800" 
          emissiveIntensity={5} 
          color="#ffcc00" 
          roughness={0} 
        />
      </mesh>

      {/* 2. Resplandor falso (Fake Bloom) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[13.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Luz Direccional principal de la escena */}
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
