import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import type { Group } from 'three'
import { Scene } from './index'
import { GRADES, LEVEL_COLOR, levelOf } from '../data/curriculum'

function GradePod({ g, pos, onPick, label }: { g: string; pos: [number, number, number]; onPick: () => void; label: string }) {
  const ref = useRef<Group>(null)
  const [hover, setHover] = useState(false)
  useFrame((_, dt) => {
    if (!ref.current) return
    const s = hover ? 1.25 : 1
    ref.current.scale.x += (s - ref.current.scale.x) * dt * 8
    ref.current.scale.y = ref.current.scale.z = ref.current.scale.x
  })
  const color = LEVEL_COLOR[levelOf(g)]
  return (
    <group position={pos}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={ref} onClick={onPick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
          <mesh><cylinderGeometry args={[0.9, 1.1, 0.5, 8]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.85, 0]}><boxGeometry args={[1.2, 1.2, 1.2]} /><meshStandardMaterial color="#1c2447" emissive={color} emissiveIntensity={hover ? 0.6 : 0.15} /></mesh>
          <Html position={[0, 2.1, 0]} center><div className="label3d">{label}</div></Html>
        </group>
      </Float>
    </group>
  )
}

/** Landscape: pods on an arc. Portrait (phones): a path receding into the distance, KG nearest. */
function Pods({ label, onPick }: { label: (g: string) => string; onPick: (g: string) => void }) {
  const { width, height } = useThree((s) => s.size)
  const portrait = width < height
  return (
    <>
      {GRADES.map((g, i) => {
        let pos: [number, number, number]
        if (portrait) pos = [i % 2 ? 1.6 : -1.6, 0, 5 - i * 1.8]
        else { const a = ((i - 6) / 12) * Math.PI * 1.1; pos = [Math.sin(a) * 9, 0, -Math.cos(a) * 9 + 6] }
        return <GradePod key={g} g={g} pos={pos} label={label(g)} onPick={() => onPick(g)} />
      })}
    </>
  )
}

export default function Campus({ label, onPick, hint }: { label: (g: string) => string; onPick: (g: string) => void; hint: string }) {
  const portrait = typeof window !== 'undefined' && window.innerWidth < window.innerHeight
  return (
    <Scene camera={portrait ? [0, 7, 12] : [0, 5, 14]} target={portrait ? [0, 0, -5] : [0, 0, 0]} hint={hint}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, portrait ? -6 : 2]}><circleGeometry args={[16, 64]} /><meshStandardMaterial color="#10173a" /></mesh>
      <Pods label={label} onPick={onPick} />
    </Scene>
  )
}
