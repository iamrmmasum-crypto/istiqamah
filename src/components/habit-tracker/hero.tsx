"use client"

import { motion } from "framer-motion"
import { Flame, Target, Zap } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

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
    return `keep cooking — just ${total - done} left, that's a comeup.`
  return "clean sweep. every box ticked — huge W, alhamdulillah."
}

const RING_GRADIENT_ID = "heroRingGradient"

export function Hero({ loading, done, total, activeStreak }: HeroProps) {
  const mounted = useMounted()

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
    <motion.section
      aria-label="Today's overview"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-5 text-white shadow-xl shadow-emerald-950/20 sm:p-8"
    >
      {/* aurora blobs */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl"
        animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl"
        animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* faint grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative flex flex-col-reverse items-start gap-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {/* greeting pill */}
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
            />
            {mounted ? genzGreeting(now.getHours()) : "welcome"}
          </span>

          {/* oversized date */}
          <h1 className="mt-3 font-black leading-[0.95] tracking-tight">
            <span className="block text-3xl sm:text-5xl">
              {mounted ? weekday : "\u00A0"}
              <span className="text-zinc-500">,</span>
            </span>
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-3xl text-transparent sm:text-5xl">
              {mounted ? monthDay : "\u00A0"}
            </span>
          </h1>

          {/* vibe line */}
          <p className="mt-3 max-w-md text-sm text-zinc-300 sm:text-base">
            {loading ? (
              <span className="inline-block h-4 w-56 animate-pulse rounded bg-white/10" />
            ) : (
              vibeLine(done, total)
            )}
          </p>

          {/* glassy chips */}
          {!loading && total > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200 backdrop-blur">
                <Zap className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                {done} done
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200 backdrop-blur">
                <Target className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
                {left} to go
              </span>
              {activeStreak > 0 ? (
                <motion.span
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                  {activeStreak}-day streak · locked in
                </motion.span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-400 backdrop-blur">
                  <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                  start your streak today
                </span>
              )}
            </div>
          )}
        </div>

        {/* progress ring */}
        <div
          className="relative mx-auto h-32 w-32 shrink-0 sm:mx-0 sm:h-36 sm:w-36"
          role="img"
          aria-label={`${pct}% of today's habits completed`}
        >
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id={RING_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="55%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="11"
              className="stroke-white/10"
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
              className="text-3xl font-black tabular-nums tracking-tight sm:text-4xl"
            >
              {pct}%
            </motion.span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              {done}/{total || 0} locked in
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
