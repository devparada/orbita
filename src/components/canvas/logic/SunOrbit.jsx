import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../../store/useStore";
import * as THREE from "three";
import Sun from "../planets/Sun";

/**
 * @component SunOrbit
 * @description Gestiona la traslación del Sol alrededor de la Tierra y actualiza el Store.
 */
export default function SunOrbit() {
  const orbitRef = useRef();
  const setSunWorldPos = useStore((state) => state.setSunWorldPos);
  const SUN_DISTANCE = 250;

  useFrame((_state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.05;
      
      const sunPos = new THREE.Vector3(SUN_DISTANCE, 0, 0);
      sunPos.applyEuler(orbitRef.current.rotation);
      setSunWorldPos(sunPos);
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[SUN_DISTANCE, 0, 0]}>
        <Sun />
      </group>
    </group>
  );
}
