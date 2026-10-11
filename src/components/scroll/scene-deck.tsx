"use client"

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { MoveHorizontal } from "lucide-react"

interface DeckProps {
  count: number
  /** renders habit card i */
  renderItem: (index: number) => ReactNode
  heading: ReactNode
}

interface DeckGeometry {
  cardW: number
  gap: number
  dist: number
}

const EMPTY_GEOMETRY: DeckGeometry = { cardW: 320, gap: 24, dist: 0 }

/**
 * One habit card inside the coverflow track. Its 3D pose (rotateY /
 * translateZ / scale) is derived from its distance to the viewport center
 * as the track glides horizontally with the page scroll.
 */
function DeckCard({
  progress,
  index,
  geometry,
  viewportW,
  children,
}: {
  progress: MotionValue<number>
  index: number
  geometry: DeckGeometry
  viewportW: number
  children: ReactNode
}) {
  const { cardW, gap, dist } = geometry

  const pose = useTransform(progress, (p: number) => {
    if (dist <= 0) return { rotateY: 0, z: 0, scale: 1, brightness: 1 }
    const centerX = index * (cardW + gap) + cardW / 2
    const viewportCenterOnTrack = viewportW / 2 + dist * p
    const offset = centerX - viewportCenterOnTrack
    const norm = Math.max(-1, Math.min(1, offset / (viewportW * 0.55)))
    return {
      rotateY: -norm * 32,
      z: -Math.abs(norm) * 170,
      scale: 1 - Math.abs(norm) * 0.07,
      brightness: 1 - Math.abs(norm) * 0.25,
    }
  })

  const rotateY = useTransform(pose, (s) => s.rotateY)
  const z = useTransform(pose, (s) => s.z)
  const scale = useTransform(pose, (s) => s.scale)
  const filter = useTransform(pose, (s) => `brightness(${s.brightness.toFixed(3)})`)

  return (
    <motion.div
      style={{ rotateY, z, scale, filter, transformPerspective: 1100, transformStyle: "preserve-3d" }}
      className="w-[272px] shrink-0 sm:w-[320px]"
    >
      {children}
    </motion.div>
  )
}

/**
 * Signature scene: all habits as a horizontal 3D coverflow that glides
 * sideways while the user keeps scrolling down. Falls back to a plain
 * grid when there is nothing to glide (wide screens, few habits) or
 * under reduced motion.
 */
export function HabitDeck({ count, renderItem, heading }: DeckProps) {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const roRef = useRef<ResizeObserver | null>(null)
  const [geometry, setGeometry] = useState<DeckGeometry>(EMPTY_GEOMETRY)
  const [viewportW, setViewportW] = useState(1280)

  const measure = useCallback(() => {
    setViewportW(window.innerWidth)
    const vw = window.innerWidth
    const track = trackRef.current
    if (track) {
      const first = track.firstElementChild as HTMLElement | null
      const cardW = first ? first.offsetWidth : 320
      const gap = parseFloat(getComputedStyle(track).columnGap || "24") || 24
      const dist = Math.max(0, track.scrollWidth - window.innerWidth + 64)
      setGeometry((g) =>
        g.cardW === cardW && g.gap === gap && g.dist === dist ? g : { cardW, gap, dist }
      )
    } else {
      // track not mounted yet (fallback branch) — estimate from the
      // responsive sizes used by the deck so it can switch into glide mode
      const cardW = vw >= 640 ? 320 : 272
      const gap = vw >= 640 ? 24 : 20
      const padX = Math.round(vw * 0.07)
      const trackW = count * cardW + (count - 1) * gap + padX * 2
      setGeometry((g) => {
        const dist = Math.max(0, trackW - vw + 64)
        return g.cardW === cardW && g.gap === gap && g.dist === dist ? g : { cardW, gap, dist }
      })
    }
  }, [count])

  // ResizeObserver survives fallback↔glide switches: the track callback ref
  // re-attaches observation whenever the track (re)mounts.
  useLayoutEffect(() => {
    if (reduced) return
    const ro = new ResizeObserver(() => measure())
    roRef.current = ro
    if (trackRef.current) ro.observe(trackRef.current)
    // catch late layout shifts (fonts, viewport emulation races)
    const timers = [120, 450, 1200].map((ms) => setTimeout(measure, ms))
    if (typeof document !== "undefined" && (document as Document & { fonts?: FontFaceSet }).fonts) {
      void (document as Document & { fonts: FontFaceSet }).fonts.ready.then(() => measure())
    }
    window.addEventListener("resize", measure)
    // async first measure (avoids sync setState inside the effect)
    const raf = requestAnimationFrame(measure)
    return () => {
      ro.disconnect()
      roRef.current = null
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", measure)
    }
  }, [reduced, measure])

  const attachTrack = useCallback((el: HTMLDivElement | null) => {
    trackRef.current = el
    if (el && roRef.current) roRef.current.observe(el)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 })
  const x = useTransform(p, [0, 1], [0, -geometry.dist])

  const glides = !reduced && geometry.dist > 0

  // ONE stable section node — useScroll's target ref must exist from the
  // very first render (a conditional early-return leaves it null and
  // framer-motion throws "target ref is defined but not hydrated").
  return (
    <section
      id="habits"
      ref={sectionRef}
      aria-label="All habits"
      className={glides ? "relative" : "relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"}
      style={glides ? { height: `calc(100svh + ${geometry.dist}px)` } : undefined}
    >
      {glides ? (
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            {heading}
          </div>

          <div className="[perspective:1400px]">
            <motion.div
              ref={attachTrack}
              style={{ x, transformStyle: "preserve-3d" }}
              className="flex min-w-max items-stretch gap-5 px-[7vw] py-8 sm:gap-6 will-change-transform"
            >
              {Array.from({ length: count }, (_, i) => (
                <DeckCard
                  key={i}
                  progress={p}
                  index={i}
                  geometry={geometry}
                  viewportW={viewportW}
                >
                  {renderItem(i)}
                </DeckCard>
              ))}
            </motion.div>
          </div>

          {/* glide hint + progress */}
          <div className="mx-auto mt-2 flex w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              স্ক্রল = গ্লাইড
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <motion.div
                style={{ scaleX: p }}
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {heading}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }, (_, i) => (
              <div key={i}>{renderItem(i)}</div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
