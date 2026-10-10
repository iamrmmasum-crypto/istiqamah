"use client"

import { CalendarCheck, Flame, TrendingUp, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { addDays, formatDayLabel, type AggregatedStats, todayKey } from "@/lib/habit-utils"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  stats: AggregatedStats
  loading?: boolean
  className?: string
}

export function StatsCards({ stats, loading, className }: StatsCardsProps) {
  const pct = stats.todayTotal === 0 ? 0 : Math.round((stats.todayDone / stats.todayTotal) * 100)

  // Honest window label: brand-new habits are measured from their creation
  // day, older ones fall back to the standard 30-day window.
  const windowCaption =
    stats.rateWindowDays < 30
      ? `since ${formatDayLabel(addDays(todayKey(), -(stats.rateWindowDays - 1)))}`
      : "last 30 days"

  const items = [
    {
      label: "Today",
      value: `${stats.todayDone}/${stats.todayTotal}`,
      caption: `${pct}% complete`,
      icon: CalendarCheck,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      progress: (
        <Progress
          value={pct}
          className="mt-3 h-1.5 [&>div]:bg-emerald-500"
          aria-label={`${pct}% of today's habits completed`}
        />
      ),
    },
    {
      label: "Active streak",
      value: stats.activeStreak,
      caption: stats.activeStreak === 1 ? "day in a row" : "days in a row",
      icon: Flame,
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "All-time best",
      value: stats.bestStreak,
      caption: stats.bestStreak === 1 ? "day streak record" : "day streak record",
      icon: Trophy,
      iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      label: "Consistency",
      value: `${stats.rate}%`,
      caption: `${windowCaption} · ${stats.totalCompletions} check-ins`,
      icon: TrendingUp,
      iconClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
  ]

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <Card key={item.label} className="rounded-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  item.iconClass
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            {loading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
                {item.value}
              </p>
            )}
            {loading ? (
              <Skeleton className="mt-2 h-3 w-20" />
            ) : (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.caption}</p>
            )}
            {item.progress}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
