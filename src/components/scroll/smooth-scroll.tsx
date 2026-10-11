"use client"

import { type ReactNode } from "react"
import { ReactLenis, useLenis } from "lenis/react"
import { useReducedMotion } from "framer-motion"

/**
 * Buttery, inertial "custom scroll" for the whole site.
 * Disabled entirely when the user prefers reduced motion — the page then
 * falls back to plain native scrolling and static scenes.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  if (reduced) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.095,
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.35,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      {children}
    </ReactLenis>
  )
}

/** Scroll to an anchor section, honoring Lenis when active. */
export function useScrollToSection() {
  const lenis = useLenis()

  return (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) {
      lenis.scrollTo(el, { offset: -72, duration: 1.4 })
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
}
