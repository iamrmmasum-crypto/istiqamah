"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heatmap } from "@/components/habit-tracker/heatmap"
import {
  HABIT_COLORS,
  addDays,
  completionRate,
  computeStreaks,
  countCompletions,
  habitCompletedSet,
  startOfWeek,
  todayKey,
} from "@/lib/habit-utils"
import type { Habit } from "@/types/habit"

interface InsightsProps {
  habits: Habit[]
  perDayCounts: Map<string, number>
}

function weekLabel(key: string): string {
  const d = new Date(key + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function Insights({ habits, perDayCounts }: InsightsProps) {
  const today = todayKey()
  const maxPerDay = habits.length || 1

  // Completions per week, last 8 weeks
  const weeklyData = useMemo(() => {
    const thisMonday = startOfWeek(today)
    return Array.from({ length: 8 }, (_, i) => {
      const start = addDays(thisMonday, -7 * (7 - i))
      const end = addDays(start, 6)
      let completions = 0
      for (const habit of habits) {
        const set = habitCompletedSet(habit)
        for (let d = 0; d < 7; d++) {
          if (set.has(addDays(start, d))) completions++
        }
      }
      return { label: weekLabel(start), completions, range: `${start}..${end}` }
    })
  }, [habits, today])

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daily activity</CardTitle>
          <CardDescription>
            Completions per day across all habits · last 20 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap counts={perDayCounts} maxCount={maxPerDay} weeks={20} />
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Weekly completions</CardTitle>
          <CardDescription>Total check-ins per week · last 8 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(16, 185, 129, 0.08)" }}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--popover)",
                    color: "var(--popover-foreground)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value} check-ins`, "Completions"]}
                />
                <Bar
                  dataKey="completions"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Habit breakdown</CardTitle>
          <CardDescription>12-week consistency map per habit</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {habits.map((habit, i) => {
            const colorDef = HABIT_COLORS[habit.color]
            const counts = new Map<string, number>()
            for (const d of habitCompletedSet(habit)) counts.set(d, 1)
            const streaks = computeStreaks(habitCompletedSet(habit))
            const rate = completionRate(habit, 30)

            return (
              <div key={habit.id}>
                {i > 0 && <Separator className="my-4" />}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${colorDef.chip}`}
                      aria-hidden="true"
                    >
                      {habit.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{habit.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {rate}% last 30 days · {countCompletions(habit)} check-ins ·
                        best streak {streaks.best}
                      </p>
                    </div>
                  </div>
                  <Heatmap
                    counts={counts}
                    maxCount={1}
                    weeks={12}
                    color={colorDef.hex}
                    showLegend={false}
                    showWeekdayLabels={false}
                    className="shrink-0"
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
