import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

declare module 'framer-motion' {
  export const motion: any
  export const AnimatePresence: any
  export const useAnimation: any
  export const useMotionValue: any
  export const useTransform: any
}
