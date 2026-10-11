"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { CalendarCheck, Flame, TrendingUp, Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { addDays, formatDayLabel, type AggregatedStats, todayKey } from "@/lib/habit-utils"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  stats: AggregatedStats
  loading?: boolean
  className?: string
}

/* One disciplined card treatment, four color identities.
 * Same structure, same glass, same depth — only the accent hue changes. */
const ACCENTS = {
  emerald: {
    disc: "from-emerald-400 to-emerald-600",
    bar: "from-emerald-400 via-emerald-500 to-teal-500",
    glow: "0 4px 14px -2px rgba(16,185,129,0.55)",
  },
  amber: {
    disc: "from-amber-400 to-orange-500",
    bar: "from-amber-400 via-orange-500 to-amber-500",
    glow: "0 4px 14px -2px rgba(249,115,22,0.55)",
  },
  violet: {
    disc: "from-violet-400 to-purple-600",
    bar: "from-violet-400 via-purple-500 to-fuchsia-500",
    glow: "0 4px 14px -2px rgba(139,92,246,0.55)",
  },
  teal: {
    disc: "from-teal-400 to-teal-600",
    bar: "from-teal-400 via-teal-500 to-emerald-500",
    glow: "0 4px 14px -2px rgba(20,184,166,0.55)",
  },
} as const

type AccentKey = keyof typeof ACCENTS

/** scroll-in choreography — each stat arrives along its own axis */
type Entrance = "flipUp" | "swingLeft" | "swingRight" | "rise" | "drop"

const ENTRANCE_FROM: Record<Entrance, { opacity: number; y: number; x: number; rotateX: number; rotateY: number; z: number }> = {
  flipUp: { opacity: 0, y: 60, x: 0, rotateX: -68, rotateY: 0, z: -90 },
  swingLeft: { opacity: 0, y: 34, x: -44, rotateX: 5, rotateY: 38, z: -100 },
  swingRight: { opacity: 0, y: 34, x: 44, rotateX: 5, rotateY: -38, z: -100 },
  rise: { opacity: 0, y: 70, x: 0, rotateX: 14, rotateY: 0, z: -110 },
  drop: { opacity: 0, y: -54, x: 0, rotateX: -12, rotateY: 0, z: -70 },
}

const CARD_BASE =
  "relative overflow-hidden rounded-2xl border border-black/[0.06] bg-card/80 backdrop-blur-xl " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_14px_-6px_rgba(0,0,0,0.12)] " +
  "dark:border-white/[0.08] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_16px_-6px_rgba(0,0,0,0.5)]"

function StatCard({
  accent,
  icon: Icon,
  label,
  value,
  caption,
  loading,
  entrance = "rise",
  index = 0,
  children,
}: {
  accent: AccentKey
  icon: typeof CalendarCheck
  label: string
  value: string
  caption: string
  loading?: boolean
  entrance?: Entrance
  index?: number
  children?: ReactNode
}) {
  const a = ACCENTS[accent]
  const from = ENTRANCE_FROM[entrance]
  return (
    <motion.div
      initial={from}
      whileInView={{ opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, z: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ type: "spring", stiffness: 62, damping: 15, mass: 0.9, delay: index * 0.09 }}
      whileHover={{ y: -4, rotateX: 3 }}
      style={{ transformPerspective: 900 }}
      className={CARD_BASE}
    >
      {/* unified color-identity bar */}
      <span
        aria-hidden="true"
        className={cn("absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r", a.bar)}
      />
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b text-white",
              a.disc
            )}
            style={{ boxShadow: `${a.glow}, inset 0 1px 0 rgba(255,255,255,0.45)` }}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-16" />
        ) : (
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
            {value}
          </p>
        )}
        {loading ? (
          <Skeleton className="mt-2 h-3 w-20" />
        ) : (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{caption}</p>
        )}
        {!loading && children}
      </div>
    </motion.div>
  )
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
      <StatCard
        accent="emerald"
        icon={CalendarCheck}
        label="Today"
        value={`${stats.todayDone}/${stats.todayTotal}`}
        caption={`${pct}% complete`}
        loading={loading}
        entrance="flipUp"
        index={0}
      >
        {/* pressed-in 3D groove — shared signature, emerald fill */}
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
      </StatCard>

      <StatCard
        accent="amber"
        icon={Flame}
        label="Active streak"
        value={String(stats.activeStreak)}
        caption={stats.activeStreak === 1 ? "day in a row" : "days in a row"}
        loading={loading}
        entrance="swingLeft"
        index={1}
      />

      <StatCard
        accent="violet"
        icon={Trophy}
        label="All-time best"
        value={String(stats.bestStreak)}
        caption="day streak record"
        loading={loading}
        entrance="swingRight"
        index={2}
      />

      <StatCard
        accent="teal"
        icon={TrendingUp}
        label="Consistency"
        value={`${stats.rate}%`}
        caption={`${windowCaption} · ${stats.totalCompletions} check-ins`}
        loading={loading}
        entrance="drop"
        index={3}
      />
    </div>
  )
}
