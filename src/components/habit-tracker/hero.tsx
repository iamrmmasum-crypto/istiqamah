"use client"

import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Flame, Target, Zap } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"
import { useSky } from "@/hooks/use-sky"
import { SunsetSea } from "@/components/habit-tracker/sunset-sea"

interface HeroProps {
  loading: boolean
  done: number
  total: number
  activeStreak: number
}

/** Gen-Z greeting pill by hour. */
function genzGreeting(h: number): string {
  if (h < 5) return "midnight grind"
  if (h < 12) return "gm — day starts now"
  if (h < 17) return "afternoon check-in"
  return "good evening"
}

/** Progress-flavored microcopy, Gen-Z register. */
function vibeLine(done: number, total: number): string {
  if (total === 0) return "plant the first habit. future you is watching."
  if (done === 0) return `locked in. ${total} to go — the day starts now, no cap.`
  if (done < total)
    return `just ${total - done} habits away from a perfect day. keep cooking.`
  return "clean sweep. every box ticked — huge W, alhamdulillah."
}

const RING_GRADIENT_ID = "heroRingGradient"

const textShadow = "[text-shadow:0_2px_16px_rgba(50,15,45,0.45)]"
const chipClass =
  "inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md [text-shadow:0_1px_8px_rgba(40,10,40,0.4)]"

export function Hero({ loading, done, total, activeStreak }: HeroProps) {
  const mounted = useMounted()
  const reduced = useReducedMotion() ?? false
  const sky = useSky()

  const cardRef = useRef<HTMLElement | null>(null)
  const sheenRef = useRef<HTMLDivElement | null>(null)
  const tiltRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 })

  // Smooth 3D tilt: lerp current rotation toward the pointer target each frame.
  useEffect(() => {
    if (reduced) return
    const st = tiltRef.current
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const card = cardRef.current
      if (!card) return
      st.rx += (st.tx - st.rx) * 0.085
      st.ry += (st.ty - st.ry) * 0.085
      const moving =
        Math.abs(st.tx - st.rx) > 0.004 ||
        Math.abs(st.ty - st.ry) > 0.004 ||
        st.tx !== 0 ||
        st.ty !== 0
      if (moving) {
        card.style.transform = `rotateX(${st.rx.toFixed(3)}deg) rotateY(${st.ry.toFixed(3)}deg)`
      } else if (card.style.transform) {
        card.style.transform = ""
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    const st = tiltRef.current
    st.ty = nx * 7.5
    st.tx = -ny * 6
    sheenRef.current?.style.setProperty(
      "--sx",
      `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`
    )
    sheenRef.current?.style.setProperty(
      "--sy",
      `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`
    )
  }

  const onPointerLeave = () => {
    const st = tiltRef.current
    st.tx = 0
    st.ty = 0
  }

  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct / 100)
  const left = Math.max(0, total - done)

  const now = new Date()
  const weekday = mounted
    ? now.toLocaleDateString("en-US", { weekday: "long" })
    : ""
  const monthDay = mounted
    ? now.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative [perspective:1400px]"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <section
        ref={cardRef}
        aria-label="Today's overview"
        className="relative will-change-transform [transform-style:preserve-3d]"
      >
        {/* live scene */}
        <div className="relative min-h-[440px] overflow-hidden rounded-3xl shadow-[0_24px_70px_-18px_rgba(120,40,20,0.55)] ring-1 ring-white/40 sm:min-h-[400px] lg:min-h-[430px]">
          <SunsetSea className="absolute inset-0 z-0" sky={sky} />

          {/* legibility scrims — part of the scene, not a theme */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3/5 bg-gradient-to-t from-[#052531]/70 via-[#052531]/20 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#3b1030]/30 to-transparent"
          />
        </div>

        {/* pointer-following sheen */}
        <div
          ref={sheenRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(340px circle at var(--sx, 60%) var(--sy, 35%), rgba(255,255,255,0.28), rgba(255,255,255,0) 65%)",
            mixBlendMode: "soft-light",
          }}
        />

        {/* floating content layer */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 [transform:translateZ(34px)] sm:p-8">
          {/* top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/35 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md [text-shadow:0_2px_16px_rgba(50,15,45,0.45)] sm:text-[11px] sm:tracking-[0.18em]`}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-200"
                />
                {mounted ? genzGreeting(now.getHours()) : "welcome"}
              </span>
              {mounted && sky && (
                <span
                  className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/95 backdrop-blur-md [text-shadow:0_1px_8px_rgba(40,10,40,0.4)] min-[400px]:inline-flex"
                  title={sky.phaseTitle}
                >
                  <span aria-hidden="true" className="text-xs leading-none">
                    {sky.phaseEmoji}
                  </span>
                  {sky.phaseLabel}
                  <span className="sr-only">{sky.phaseTitle}</span>
                </span>
              )}
            </div>

            {activeStreak > 0 ? (
              <motion.span
                className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-amber-400/25 px-3 py-1 text-xs font-bold text-amber-50 backdrop-blur-md ${textShadow}`}
                animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {activeStreak}-day streak
              </motion.span>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md ${textShadow}`}
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                start your streak today
              </span>
            )}
          </div>

          {/* bottom block */}
          <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1
                className={`mt-3 font-black leading-[0.95] tracking-tight text-white [text-shadow:0_2px_20px_rgba(60,20,50,0.5)]`}
              >
                <span className="block text-3xl sm:text-5xl">
                  {mounted ? weekday : "\u00A0"}
                  <span className="text-white/60">,</span>
                </span>
                <span className="block bg-gradient-to-r from-amber-100 via-amber-200 to-orange-300 bg-clip-text text-3xl text-transparent sm:text-5xl">
                  {mounted ? monthDay : "\u00A0"}
                </span>
              </h1>

              <p
                className={`mt-3 max-w-md text-sm font-medium text-white/95 sm:text-base ${textShadow}`}
              >
                {loading ? (
                  <span className="inline-block h-4 w-56 animate-pulse rounded bg-white/25" />
                ) : (
                  vibeLine(done, total)
                )}
              </p>

              {!loading && total > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className={chipClass}>
                    <Zap className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" />
                    {done} done
                  </span>
                  <span className={chipClass}>
                    <Target className="h-3.5 w-3.5 text-teal-200" aria-hidden="true" />
                    {left} to go
                  </span>
                </div>
              )}
            </div>

            {/* progress ring on a glass disc */}
            <div
              className="relative mx-auto h-32 w-32 shrink-0 rounded-full bg-white/15 p-1.5 shadow-xl shadow-[#06283a]/40 ring-1 ring-white/35 backdrop-blur-md sm:mx-0 sm:h-36 sm:w-36"
              role="img"
              aria-label={`${pct}% of today's habits completed`}
            >
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <defs>
                  <linearGradient
                    id={RING_GRADIENT_ID}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="55%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  strokeWidth="11"
                  className="stroke-white/25"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  stroke={`url(#${RING_GRADIENT_ID})`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={pct}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className={`text-3xl font-black tabular-nums tracking-tight text-white sm:text-4xl ${textShadow}`}
                >
                  {pct}%
                </motion.span>
                <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                  {done}/{total || 0} today
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
