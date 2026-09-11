import { Suspense, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, Float, Html, OrbitControls, Stars } from '@react-three/drei'
import type { Group } from 'three'
import { useSettings, useT, num } from '../i18n'

/** Shared canvas wrapper: stars, lights, orbit controls, adaptive resolution. */
export function Scene({ children, camera = [0, 4, 12], target = [0, 0, 0], small, hint, controls = true }: { children: ReactNode; camera?: [number, number, number]; target?: [number, number, number]; small?: boolean; hint?: string; controls?: boolean }) {
  return (
    <div className={`scene ${small ? 'small' : ''}`}>
      <Canvas dpr={[1, 1.5]} camera={{ position: camera, fov: 45 }} gl={{ antialias: true, powerPreference: 'low-power' }}>
        <color attach="background" args={['#0b1020']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <pointLight position={[-6, 4, -4]} intensity={0.6} color="#3a86ff" />
        <Stars radius={60} depth={30} count={1200} factor={3} fade speed={0.4} />
        <Suspense fallback={null}>{children}</Suspense>
        {controls && <OrbitControls target={target} enablePan={false} minDistance={4} maxDistance={40} maxPolarAngle={Math.PI * 0.55} />}
        <AdaptiveDpr pixelated />
      </Canvas>
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

// ---------------------------------------------------------------- Atom (chemistry)
type Elem = { p: number; n: number; shells: number[]; my: string; en: string }
export const ELEMENTS: Record<string, Elem> = {
  H: { p: 1, n: 0, shells: [1], my: 'ဟိုက်ဒရိုဂျင်', en: 'Hydrogen' },
  He: { p: 2, n: 2, shells: [2], my: 'ဟီလီယမ်', en: 'Helium' },
  Li: { p: 3, n: 4, shells: [2, 1], my: 'လီသီယမ်', en: 'Lithium' },
  C: { p: 6, n: 6, shells: [2, 4], my: 'ကာဗွန်', en: 'Carbon' },
  N: { p: 7, n: 7, shells: [2, 5], my: 'နိုက်ထရိုဂျင်', en: 'Nitrogen' },
  O: { p: 8, n: 8, shells: [2, 6], my: 'အောက်ဆီဂျင်', en: 'Oxygen' },
  Na: { p: 11, n: 12, shells: [2, 8, 1], my: 'ဆိုဒီယမ်', en: 'Sodium' },
  Mg: { p: 12, n: 12, shells: [2, 8, 2], my: 'မဂ္ဂနီစီယမ်', en: 'Magnesium' },
  Cl: { p: 17, n: 18, shells: [2, 8, 7], my: 'ကလိုရင်း', en: 'Chlorine' },
  Ca: { p: 20, n: 20, shells: [2, 8, 8, 2], my: 'ကယ်လ်စီယမ်', en: 'Calcium' },
}

function Shell({ radius, electrons, speed }: { radius: number; electrons: number; speed: number }) {
  const g = useRef<Group>(null)
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * speed })
  const tilt = useMemo(() => (Math.random() - 0.5) * 0.8, [])
  return (
    <group rotation={[tilt, 0, tilt * 0.6]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, 0.015, 8, 96]} /><meshBasicMaterial color="#9aa3c7" transparent opacity={0.5} /></mesh>
      <group ref={g}>
        {Array.from({ length: electrons }).map((_, i) => {
          const a = (i / electrons) * Math.PI * 2
          return <mesh key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color="#ffd166" emissive="#ffb703" emissiveIntensity={0.8} /></mesh>
        })}
      </group>
    </group>
  )
}
export function AtomScene({ element = 'C' }: { element?: string }) {
  const e = ELEMENTS[element] ?? ELEMENTS.C
  const { lang } = useT()
  const nucleons = useMemo(() => {
    const total = e.p + e.n
    const r = 0.22 * Math.cbrt(total)
    return Array.from({ length: total }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / total), th = Math.PI * (1 + Math.sqrt(5)) * i
      const order = i % 2 === 0 ? i / 2 : Math.ceil(total / 2) + (i - 1) / 2
      return { pos: [r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi)] as [number, number, number], proton: order < e.p }
    })
  }, [e])
  const totalE = e.shells.reduce((a, b) => a + b, 0)
  return (
    <Scene camera={[0, 3, 9]} small>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {nucleons.map((n, i) => <mesh key={i} position={n.pos}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color={n.proton ? '#ef476f' : '#3a86ff'} /></mesh>)}
        {e.shells.map((count, i) => <Shell key={i} radius={1.4 + i * 0.9} electrons={count} speed={1.6 - i * 0.35} />)}
      </Float>
      <Html position={[0, 3.2, 0]} center><div className="label3d">{lang === 'my' ? e.my : e.en} ({element}) · p⁺ {num(e.p, lang)} · n⁰ {num(e.n, lang)} · e⁻ {num(totalE, lang)}</div></Html>
    </Scene>
  )
}

