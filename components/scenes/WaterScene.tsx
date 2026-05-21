"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function WaterDropModel({ dark }: { dark: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const color = dark ? "#60a5fa" : "#3b82f6"

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
      groupRef.current.position.y = Math.sin(Date.now() * 0.0015) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main drop */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.5, 20, 20]} />
          <MeshDistortMaterial
            color={color}
            transparent
            opacity={0.5}
            roughness={0.1}
            metalness={0.3}
            distort={0.1}
            speed={1.5}
          />
        </mesh>
      </Float>

      {/* Ripples */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.4 - i * 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3 + i * 0.15, 0.35 + i * 0.15, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.15 - i * 0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Small surrounding drops */}
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <Float key={i} speed={1.5} floatIntensity={0.5}>
            <mesh position={[Math.cos(angle) * 0.9, -0.1 + Math.sin(i * 2) * 0.15, Math.sin(angle) * 0.9]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={color} transparent opacity={0.3} />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

function Particles({ count = 25, dark }: { count?: number; dark: boolean }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [count])

  const ref = useRef<THREE.Points>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={dark ? "#60a5fa" : "#3b82f6"} transparent opacity={0.2} sizeAttenuation />
    </points>
  )
}

export default function WaterScene({ dark }: { dark: boolean }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 4, 4]} intensity={0.7} />
        <WaterDropModel dark={dark} />
        <Particles dark={dark} />
      </Canvas>
    </div>
  )
}
