import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import type { Group } from 'three'
import { Scene } from './index'
import { GRADES, LEVEL_COLOR, levelOf } from '../data/curriculum'

function GradePod({ g, i, onPick, label }: { g: string; i: number; onPick: () => void; label: string }) {
  const ref = useRef<Group>(null)
  const [hover, setHover] = useState(false)
  const a = ((i - 6) / 12) * Math.PI * 1.1
  const R = 9
  const pos: [number, number, number] = [Math.sin(a) * R, 0, -Math.cos(a) * R + 6]
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

/** Home page "campus": 13 grade pods on an arc. */
export default function Campus({ label, onPick, hint }: { label: (g: string) => string; onPick: (g: string) => void; hint: string }) {
  return (
    <Scene camera={[0, 5, 14]} hint={hint}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 2]}><circleGeometry args={[14, 64]} /><meshStandardMaterial color="#10173a" /></mesh>
      {GRADES.map((g, i) => <GradePod key={g} g={g} i={i} label={label(g)} onPick={() => onPick(g)} />)}
    </Scene>
  )
}
