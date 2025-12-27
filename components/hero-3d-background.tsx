'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FloatingParticles() {
  const count = 150
  const meshRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15

      // Random colors between white and purple
      const colorChoice = Math.random()
      if (colorChoice > 0.5) {
        colors[i * 3] = 0.47     // R for #7877c6
        colors[i * 3 + 1] = 0.47 // G
        colors[i * 3 + 2] = 0.78 // B
      } else {
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1
      }
    }
    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.rotation.y = time * 0.05

      // Wave animation
      const positionAttribute = meshRef.current.geometry.attributes.position
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = positionAttribute.array[i3]
        const z = positionAttribute.array[i3 + 2]

        positionAttribute.array[i3 + 1] += Math.sin(time + x + z) * 0.002
      }
      positionAttribute.needsUpdate = true
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Sound wave visualization
function SoundWave({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={groupRef} position={position}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[(i - 2) * 0.4, 0, 0]}>
            <boxGeometry args={[0.15, 1 + Math.sin(i) * 0.5, 0.15]} />
            <meshStandardMaterial
              color="#7877c6"
              emissive="#7877c6"
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// AI Node - represents data processing
function AINode({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          emissive="#ffffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

// Waveform ring
function WaveformRing({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.5
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[1.2, 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#7877c6"
          emissive="#7877c6"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  )
}

function CameraRig() {
  const { camera, mouse } = useThree()

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.3, 0.03)
    camera.lookAt(0, 0, 0)
  })

  return null
}

function Scene() {
  return (
    <>
      {/* Camera Animation */}
      <CameraRig />

      {/* Lighting - enhanced for visibility */}
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#7877c6" />
      <pointLight position={[0, 0, 10]} intensity={1} color="#ffffff" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} color="#7877c6" />

      {/* Floating Particles - representing data points */}
      <FloatingParticles />

      {/* AI/Voice themed 3D elements */}
      <SoundWave position={[-4, 1, -4]} />
      <SoundWave position={[4, -1, -5]} />
      <SoundWave position={[0, 3, -6]} />

      <AINode position={[-3, -2, -3]} />
      <AINode position={[3, 2, -4]} />
      <AINode position={[-5, 3, -5]} />
      <AINode position={[5, -2, -3]} />

      <WaveformRing position={[0, 0, -7]} />
      <WaveformRing position={[-4, 2, -5]} />
      <WaveformRing position={[4, -3, -6]} />
    </>
  )
}

export default function Hero3DBackground() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{
          width: '100%',
          height: '100%'
        }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