// ---------------------------------------------------------------- Solar system (science)
const PLANETS = [
  { my: 'ဗုဒ္ဓဟူးဂြိုဟ်', en: 'Mercury', r: 0.18, d: 2.2, s: 1.6, c: '#b5b5b5' },
  { my: 'သောကြာဂြိုဟ်', en: 'Venus', r: 0.28, d: 3.0, s: 1.2, c: '#e8c07d' },
  { my: 'ကမ္ဘာ', en: 'Earth', r: 0.3, d: 3.9, s: 1.0, c: '#3a86ff' },
  { my: 'အင်္ဂါဂြိုဟ်', en: 'Mars', r: 0.22, d: 4.8, s: 0.8, c: '#e07a5f' },
  { my: 'ကြာသပတေးဂြိုဟ်', en: 'Jupiter', r: 0.7, d: 6.4, s: 0.45, c: '#d9a066' },
  { my: 'စနေဂြိုဟ်', en: 'Saturn', r: 0.6, d: 8.2, s: 0.34, c: '#f1d9a1', ring: true },
  { my: 'ယူရေးနပ်စ်ဂြိုဟ်', en: 'Uranus', r: 0.42, d: 9.8, s: 0.24, c: '#8fd3e8' },
  { my: 'နက်ပကျွန်းဂြိုဟ်', en: 'Neptune', r: 0.4, d: 11.2, s: 0.19, c: '#4361ee' },
]
function Planet({ p, showLabel, lang }: { p: (typeof PLANETS)[number]; showLabel: boolean; lang: 'my' | 'en' }) {
  const g = useRef<Group>(null)
  const start = useMemo(() => Math.random() * Math.PI * 2, [])
  useFrame(({ clock }) => { if (g.current) g.current.rotation.y = start + clock.elapsedTime * p.s * 0.5 })
  return (
    <group ref={g}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[p.d - 0.01, p.d + 0.01, 96]} /><meshBasicMaterial color="#334" side={2} /></mesh>
      <group position={[p.d, 0, 0]}>
        <mesh><sphereGeometry args={[p.r, 24, 24]} /><meshStandardMaterial color={p.c} /></mesh>
        {p.ring && <mesh rotation={[Math.PI / 2.4, 0, 0]}><ringGeometry args={[p.r * 1.3, p.r * 2, 48]} /><meshBasicMaterial color="#d9c9a0" side={2} transparent opacity={0.8} /></mesh>}
        {showLabel && <Html position={[0, p.r + 0.35, 0]} center><div className="label3d">{lang === 'my' ? p.my : p.en}</div></Html>}
      </group>
    </group>
  )
}
export function SolarScene({ labels = true }: { labels?: boolean }) {
  const { lang } = useT()
  return (
    <Scene camera={[0, 9, 15]}>
      <mesh><sphereGeometry args={[1.1, 32, 32]} /><meshStandardMaterial color="#ffb703" emissive="#ff9f1c" emissiveIntensity={1.4} /></mesh>
      <pointLight intensity={30} distance={40} color="#fff1c1" />
      <Html position={[0, 1.6, 0]} center><div className="label3d">{lang === 'my' ? 'နေ' : 'Sun'}</div></Html>
      {PLANETS.map((p) => <Planet key={p.en} p={p} showLabel={labels} lang={lang} />)}
    </Scene>
  )
}

// ---------------------------------------------------------------- Simple pendulum (physics)
export function PendulumScene({ length = 2, g = 9.8, theta0 = 0.5 }: { length?: number; g?: number; theta0?: number }) {
  const pivot = useRef<Group>(null)
  const { lang } = useT()
  const [L, setL] = useState(length)
  const T = 2 * Math.PI * Math.sqrt(L / g)
  useFrame(({ clock }) => { if (pivot.current) pivot.current.rotation.z = theta0 * Math.cos(Math.sqrt(g / L) * clock.elapsedTime) })
  return (
    <div>
      <Scene camera={[0, 0.5, 7]} small controls={false}>
        <mesh position={[0, 2.5, 0]}><boxGeometry args={[3, 0.15, 0.6]} /><meshStandardMaterial color="#8d6e63" /></mesh>
        <group ref={pivot} position={[0, 2.4, 0]}>
          <mesh position={[0, -L / 2, 0]}><cylinderGeometry args={[0.02, 0.02, L, 8]} /><meshStandardMaterial color="#e8ecff" /></mesh>
          <mesh position={[0, -L, 0]}><sphereGeometry args={[0.28, 24, 24]} /><meshStandardMaterial color="#ef476f" metalness={0.3} roughness={0.4} /></mesh>
        </group>
        <Html position={[0, -2.2, 0]} center><div className="label3d">L = {num(L.toFixed(1), lang)} m · g = {num(g, lang)} m/s² · T = 2π√(L/g) = {num(T.toFixed(2), lang)} s</div></Html>
      </Scene>
      <div className="row" style={{ marginTop: '.5rem' }}>
        <label className="muted">{lang === 'my' ? 'ကြိုးအရှည် (L)' : 'Length (L)'}</label>
        <input type="range" min={0.5} max={3} step={0.1} value={L} onChange={(e) => setL(Number(e.target.value))} />
      </div>
    </div>
  )
}

export const SCENES: Record<string, (props: Record<string, unknown>) => ReactNode> = {
  atom: (p) => <AtomScene element={p.element as string} />,
  solar: (p) => <SolarScene labels={p.labels as boolean | undefined} />,
  pendulum: (p) => <PendulumScene length={p.length as number | undefined} g={p.g as number | undefined} theta0={p.theta0 as number | undefined} />,
}

export function SceneOrFallback({ name, params }: { name: string; params?: Record<string, unknown> }) {
  const use3D = useSettings((s) => s.use3D)
  const { t } = useT()
  const render = SCENES[name]
  if (!render) return <div className="notice">Unknown scene "{name}"</div>
  if (!use3D) return <div className="notice">{t('twoD')} — {t('threeD')} {t('off')}. <button className="chip" onClick={() => useSettings.getState().setUse3D(true)}>{t('threeD')} {t('on')}</button></div>
  return <>{render(params ?? {})}</>
}
