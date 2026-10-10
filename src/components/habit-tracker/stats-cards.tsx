"use client"

import { motion } from "framer-motion"
import { CalendarCheck, Flame, TrendingUp, Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { addDays, formatDayLabel, type AggregatedStats, todayKey } from "@/lib/habit-utils"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  stats: AggregatedStats
  loading?: boolean
  className?: string
}

const tilt = {
  rest: { y: 0, rotateX: 0 },
  hover: { y: -5, rotateX: 4 },
}

export function StatsCards({ stats, loading, className }: StatsCardsProps) {
  const pct = stats.todayTotal === 0 ? 0 : Math.round((stats.todayDone / stats.todayTotal) * 100)

  // Honest window label: brand-new habits are measured from their creation
  // day, older ones fall back to the standard 30-day window.
  const windowCaption =
    stats.rateWindowDays < 30
      ? `since ${formatDayLabel(addDays(todayKey(), -(stats.rateWindowDays - 1)))}`
      : "last 30 days"

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
      {/* ── Card 1 · Today — neumorphic emboss with 3D progress groove ────────── */}
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={tilt}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformPerspective: 900 }}
        className="relative rounded-2xl bg-card p-4 shadow-[0_10px_24px_-12px_rgba(16,185,129,0.45)] ring-1 ring-black/5 dark:ring-white/10 sm:p-5"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Today
          </p>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-white to-slate-200 text-emerald-600 shadow-[0_3px_7px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] dark:from-slate-700 dark:to-slate-800 dark:text-emerald-400 dark:shadow-[0_3px_9px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-16" />
        ) : (
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
            {stats.todayDone}/{stats.todayTotal}
          </p>
        )}
        {loading ? (
          <Skeleton className="mt-2 h-3 w-20" />
        ) : (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{pct}% complete</p>
        )}
        {/* Pressed-in groove with glossy 3D fill */}
        {!loading && (
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pct}% of today's habits completed`}
            className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted shadow-[inset_0_2px_5px_rgba(0,0,0,0.28),inset_0_-1px_1px_rgba(255,255,255,0.55)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.75),inset_0_-1px_1px_rgba(255,255,255,0.07)]"
          >
            <div
              className="relative h-full rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_2px_5px_rgba(16,185,129,0.55)] transition-all duration-500"
              style={{ width: `${pct}%` }}
            >
              <span className="absolute inset-x-1 top-0.5 h-1 rounded-full bg-white/45" />
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Card 2 · Active streak — chunky fire slab with extruded edge ──────── */}
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={tilt}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformPerspective: 900 }}
        className="relative overflow-hidden rounded-2xl border border-orange-600/60 bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 p-4 text-white shadow-[0_6px_0_rgb(154,52,18),0_16px_30px_-10px_rgba(234,88,12,0.6)] sm:p-5"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
        <div className="relative flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-100/90">
            Active streak
          </p>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_7px_rgba(0,0,0,0.25)]">
            <Flame className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="relative mt-2 h-8 w-16" />
        ) : (
          <p className="relative mt-1 text-2xl font-bold tabular-nums tracking-tight drop-shadow-[0_2px_0_rgba(154,52,18,0.8)] sm:text-3xl">
            {stats.activeStreak}
          </p>
        )}
        {loading ? (
          <Skeleton className="relative mt-2 h-3 w-20" />
        ) : (
          <p className="relative mt-0.5 truncate text-xs text-orange-100/90">
            {stats.activeStreak === 1 ? "day in a row" : "days in a row"}
          </p>
        )}
      </motion.div>

      {/* ── Card 3 · All-time best — gold-trimmed plaque with sheen ───────────── */}
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={tilt}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformPerspective: 900 }}
        className="relative overflow-hidden rounded-2xl border-b-4 border-amber-400/80 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-4 text-white shadow-[0_12px_26px_-10px_rgba(147,51,234,0.6)] ring-1 ring-amber-300/70 sm:p-5"
      >
        <div className="pointer-events-none absolute -inset-y-10 -left-1/3 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-100/90">
            All-time best
          </p>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-yellow-500 text-amber-900 shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.65)]">
            <Trophy className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="relative mt-2 h-8 w-16" />
        ) : (
          <p className="relative mt-1 text-2xl font-bold tabular-nums tracking-tight text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] sm:text-3xl">
            {stats.bestStreak}
          </p>
        )}
        {loading ? (
          <Skeleton className="relative mt-2 h-3 w-20" />
        ) : (
          <p className="relative mt-0.5 truncate text-xs text-purple-100/90">day streak record</p>
        )}
      </motion.div>

      {/* ── Card 4 · Consistency — layered stack with mini 3D bars ────────────── */}
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={tilt}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformPerspective: 900 }}
        className="relative"
      >
        {/* offset depth panels */}
        <div aria-hidden="true" className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10" />
        <div aria-hidden="true" className="absolute inset-0 translate-x-[5px] translate-y-[5px] rounded-2xl bg-teal-500/20 dark:bg-teal-400/15" />
        <div className="relative rounded-2xl border border-teal-500/25 bg-card p-4 shadow-[0_10px_22px_-10px_rgba(20,184,166,0.5)] sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Consistency
            </p>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-teal-300 to-teal-600 text-white shadow-[0_4px_8px_rgba(13,148,136,0.4),inset_0_1px_0_rgba(255,255,255,0.55)]">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-teal-600 dark:text-teal-400 sm:text-3xl">
              {stats.rate}%
            </p>
          )}
          {loading ? (
            <Skeleton className="mt-2 h-3 w-20" />
          ) : (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {windowCaption} · {stats.totalCompletions} check-ins
            </p>
          )}
          {/* mini rising bars */}
          {!loading && (
            <div className="mt-3 flex items-end gap-1.5" aria-hidden="true">
              {[5, 8, 11, 14, 17].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-sm bg-gradient-to-b from-teal-300 to-teal-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.2)]"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
