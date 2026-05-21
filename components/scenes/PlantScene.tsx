"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function PlantModel({ dark }: { dark: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const stemRef = useRef<THREE.Mesh>(null)

  const petalColors = dark
    ? ["#f2b5ce", "#e88dae", "#d4658e", "#c4456e"]
    : ["#DA0D77", "#b80a62", "#96084d", "#740538"]

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Stem */}
      <mesh ref={stemRef} position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.6, 8]} />
        <meshStandardMaterial color={dark ? "#2d5a27" : "#4a8f3f"} transparent opacity={0.7} />
      </mesh>

      {/* Leaves on stem */}
      {[-0.6, 0.2].map((y, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.4} floatIntensity={0.3}>
          <mesh position={[0.4, y, 0]} rotation={[0.3, 0.5, i === 0 ? 0.8 : -0.8]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <MeshDistortMaterial
              color={dark ? "#3a7a32" : "#5cb85c"}
              transparent
              opacity={0.4}
              roughness={0.5}
              distort={0.3}
              speed={1}
            />
          </mesh>
        </Float>
      ))}

      {/* Flower petals */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh
              position={[Math.cos(angle) * 0.6, 0.5, Math.sin(angle) * 0.6]}
              rotation={[0.3, angle, 0.2]}
            >
              <sphereGeometry args={[0.25, 12, 12]} />
              <MeshDistortMaterial
                color={petalColors[i % petalColors.length]}
                transparent
                opacity={0.6}
                roughness={0.2}
                metalness={0.1}
                distort={0.2}
                speed={2}
              />
            </mesh>
          </Float>
        )
      })}

      {/* Center */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <MeshDistortMaterial
          color={dark ? "#ffd700" : "#ffb300"}
          transparent
          opacity={0.7}
          roughness={0.3}
          metalness={0.2}
          distort={0.1}
          speed={1.5}
        />
      </mesh>
    </group>
  )
}

function Particles({ count = 30, dark }: { count?: number; dark: boolean }) {
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
    if (ref.current) ref.current.rotation.y += delta * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={dark ? "#f2b5ce" : "#DA0D77"} transparent opacity={0.25} sizeAttenuation />
    </points>
  )
}

export default function PlantScene({ dark }: { dark: boolean }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 4, 4]} intensity={0.6} />
        <directionalLight position={[-3, -3, -3]} intensity={0.2} />
        <PlantModel dark={dark} />
        <Particles dark={dark} />
      </Canvas>
    </div>
  )
}
