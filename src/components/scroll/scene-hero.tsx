"use client"

import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"

/**
 * Pinned cinematic hero: while the first viewport-and-a-half scrolls by,
 * the hero card tilts back into depth (rotateX), shrinks and fades —
 * as if the page is diving *into* the app beneath it.
 */
export function HeroScene({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const p = useSpring(scrollYProgress, { stiffness: 95, damping: 24, mass: 0.5 })

  const rotateX = useTransform(p, [0, 1], [0, -13])
  const scale = useTransform(p, [0, 1], [1, 0.86])
  const y = useTransform(p, [0, 1], ["0%", "-6%"])
  const opacity = useTransform(p, [0, 0.75, 1], [1, 0.85, 0.15])
  const cueOpacity = useTransform(p, [0, 0.08, 0.16], [1, 0.5, 0])

  if (reduced) {
    return (
      <section
        id="hero"
        ref={ref}
        aria-label="Today's overview scene"
        className="px-4 pt-6 sm:px-6 sm:pt-10"
      >
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </section>
    )
  }

  return (
    <section
      id="hero"
      ref={ref}
      aria-label="Today's overview scene"
      className="relative h-[135svh] [perspective:1300px]"
    >
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center overflow-clip">
        <motion.div
          style={{ rotateX, scale, y, opacity, transformPerspective: 1300, transformStyle: "preserve-3d" }}
          className="mx-auto w-full max-w-6xl px-4 sm:px-6"
        >
          {children}
        </motion.div>

        {/* scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-1 text-muted-foreground"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
            স্ক্রল করুন
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 bg-background/60 backdrop-blur"
            aria-hidden="true"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}
