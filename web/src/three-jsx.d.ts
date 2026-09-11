// react-three-fiber v9 + React 19: register <mesh>, <group>, <sphereGeometry> … as JSX intrinsic elements.
import type { ThreeElements } from '@react-three/fiber'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
