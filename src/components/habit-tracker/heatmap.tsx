"use client"

import {
  addDays,
  formatDayLabelLong,
  parseKey,
  startOfWeek,
  todayKey,
} from "@/lib/habit-utils"
import { cn } from "@/lib/utils"

const ALPHA = ["", "2E", "59", "8C", "E6"]

function levelFor(count: number, max: number): number {
  if (count <= 0) return 0
  const ratio = count / max
  if (ratio > 0.99) return 4
  if (ratio > 0.66) return 3
  if (ratio > 0.33) return 2
  return 1
}

interface HeatmapProps {
  /** date key -> completion count */
  counts: Map<string, number>
  /** scale max; defaults to the largest value in `counts` */
  maxCount?: number
  weeks?: number
  color?: string
  showLegend?: boolean
  showWeekdayLabels?: boolean
  className?: string
}

export function Heatmap({
  counts,
  maxCount,
  weeks = 20,
  color = "#10b981",
  showLegend = true,
  showWeekdayLabels = true,
  className,
}: HeatmapProps) {
  const today = todayKey()
  const totalDays = weeks * 7
  const start = startOfWeek(addDays(today, -(totalDays - 1)))

  const max = maxCount ?? Math.max(1, ...counts.values())
  const startMs = parseKey(start).getTime()
  const todayMs = parseKey(today).getTime()
  const dayMs = 86_400_000
  const usedDays = Math.floor((todayMs - startMs) / dayMs) + 1
  const cellCount = Math.max(totalDays, Math.ceil(usedDays / 7) * 7)

  const weekdayLabels = ["M", "", "W", "", "F", "", ""]

  return (
    <div className={cn("flex gap-1.5", className)}>
      {showWeekdayLabels && (
        <div
          aria-hidden="true"
          className="flex flex-col gap-[3px] pt-px text-[9px] leading-[12px] text-muted-foreground"
        >
          {weekdayLabels.map((label, i) => (
            <span key={i} className="flex h-3 items-center">
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="overflow-x-auto pb-1">
        <div
          className="grid grid-flow-col grid-rows-7 gap-[3px]"
          role="img"
          aria-label={`Activity heatmap for the last ${weeks} weeks`}
        >
          {Array.from({ length: cellCount }, (_, i) => {
            const date = addDays(start, i)
            const future = date > today
            const count = counts.get(date) ?? 0
            const level = levelFor(count, max)
            return (
              <div
                key={date}
                title={future ? undefined : `${formatDayLabelLong(date)} — ${count} completed`}
                className={cn(
                  "h-3 w-3 rounded-[3px] sm:h-3.5 sm:w-3.5",
                  future && "invisible",
                  !future && count === 0 && "bg-muted"
                )}
                style={
                  !future && level > 0
                    ? { backgroundColor: `${color}${ALPHA[level]}` }
                    : undefined
                }
              />
            )
          })}
        </div>
      </div>
      {showLegend && (
        <div className="flex items-center gap-1 self-end pb-1 text-[10px] text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className={cn("h-2.5 w-2.5 rounded-[2px]", l === 0 && "bg-muted")}
              style={l > 0 ? { backgroundColor: `${color}${ALPHA[l]}` } : undefined}
            />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  )
}
