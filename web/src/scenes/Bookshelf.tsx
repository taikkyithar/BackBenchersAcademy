import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
import { Scene } from './index'

function Book({ i, n, color, label, onPick }: { i: number; n: number; color: string; label: string; onPick: () => void }) {
  const ref = useRef<Group>(null)
  const [hover, setHover] = useState(false)
  const x = (i - (n - 1) / 2) * 0.75
  const h = 1.6 + ((i * 7) % 5) * 0.08
  useFrame((_, dt) => { if (ref.current) ref.current.position.y += ((hover ? 0.35 : 0) - ref.current.position.y) * dt * 10 })
  return (
    <group position={[x, 0, 0]}>
      <group ref={ref} onClick={onPick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <mesh position={[0, h / 2, 0]}><boxGeometry args={[0.55, h, 1.1]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hover ? 0.35 : 0.05} /></mesh>
        <mesh position={[0.29, h / 2, 0]}><boxGeometry args={[0.02, h - 0.1, 1.05]} /><meshStandardMaterial color="#f5f0e1" /></mesh>
        <Html position={[0, h + 0.35, 0]} center><div className="label3d">{label}</div></Html>
      </group>
    </group>
  )
}

/** Grade page shelf: one book per subject. */
export default function Bookshelf({ books, hint }: { books: { id: string; color: string; label: string }[]; hint: string }) {
  const n = books.length
  return (
    <Scene camera={[0, 2.5, Math.max(6, n * 0.75)]} small hint={hint}>
      <mesh position={[0, -0.08, 0]}><boxGeometry args={[Math.max(6, n * 0.8), 0.16, 1.6]} /><meshStandardMaterial color="#8d6e63" /></mesh>
      {books.map((b, i) => <Book key={b.id} i={i} n={n} color={b.color} label={b.label} onPick={() => document.dispatchEvent(new CustomEvent('bba:pick', { detail: b.id }))} />)}
    </Scene>
  )
}
