"use client"

import { Flame } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"
import {
  greetingForNow,
  motivationalMessage,
} from "@/lib/habit-utils"

interface HeroProps {
  loading: boolean
  done: number
  total: number
  activeStreak: number
}

export function Hero({ loading, done, total, activeStreak }: HeroProps) {
  const mounted = useMounted()

  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct / 100)

  const dateLabel = mounted
    ? new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <section
      aria-label="Today's overview"
      className="relative overflow-hidden rounded-2xl border bg-card p-5 sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div className="relative flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {mounted ? greetingForNow() : "Welcome"}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {mounted ? dateLabel : "\u00A0"}
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {loading ? (
              <span className="inline-block h-4 w-56 animate-pulse rounded bg-muted" />
            ) : (
              motivationalMessage(done, total)
            )}
          </p>
          {!loading && activeStreak > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4" aria-hidden="true" />
              {activeStreak} day{activeStreak === 1 ? "" : "s"} active streak
            </div>
          )}
        </div>

        <div
          className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0"
          role="img"
          aria-label={`${pct}% of today's habits completed`}
        >
          <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="10"
              className="stroke-muted"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="stroke-emerald-500 transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums tracking-tight">
              {pct}%
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {done}/{total || 0} done
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
