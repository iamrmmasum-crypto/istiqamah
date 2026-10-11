"use client"

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

/**
 * Fixed cinematic backdrop: twilight washes, a fine dot grid and three
 * glowing orbs, each drifting at its own parallax rate while the page
 * scrolls — giving the whole site a sense of layered depth.
 */
export function DepthBackground() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.6 })

  const yA = useTransform(p, [0, 1], ["0%", "-34%"])
  const yB = useTransform(p, [0, 1], ["0%", "-70%"])
  const yC = useTransform(p, [0, 1], ["0%", "-120%"])
  const yGrid = useTransform(p, [0, 1], ["0px", "-140px"])
  const gridOpacity = useTransform(p, [0, 0.5, 1], [0.5, 0.3, 0.16])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(251,191,36,0.10),transparent_55%),radial-gradient(90%_70%_at_100%_30%,rgba(244,114,182,0.08),transparent_60%),radial-gradient(100%_80%_at_0%_80%,rgba(45,212,191,0.09),transparent_55%)] dark:bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(251,191,36,0.07),transparent_55%),radial-gradient(90%_70%_at_100%_30%,rgba(192,132,252,0.09),transparent_60%),radial-gradient(100%_80%_at_0%_80%,rgba(45,212,191,0.07),transparent_55%)]" />

      {/* fine dot grid, drifting slowly */}
      <motion.div
        style={reduced ? undefined : { y: yGrid, opacity: gridOpacity }}
        className="absolute -inset-x-0 -top-40 bottom-0 opacity-50 [background-image:radial-gradient(rgba(120,113,108,0.22)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(75%_60%_at_50%_35%,black,transparent)] dark:[background-image:radial-gradient(rgba(255,255,255,0.13)_1px,transparent_1px)]"
      />

      {/* parallax orbs */}
      <motion.div
        style={reduced ? undefined : { y: yA }}
        className="absolute left-[-12%] top-[8%] h-[42vmax] w-[42vmax] rounded-full bg-amber-300/25 blur-[110px] dark:bg-amber-500/12"
      />
      <motion.div
        style={reduced ? undefined : { y: yB }}
        className="absolute right-[-16%] top-[36%] h-[48vmax] w-[48vmax] rounded-full bg-rose-300/20 blur-[120px] dark:bg-rose-500/10"
      />
      <motion.div
        style={reduced ? undefined : { y: yC }}
        className="absolute left-[16%] top-[74%] h-[40vmax] w-[40vmax] rounded-full bg-teal-300/20 blur-[110px] dark:bg-teal-500/10"
      />

      {/* horizon glow that dims as you dive deeper */}
      <motion.div
        style={reduced ? undefined : { opacity: gridOpacity }}
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/70 to-transparent dark:from-[#0c0a09]/80"
      />
    </div>
  )
}
