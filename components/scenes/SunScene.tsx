"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function SunModel({ dark }: { dark: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const coreColor = dark ? "#fbbf24" : "#f59e0b"
  const glowColor = dark ? "#fcd34d" : "#f97316"

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.1
      groupRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.02)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer glow rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0.2 * i, 0.3 * i, 0]}>
          <torusGeometry args={[0.8 + i * 0.3, 0.02, 16, 32]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.15 - i * 0.04} />
        </mesh>
      ))}

      {/* Rays */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <Float key={i} speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
            <mesh
              position={[Math.cos(angle) * 1.1, Math.sin(angle) * 1.1, 0]}
              rotation={[0, 0, angle]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <MeshDistortMaterial
                color={glowColor}
                transparent
                opacity={0.3}
                distort={0.3}
                speed={2}
              />
            </mesh>
          </Float>
        )
      })}

      {/* Core */}
      <Float speed={3} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh>
          <sphereGeometry args={[0.5, 24, 24]} />
          <MeshDistortMaterial
            color={coreColor}
            transparent
            opacity={0.6}
            roughness={0.1}
            metalness={0.1}
            distort={0.08}
            speed={2}
          />
        </mesh>
      </Float>
    </group>
  )
}

function Particles({ count = 35, dark }: { count?: number; dark: boolean }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [count])

  const ref = useRef<THREE.Points>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.025
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={dark ? "#fbbf24" : "#f59e0b"} transparent opacity={0.2} sizeAttenuation />
    </points>
  )
}

export default function SunScene({ dark }: { dark: boolean }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 3, 3]} intensity={0.6} />
        <SunModel dark={dark} />
        <Particles dark={dark} />
      </Canvas>
    </div>
  )
}
