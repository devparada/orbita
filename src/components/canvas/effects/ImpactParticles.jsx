import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * @component ImpactParticles
 * @description Sistema de partículas que se dispara al impactar contra un objetivo.
 */
export default function ImpactParticles({ position, color }) {
  const pointsRef = useRef();
  const [active, setActive] = useState(true);
  const count = 15;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = position.x; 
      pos[i * 3 + 1] = 0; 
      pos[i * 3 + 2] = position.z;
      vel[i * 3] = (Math.random() - 0.5) * 2.5; 
      vel[i * 3 + 1] = 0; 
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    return [pos, vel];
  }, [position]);

  useFrame((_state, delta) => {
    if (!active || !pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3] += velocities[i * 3] * delta * 50;
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2] * delta * 50;
    }
    posAttr.needsUpdate = true;
    if (pointsRef.current.material) {
      pointsRef.current.material.opacity -= delta * 2.5;
      if (pointsRef.current.material.opacity <= 0) setActive(false);
    }
  });

  return active ? (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.35} transparent sizeAttenuation />
    </points>
  ) : null;
}
