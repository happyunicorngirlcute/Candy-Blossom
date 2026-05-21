"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function FlowerShape({ dark }: { dark: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const count = 8

  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      delay: i * 0.15,
    }))
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {petals.map((petal, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
          <mesh position={[
            Math.cos(petal.angle) * 1.4,
            Math.sin(i * 1.2) * 0.2,
            Math.sin(petal.angle) * 1.4,
          ]} rotation={[0.2, petal.angle, 0.3]}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <MeshDistortMaterial
              color={dark ? "#f2b5ce" : "#DA0D77"}
              transparent
              opacity={0.35}
              roughness={0.2}
              metalness={0.1}
              distort={0.15}
              speed={1.5}
            />
          </mesh>
        </Float>
      ))}
      <mesh>
        <sphereGeometry args={[0.5, 20, 20]} />
        <MeshDistortMaterial
          color={dark ? "#f2b5ce" : "#DA0D77"}
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.2}
          distort={0.1}
          speed={2}
        />
      </mesh>
    </group>
  )
}

function Particles({ count = 40, dark }: { count?: number; dark: boolean }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return pos
  }, [count])

  const ref = useRef<THREE.Points>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={dark ? "#f2b5ce" : "#DA0D77"}
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}

export default function HeroScene({ dark }: { dark: boolean }) {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <FlowerShape dark={dark} />
        <Particles dark={dark} />
      </Canvas>
    </div>
  )
}
