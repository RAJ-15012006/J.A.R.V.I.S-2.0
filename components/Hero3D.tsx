/// <reference types="@react-three/fiber" />
'use client'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import { OrbitControls, Environment, ContactShadows, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import * as THREE from 'three'
import { DRACO_PATH, BASIS_PATH } from '../config/decoders'
import { useSettings } from './SettingsContext'

function DataLink({ v1, v2, color }: { v1: THREE.Vector3; v2: THREE.Vector3; color: string }) {
  const distance = v1.distanceTo(v2)
  const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5)
  const direction = new THREE.Vector3().subVectors(v2, v1).normalize()
  const up = new THREE.Vector3(0, 1, 0)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction)

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.004, 0.004, distance, 4]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  )
}

function DataPacket({ v1, v2, color, delay }: { v1: THREE.Vector3; v2: THREE.Vector3; color: string; delay: number }) {
  const packetRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * 0.4 + delay) % 1.0
    if (packetRef.current) {
      packetRef.current.position.copy(v1).lerp(v2, t)
    }
  })

  return (
    <mesh ref={packetRef}>
      <sphereGeometry args={[0.012, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  )
}

function AINeuralCore({ position, color }: { position: [number, number, number]; color: string }) {
  const aiGroupRef = useRef<THREE.Group>(null)
  const aiCoreRef = useRef<THREE.Mesh>(null)

  // Generate interlaced cylindrical node points
  const nodes = useRef<THREE.Vector3[]>(
    Array.from({ length: 10 }).map((_, i) => {
      const isUpper = i < 5
      const angle = ((i % 5) / 5) * Math.PI * 2 + (isUpper ? 0 : Math.PI / 5)
      const y = isUpper ? 0.22 : -0.22
      const r = 0.4
      return new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r)
    })
  )

  const links = useRef<[number, number][]>([
    // Upper ring connections
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
    // Lower ring connections
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 5],
    // Interlaced vertical/diagonal connections
    [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
    [0, 9], [1, 5], [2, 6], [3, 7], [4, 8]
  ])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (aiGroupRef.current) {
      aiGroupRef.current.rotation.y = -t * 0.22
      aiGroupRef.current.rotation.x = Math.sin(t * 0.08) * 0.06
    }
    if (aiCoreRef.current) {
      aiCoreRef.current.rotation.x = t * 0.6
      aiCoreRef.current.rotation.y = -t * 0.4
      const pulse = 1 + Math.sin(t * 5) * 0.05
      aiCoreRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <group position={position}>
      {/* Slow revolving core group */}
      <group ref={aiGroupRef}>
        {/* Central processor node */}
        <mesh ref={aiCoreRef}>
          <octahedronGeometry args={[0.12]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
        </mesh>
        
        {/* Nodes */}
        {nodes.current.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
        ))}

        {/* Links */}
        {links.current.map(([i, j], idx) => (
          <DataLink key={idx} v1={nodes.current[i]} v2={nodes.current[j]} color={color} />
        ))}

        {/* Data packets running along selected connections */}
        <DataPacket v1={nodes.current[0]} v2={nodes.current[1]} color={color} delay={0.0} />
        <DataPacket v1={nodes.current[2]} v2={nodes.current[3]} color={color} delay={0.3} />
        <DataPacket v1={nodes.current[4]} v2={nodes.current[0]} color={color} delay={0.6} />
        <DataPacket v1={nodes.current[1]} v2={nodes.current[6]} color={color} delay={0.15} />
        <DataPacket v1={nodes.current[3]} v2={nodes.current[8]} color={color} delay={0.45} />
        <DataPacket v1={nodes.current[7]} v2={nodes.current[8]} color={color} delay={0.75} />
      </group>

      {/* Cybernetic outer rings mapping parameters (flat coordinate markings) */}
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.56, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.56, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function HolographicPlaceholder() {
  const { settings } = useSettings()
  
  // Refs for the original top atom elements
  const groupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Original rotation math (unchanged)
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.35
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.7
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 1.1
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.4
      ring3Ref.current.rotation.y = t * 0.6
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 6) * 0.08
      coreRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  const color = settings.themeColor

  return (
    <group position={[0, 0, 0]}>
      {/* 1. ORIGINAL WIREFRAME ATOM (Shifted slightly upward to y: 0.55) */}
      <group ref={groupRef} position={[0, 0.55, 0]}>
        {/* Inner Glowing Reactor Sphere */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
        
        {/* Outer Wireframe Cage */}
        <mesh ref={ring3Ref}>
          <torusKnotGeometry args={[0.55, 0.09, 100, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} wireframe={true} />
        </mesh>

        {/* Rotating Ring 1 */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.85, 48]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
        
        {/* Rotating Ring 2 (Dashed/Segmented effect using thin rings) */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 2.3, Math.PI / 6, 0]}>
          <ringGeometry args={[1.0, 1.03, 64]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>

        {/* Horizontal grid base */}
        <gridHelper args={[2.0, 12, color, color]} position={[0, -0.6, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </gridHelper>

        {/* Cybernetic energy pillars */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const radius = 1.0
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <group key={i} position={[x, -0.1, z]}>
              <mesh>
                <cylinderGeometry args={[0.008, 0.008, 1.0, 4]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
              </mesh>
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.03, 0.03, 0.03]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
              </mesh>
              <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[0.03, 0.03, 0.03]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* 2. NEW SECONDARY AI NEURAL CORE (Positioned below the atom at y: -0.65) */}
      <AINeuralCore position={[0, -0.65, 0]} color={color} />
      
      {/* Symmetrical mid division line grid */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.42, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function ModelLoader({ onLoaded }:{onLoaded?:()=>void}){
  const { gl } = useThree()
  const [gltf, setGltf] = useState<null | GLTF>(null)

  useEffect(()=>{
    let mounted = true
    const loader = new GLTFLoader()
    const draco = new DRACOLoader()
    
    draco.setDecoderPath(DRACO_PATH)
    loader.setDRACOLoader(draco)

    const ktx2 = new KTX2Loader()
    ktx2.setTranscoderPath(BASIS_PATH)
    ktx2.detectSupport(gl)
    loader.setKTX2Loader(ktx2 as any)

    loader.load('/models/armor.glb', (g) => {
      if(!mounted) return
      setGltf(g)
      onLoaded && onLoaded()
    }, undefined, (err)=>{
      console.error('GLTF load error', err)
      // Provide fallback even on error
      if (mounted) onLoaded && onLoaded()
    })

    return ()=>{
      mounted = false
      draco.dispose()
      ktx2.dispose()
    }
  },[gl,onLoaded])

  if(!gltf) return <HolographicPlaceholder />
  return <primitive object={gltf.scene} dispose={null} />
}

export default function Hero3D(){
  const [loaded, setLoaded] = useState(false)
  const { settings } = useSettings()

  return (
    <div className="relative w-full h-[720px] rounded-xl overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      {/* Poster fallback shown until the GLB is loaded (SSR-friendly) */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            {/* Glowing arc-reactor style load spinner */}
            <div className="absolute inset-0 rounded-full border border-dashed animate-[spin_10s_linear_infinite]" style={{ borderColor: settings.themeColor, opacity: 0.4 }} />
            <div className="absolute inset-2 rounded-full border border-double animate-[spin_6s_linear_infinite_reverse]" style={{ borderColor: settings.themeColor, opacity: 0.6 }} />
            <div className="absolute inset-5 rounded-full border animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ borderColor: settings.themeColor, opacity: 0.3 }} />
            <div className="w-8 h-8 rounded-full blur-[2px] animate-pulse" style={{ backgroundColor: settings.themeColor }} />
          </div>
          <div className="text-xs uppercase tracking-[0.2em] font-mono animate-pulse" style={{ color: settings.themeColor }}>
            Initializing Core Systems...
          </div>
          <div className="text-[10px] text-gray-500 font-mono mt-1">LOADER COMPILATION: armor.glb</div>
        </div>
      )}

      <Canvas camera={{ position: [0, 1.4, 3.8], fov: 32 }}>
        <ambientLight intensity={settings.ambient} />
        {/* Directional Key Light with dynamic theme color tinting */}
        <directionalLight position={[6, 10, 6]} intensity={settings.directional} color={settings.themeColor} />
        {/* Dynamic Fill Light */}
        <directionalLight position={[-6, -4, -6]} intensity={settings.fill} color="#ffffff" />
        {/* Rim Light for high-tech contours */}
        <pointLight position={[0, 4, -4]} intensity={settings.glowIntensity} color={settings.themeColor} />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ModelLoader onLoaded={()=>setLoaded(true)} />
          <ContactShadows position={[0,-1,0]} opacity={0.6} blur={2.2} far={4} />
          {/* Sparkles connected to visual settings */}
          <Sparkles 
            count={settings.particleCount} 
            size={settings.particleSpeed * 4.5} 
            scale={[5, 2.5, 5]} 
            position={[0, 1.2, 0]} 
            speed={settings.particleSpeed * 0.3} 
            color={settings.themeColor}
          />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          maxDistance={6.0} 
          minDistance={2.0} 
          maxPolarAngle={Math.PI/2} 
          minPolarAngle={Math.PI/3.5} 
        />
        
        <EffectComposer>
          <Bloom luminanceThreshold={settings.bloomThreshold} intensity={settings.bloomIntensity} />
          <Noise opacity={settings.noiseOpacity} />
        </EffectComposer>
      </Canvas>

      {/* Futuristic Scanline Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,#00000000,#00000000 2px,rgba(255,255,255,0.015) 3px)] transition-opacity duration-300" 
        style={{ opacity: settings.scanlineOpacity * 6 }} 
      />
      <div 
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-40" 
      />
    </div>
  )
}

