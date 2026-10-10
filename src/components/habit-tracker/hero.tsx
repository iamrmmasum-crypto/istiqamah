"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  Clock3,
  Flame,
  Moon,
  Sunrise,
  Sunset,
  Target,
  Zap,
} from "lucide-react"
import { useClock } from "@/hooks/use-clock"
import { useSky } from "@/hooks/use-sky"
import { computeRiseSet, computeSky, formatTime12 } from "@/lib/sky"
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

/* celebration particles — fired once when the day hits 100% */
const BURST_COLORS = ["#fbbf24", "#fb7185", "#c084fc", "#2dd4bf", "#34d399", "#f59e0b"]
const BURST_COUNT = 16

const textShadow = "[text-shadow:0_2px_16px_rgba(50,15,45,0.45)]"
const chipClass =
  "inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md [text-shadow:0_1px_8px_rgba(40,10,40,0.4)]"

export function Hero({ loading, done, total, activeStreak }: HeroProps) {
  const reduced = useReducedMotion() ?? false
  const sky = useSky()
  const now = useClock() // live wall clock — also the hydration-safe "mounted" flag

  const cardRef = useRef<HTMLElement | null>(null)
  const sheenRef = useRef<HTMLDivElement | null>(null)
  const tiltRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 })

  // --- 100% day celebration: one particle burst on live completion ---
  const [burstKey, setBurstKey] = useState(0)
  const prevDoneRef = useRef(done)
  useEffect(() => {
    if (total > 0 && done === total && prevDoneRef.current < total) {
      const id = requestAnimationFrame(() => setBurstKey((k) => k + 1))
      prevDoneRef.current = done
      return () => cancelAnimationFrame(id)
    }
    prevDoneRef.current = done
  }, [done, total])

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

  const weekday = now
    ? now.toLocaleDateString("en-US", { weekday: "long" })
    : ""
  const monthDay = now
    ? now.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : ""

  // --- live clock digits (12-hour, ticking seconds) ---
  const h24 = now ? now.getHours() : 0
  const clock = now
    ? {
        h: String(h24 % 12 === 0 ? 12 : h24 % 12),
        mm: String(now.getMinutes()).padStart(2, "0"),
        ss: String(now.getSeconds()).padStart(2, "0"),
        meridiem: h24 < 12 ? "AM" : "PM",
        dateTime: now.toTimeString().slice(0, 8),
      }
    : null
  const blink = reduced ? "" : "animate-[clock-blink_1s_ease-in-out_infinite]"

  // --- sunrise/sunset/moonrise/moonset for today (Dhaka lat/lon) ---
  const dayKey = now
    ? `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
    : ""
  // anchor the moon phase to local midnight so rise/set chips stay put all day
  const phaseNum = useMemo(() => {
    if (!dayKey) return -1
    const [y, m, d] = dayKey.split("-").map(Number)
    return computeSky(new Date(y, m, d)).moonPhase
  }, [dayKey])
  const riseSet = useMemo(() => {
    if (!dayKey) return null
    const [y, m, d] = dayKey.split("-").map(Number)
    return computeRiseSet(
      new Date(y, m, d),
      phaseNum === -1 ? undefined : phaseNum
    )
  }, [dayKey, phaseNum])

  const skyChips = [
    {
      key: "sunrise",
      label: "সূর্যোদয়",
      value: riseSet?.sunrise,
      title: "Sunrise",
      icon: <Sunrise className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" />,
    },
    {
      key: "sunset",
      label: "সূর্যাস্ত",
      value: riseSet?.sunset,
      title: "Sunset",
      icon: <Sunset className="h-3.5 w-3.5 text-orange-300" aria-hidden="true" />,
    },
    {
      key: "moonrise",
      label: "চন্দ্রোদয়",
      value: riseSet?.moonrise,
      title: "Moonrise",
      icon: (
        <span className="inline-flex items-center" aria-hidden="true">
          <Moon className="h-3.5 w-3.5 text-violet-200" />
          <ArrowUp className="h-2.5 w-2.5 text-violet-200/80" />
        </span>
      ),
    },
    {
      key: "moonset",
      label: "চন্দ্রাস্ত",
      value: riseSet?.moonset,
      title: "Moonset",
      icon: (
        <span className="inline-flex items-center" aria-hidden="true">
          <Moon className="h-3.5 w-3.5 text-violet-200" />
          <ArrowDown className="h-2.5 w-2.5 text-violet-200/80" />
        </span>
      ),
    },
  ]

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
        {/* live scene — fills behind; the content below drives card height */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-[0_24px_70px_-18px_rgba(120,40,20,0.55)] ring-1 ring-white/40">
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

        {/* floating content layer — in normal flow so the card grows with it */}
        <div className="relative z-20 flex min-h-[380px] flex-col justify-between p-5 [transform:translateZ(34px)] sm:min-h-[300px] sm:p-6 lg:min-h-[310px]">
          {/* top row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/35 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md [text-shadow:0_2px_16px_rgba(50,15,45,0.45)] sm:text-[11px] sm:tracking-[0.18em]`}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-200"
                />
                {now ? genzGreeting(now.getHours()) : "welcome"}
              </span>
              {sky && (
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
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200/50 bg-amber-400/25 px-3 py-1 text-xs font-bold text-amber-50 backdrop-blur-md ${textShadow}`}
                animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {activeStreak}-day streak
              </motion.span>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md ${textShadow}`}
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                start your streak today
              </span>
            )}
          </div>

          {/* bottom block */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1
                className={`font-black leading-[0.95] tracking-tight text-white [text-shadow:0_2px_20px_rgba(60,20,50,0.5)]`}
              >
                <span className="block text-3xl sm:text-4xl">
                  {now ? weekday : "\u00A0"}
                  <span className="text-white/60">,</span>
                </span>
                <span className="block bg-gradient-to-r from-amber-100 via-amber-200 to-orange-300 bg-clip-text text-3xl text-transparent sm:text-4xl">
                  {now ? monthDay : "\u00A0"}
                </span>
              </h1>

              {/* live clock */}
              <div
                role="timer"
                aria-label="Local time"
                className="mt-2 flex items-center gap-2"
              >
                <Clock3
                  className="h-4 w-4 text-amber-200/90 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />
                {clock ? (
                  <time
                    dateTime={clock.dateTime}
                    className="flex items-baseline gap-1"
                  >
                    <span
                      className={`font-black tabular-nums text-2xl leading-none tracking-tight text-white sm:text-3xl ${textShadow}`}
                    >
                      {clock.h}
                      <span className={blink}>:</span>
                      {clock.mm}
                    </span>
                    <span
                      className={`font-black tabular-nums text-lg leading-none text-amber-200 sm:text-xl ${textShadow}`}
                    >
                      <span className={blink}>:</span>
                      {clock.ss}
                    </span>
                    <span className="ml-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 sm:text-[11px]">
                      {clock.meridiem}
                    </span>
                  </time>
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-black tabular-nums text-2xl leading-none tracking-tight text-transparent sm:text-4xl"
                  >
                    00:00<span className="text-lg sm:text-2xl">:00</span>
                  </span>
                )}
              </div>

              <p
                className={`mt-2 max-w-md text-sm font-medium text-white/95 sm:text-sm ${textShadow}`}
              >
                {loading ? (
                  <span className="inline-block h-4 w-56 animate-pulse rounded bg-white/25" />
                ) : (
                  vibeLine(done, total)
                )}
              </p>

              {(!loading || riseSet) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {!loading && total > 0 && (
                    <>
                      <span className={chipClass}>
                        <Zap
                          className="h-3.5 w-3.5 text-amber-200"
                          aria-hidden="true"
                        />
                        {done} done
                      </span>
                      <span className={chipClass}>
                        <Target
                          className="h-3.5 w-3.5 text-teal-200"
                          aria-hidden="true"
                        />
                        {left} to go
                      </span>
                    </>
                  )}
                  {riseSet &&
                    skyChips.map((c) => (
                      <span key={c.key} className={chipClass} title={c.title}>
                        {c.icon}
                        {c.label}
                        <span className="font-bold tabular-nums">
                          {c.value === null || c.value === undefined
                            ? "—"
                            : formatTime12(c.value)}
                        </span>
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* progress ring on a glass disc */}
            <div
              className="relative mx-auto h-28 w-28 shrink-0 rounded-full bg-white/15 p-1.5 shadow-xl shadow-[#06283a]/40 ring-1 ring-white/35 backdrop-blur-md sm:mx-0 sm:h-32 sm:w-32"
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
                  className={`text-3xl font-black tabular-nums tracking-tight text-white sm:text-3xl ${textShadow}`}
                >
                  {pct}%
                </motion.span>
                <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                  {done}/{total || 0} today
                </span>
              </div>
              {/* 100% celebration burst */}
              {burstKey > 0 &&
                Array.from({ length: BURST_COUNT }, (_, i) => {
                  const angle = (i / BURST_COUNT) * Math.PI * 2
                  const dist = 84 + (i % 4) * 14
                  return (
                    <motion.span
                      key={`${burstKey}-${i}`}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 z-40 h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: BURST_COLORS[i % BURST_COLORS.length] }}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist - 14,
                        scale: [0, 1.3, 0.4],
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 0.95, ease: "easeOut", delay: (i % 5) * 0.03 }}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
