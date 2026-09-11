import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
import { Scene } from './index'

type BookInfo = { id: string; color: string; label: string }

function Book({ i, n, b }: { i: number; n: number; b: BookInfo }) {
  const ref = useRef<Group>(null)
  const [hover, setHover] = useState(false)
  const x = (i - (n - 1) / 2) * 0.75
  const h = 1.6 + ((i * 7) % 5) * 0.08
  useFrame((_, dt) => { if (ref.current) ref.current.position.y += ((hover ? 0.35 : 0) - ref.current.position.y) * dt * 10 })
  const pick = () => document.dispatchEvent(new CustomEvent('bba:pick', { detail: b.id }))
  return (
    <group position={[x, 0, 0]}>
      <group ref={ref} onClick={pick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <mesh position={[0, h / 2, 0]}><boxGeometry args={[0.55, h, 1.1]} /><meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={hover ? 0.35 : 0.05} /></mesh>
        <mesh position={[0.29, h / 2, 0]}><boxGeometry args={[0.02, h - 0.1, 1.05]} /><meshStandardMaterial color="#f5f0e1" /></mesh>
        <Html position={[0, h + 0.35, 0]} center><div className="label3d">{b.label}</div></Html>
      </group>
    </group>
  )
}

function Shelves({ books }: { books: BookInfo[] }) {
  const { width, height } = useThree((s) => s.size)
  const perRow = width < height ? 5 : 12
  const rows = Math.ceil(books.length / perRow)
  return (
    <>
      {Array.from({ length: rows }, (_, r) => {
        const slice = books.slice(r * perRow, (r + 1) * perRow)
        return (
          <group key={r} position={[0, (rows - 1 - r) * 2.4, 0]}>
            <mesh position={[0, -0.08, 0]}><boxGeometry args={[Math.max(4, slice.length * 0.8), 0.16, 1.6]} /><meshStandardMaterial color="#8d6e63" /></mesh>
            {slice.map((b, i) => <Book key={b.id} i={i} n={slice.length} b={b} />)}
          </group>
        )
      })}
    </>
  )
}

/** Grade page shelf: one book per subject; wraps onto extra shelves on phones. */
export default function Bookshelf({ books, hint }: { books: BookInfo[]; hint: string }) {
  const portrait = typeof window !== 'undefined' && window.innerWidth < window.innerHeight
  const perRow = portrait ? 5 : 12
  const rows = Math.ceil(books.length / perRow)
  const midY = (rows - 1) * 1.2
  return (
    <Scene camera={[0, midY + 2.5, Math.max(6, Math.min(books.length, perRow) * 0.75) + rows * 1.6]} target={[0, midY + 0.6, 0]} small hint={hint}>
      <Shelves books={books} />
    </Scene>
  )
}
