import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "../../../store/useStore";
import * as THREE from "three";

/**
 * @component Meteorite
 * @description Entidad 3D que representa un único asteroide interactivo.
 * Gestiona de forma aislada sus eventos de ratón (arrastrar, apuntar y soltar), 
 * cambiando de material oscuro a luminoso cuando el jugador interactúa con él, 
 * y pintando la línea de predicción de trayectoria.
 */
export default function Meteorite({ state, onShoot }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const lineRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { camera, size } = useThree();
  const dragStart = useRef({ x: 0, y: 0 });
  const currentDelta = useRef({ x: 0, y: 0 });
  
  const setIsDraggingMeteorite = useStore(state => state.setIsDraggingMeteorite);

  useFrame(() => {
    if (!state || !meshRef.current || !materialRef.current) return;

    if (state.pocketed) {
      if (state.pocketTarget) {
        meshRef.current.position.lerp(
          new THREE.Vector3(state.pocketTarget.x, 0, state.pocketTarget.z),
          0.15
        );
      }
      meshRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.15);
      if (meshRef.current.scale.x < 0.01) meshRef.current.visible = false;
      return;
    }

    meshRef.current.position.set(state.pos.x, 0, state.pos.z);
    
    const isInteracting = hovered || state.isDragging;
    
    // Aspecto rocoso realista por defecto, se ilumina al interactuar
    materialRef.current.color.set(isInteracting ? "#ffffff" : "#aaaaaa");
    materialRef.current.emissive.set(isInteracting ? "#00ffff" : "#333333");
    materialRef.current.emissiveIntensity = isInteracting ? 2 : 1;

    // Rotación constante para que parezcan asteroides girando en el vacío
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.008;

    // ── Línea de apuntado al arrastrar ──────────────────────────────────
    if (state.isDragging && lineRef.current) {
      lineRef.current.visible = true;
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).setComponent(1, 0).normalize();
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1).setComponent(1, 0).normalize();
      const dir = new THREE.Vector3()
        .addScaledVector(right, currentDelta.current.x / size.width)
        .addScaledVector(up, currentDelta.current.y / size.height)
        .normalize();
      
      const dist = Math.sqrt(currentDelta.current.x ** 2 + currentDelta.current.y ** 2);
      const points = [
        new THREE.Vector3(state.pos.x, 0, state.pos.z), 
        new THREE.Vector3(state.pos.x, 0, state.pos.z).addScaledVector(dir, Math.min(dist * 0.15, 45))
      ];
      lineRef.current.geometry.setFromPoints(points);
      lineRef.current.material.color.setHSL(0.5 - Math.min(dist / 300, 0.5), 1, 0.5);
    } else if (lineRef.current) {
      lineRef.current.visible = false;
    }
  });

  return (
    <group>
      {/* Meteorito principal */}
      <mesh ref={meshRef}
        onPointerOver={() => !state.pocketed && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(e) => {
          if (state.pocketed) return;
          e.stopPropagation();
          e.target.setPointerCapture(e.pointerId);
          state.isDragging = true;
          dragStart.current = { x: e.clientX, y: e.clientY };
          setIsDraggingMeteorite(true);
        }}
        onPointerMove={(e) => {
          if (state.isDragging) {
            currentDelta.current = { x: e.clientX - dragStart.current.x, y: dragStart.current.y - e.clientY };
          }
        }}
        onPointerUp={(e) => {
          if (state.isDragging) {
            e.stopPropagation();
            e.target.releasePointerCapture(e.pointerId);
            state.isDragging = false;
            setIsDraggingMeteorite(false);
            onShoot(currentDelta.current.x, currentDelta.current.y);
          }
        }}
      >
        <dodecahedronGeometry args={[state.visualRadius * 2.2, 1]} />
        <meshStandardMaterial 
          ref={materialRef} 
          roughness={0.9} 
          metalness={0.1} 
          flatShading 
        />
        <mesh visible={false}>
          <sphereGeometry args={[state.visualRadius * 2.2 + 2, 8, 8]} />
        </mesh>
      </mesh>

      {/* Línea de apuntado */}
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial transparent opacity={0.6} linewidth={2} />
      </line>
    </group>
  );
}
