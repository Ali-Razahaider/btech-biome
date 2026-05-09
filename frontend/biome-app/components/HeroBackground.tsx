"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const EarthParticles = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particleCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 4.0 + Math.random() * 0.2; // Increased radius
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = time * 0.02;
    
    // Subtle pulse effect
    const s = 1 + Math.sin(time * 0.5) * 0.03;
    pointsRef.current.scale.set(s, s, s);
  });

  return (
    <points ref={pointsRef} position={[0, -2.5, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#55D688"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const PollutionBubbles = () => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const bubbles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.5,
      size: 0.05 + Math.random() * 0.1,
      color: i % 3 === 0 ? "#64748b" : "#55D688", // Mix of gray and green
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const b = bubbles[i];
      child.position.y += Math.sin(time * b.speed + i) * 0.002;
      child.position.x += Math.cos(time * b.speed * 0.5 + i) * 0.001;
    });
  });

  return (
    <group ref={groupRef}>
      {bubbles.map((b, i) => (
        <mesh key={i} position={b.position}>
          <sphereGeometry args={[b.size, 16, 16]} />
          <meshBasicMaterial color={b.color} transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const PollutionParticles = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particleCount = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * -0.02;
    pointsRef.current.position.y = Math.sin(time * 0.1) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#64748b"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <EarthParticles />
        <PollutionParticles />
        <PollutionBubbles />
      </Canvas>
    </div>
  );
};

export default HeroBackground;
