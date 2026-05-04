import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { getMeteoritos } from "../../services/nasa";
import { useStore } from "../../store/useStore";
import * as THREE from "three";

// Importación de sub-componentes estructurados
import Meteorite from "./entities/Meteorite";
import ScoreLabel from "./effects/ScoreLabel";
import ImpactParticles from "./effects/ImpactParticles";

/**
 * @component Meteorites
 * @description Motor de física y orquestador del sistema de NEOs.
 */
export default function Meteorites() {
  const meteoritos = useStore(state => state.meteoritos);
  const setMeteoritos = useStore(state => state.setMeteoritos);
  const setInitialCount = useStore(state => state.setInitialCount);
  const { camera, size } = useThree();
  
  const [particles, setParticles] = useState([]);
  const [labels, setLabels] = useState([]);
  
  const sceneRef = useRef();
  const shake = useRef(new THREE.Vector3(0, 0, 0));
  const physicsStates = useRef([]);
  const BOUNDARY = 180;

  useEffect(() => {
    if (meteoritos.length > 0) return;
    
    getMeteoritos().then((data) => {
      if (!data || !Array.isArray(data)) return;
      
      const formatted = data.slice(0, 20).map((m, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 90;
        const rad = Math.max(0.2, (m.diameterMax / 3000) * 15);
        
        physicsStates.current[i] = {
          id: m.id,
          pos: { x: dist * Math.cos(angle), z: dist * Math.sin(angle) },
          vel: { x: 0, z: 0 },
          radius: rad, 
          visualRadius: rad, 
          mass: 1 + (m.diameterMax / 100),
          isEscaping: false, 
          isDragging: false, 
          pocketed: false
        };
        return { ...m };
      });
      
      setMeteoritos(formatted); 
      setInitialCount(formatted.length);
    });
  }, [meteoritos.length, setMeteoritos, setInitialCount]);

  useFrame((_state, delta) => {
    const bodies = physicsStates.current;
    if (!bodies.length) return;
    
    const { sunWorldPos, moonWorldPos } = useStore.getState();
    const dt = Math.min(delta, 0.05);
    const subSteps = 6;
    const sDt = dt / subSteps;

    shake.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
    if (sceneRef.current) sceneRef.current.position.copy(shake.current);

    for (let s = 0; s < subSteps; s++) {
      bodies.forEach(b => {
        if (!b || b.pocketed || b.isDragging || !b.isEscaping) return;
        
        b.pos.x += b.vel.x * sDt * 60;
        b.pos.z += b.vel.z * sDt * 60;
        
        if (Math.abs(b.pos.x) > BOUNDARY) { 
          b.vel.x *= -0.7; 
          b.pos.x = Math.sign(b.pos.x) * BOUNDARY; 
        }
        if (Math.abs(b.pos.z) > BOUNDARY) { 
          b.vel.z *= -0.7; 
          b.pos.z = Math.sign(b.pos.z) * BOUNDARY; 
        }
        
        b.vel.x *= 0.995; 
        b.vel.z *= 0.995;
        
        if (Math.abs(b.vel.x) + Math.abs(b.vel.z) < 0.005) { 
          b.vel.x = 0; b.vel.z = 0; b.isEscaping = false; 
        }
      });

      bodies.forEach((b1, i) => {
        if (!b1 || b1.pocketed) return;
        
        const targets = [
          { x: 0, z: 0, r: 16, pk: 16, pts: 100, c: "#4444ff" },
          { x: moonWorldPos.x, z: moonWorldPos.z, r: 8, pk: 8, pts: 500, c: "#ffffff" },
          { x: sunWorldPos.x, z: sunWorldPos.z, r: 12, pk: 12, pts: 50, c: "#ffff00" }
        ];

        targets.forEach(t => {
          const dx = b1.pos.x - t.x; 
          const dz = b1.pos.z - t.z;
          const d = Math.sqrt(dx * dx + dz * dz);
          
          if (d < (b1.radius + t.pk)) {
            b1.pocketed = true;
            useStore.getState().addScore(t.pts);
            setParticles(p => [...p.slice(-5), { id: Math.random(), pos: new THREE.Vector3(b1.pos.x, 0, b1.pos.z), color: t.c }]);
            setLabels(l => [...l.slice(-5), { id: Math.random(), pos: { x: b1.pos.x, z: b1.pos.z }, text: `+${t.pts}` }]);
            return;
          }
          
          if (d < b1.radius + t.r && b1.isEscaping) {
            const nx = dx / d; 
            const nz = dz / d;
            const dot = b1.vel.x * nx + b1.vel.z * nz;
            if (dot < 0) {
              b1.vel.x -= 2 * dot * nx * 0.8; 
              b1.vel.z -= 2 * dot * nz * 0.8;
              b1.pos.x += nx * 1.5; 
              b1.pos.z += nz * 1.5;
              shake.current.add(new THREE.Vector3((Math.random() - 0.5) * 1.5, 0, (Math.random() - 0.5) * 1.5));
            }
          }
        });

        if (b1.pocketed) return;

        for (let j = i + 1; j < bodies.length; j++) {
          const b2 = bodies[j];
          if (!b2 || b2.pocketed) continue;
          
          const dx = b2.pos.x - b1.pos.x; 
          const dz = b2.pos.z - b1.pos.z;
          const d = Math.sqrt(dx * dx + dz * dz);
          const minDist = b1.radius + b2.radius;
          
          if (d < minDist) {
            const nx = dx / d; 
            const nz = dz / d;
            const rVx = b1.vel.x - b2.vel.x; 
            const rVz = b1.vel.z - b2.vel.z;
            const vNorm = rVx * nx + rVz * nz;
            
            if (vNorm > 0) {
              const imp = (1.8 * vNorm) / ((1 / b1.mass) + (1 / b2.mass));
              b1.vel.x -= (imp / b1.mass) * nx; 
              b1.vel.z -= (imp / b1.mass) * nz;
              b2.vel.x += (imp / b2.mass) * nx; 
              b2.vel.z += (imp / b2.mass) * nz;
              b1.isEscaping = true; 
              b2.isEscaping = true;
              
              const overlap = (minDist - d) * 0.5;
              b1.pos.x -= nx * overlap; b1.pos.z -= nz * overlap;
              b2.pos.x += nx * overlap; b2.pos.z += nz * overlap;
            }
          }
        }
      });
    }
  });

  const handleShoot = (i, dx, dy) => {
    const b = physicsStates.current[i]; 
    if (!b) return;
    
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).setComponent(1, 0).normalize();
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1).setComponent(1, 0).normalize();
    
    const dir = new THREE.Vector3()
      .addScaledVector(right, dx / size.width)
      .addScaledVector(up, dy / size.height)
      .normalize();
    
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.05, 12);
    b.vel.x = dir.x * power; 
    b.vel.z = dir.z * power; 
    b.isEscaping = true;
  };

  return (
    <group ref={sceneRef}>
      {meteoritos.map((m, i) => (
        <Meteorite
          key={m.id}
          state={physicsStates.current[i]}
          onShoot={(dx, dy) => handleShoot(i, dx, dy)}
        />
      ))}
      {particles.map(p => <ImpactParticles key={p.id} position={p.pos} color={p.color} />)}
      {labels.map(l => <ScoreLabel key={l.id} position={l.pos} text={l.text} />)}
    </group>
  );
}
