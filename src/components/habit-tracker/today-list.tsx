"use client"

import { motion } from "framer-motion"
import { Check, Flame, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  HABIT_COLORS,
  computeStreaks,
  habitCompletedSet,
  isDoneOn,
} from "@/lib/habit-utils"
import type { Habit } from "@/types/habit"
import { cn } from "@/lib/utils"

interface TodayListProps {
  habits: Habit[]
  loading: boolean
  today: string
  pendingHabitId?: string
  onToggle: (habitId: string) => void
}

export function TodayList({
  habits,
  loading,
  today,
  pendingHabitId,
  onToggle,
}: TodayListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border bg-card p-4"
          >
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {habits.map((habit, index) => {
        const done = isDoneOn(habit, today)
        const colorDef = HABIT_COLORS[habit.color]
        const streaks = computeStreaks(habitCompletedSet(habit))
        const pending = pendingHabitId === habit.id

        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            layout
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-card p-3.5 transition-colors sm:gap-4 sm:p-4",
                done && "border-emerald-500/25 bg-emerald-500/[0.04] dark:border-emerald-500/20"
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl",
                  colorDef.chip
                )}
                aria-hidden="true"
              >
                {habit.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate font-medium",
                    done && "text-muted-foreground line-through decoration-2"
                  )}
                >
                  {habit.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {habit.description ||
                    (habit.frequency === "weekly"
                      ? `${habit.targetDays}\u00D7 per week`
                      : "Daily habit")}
                </p>
              </div>
              {streaks.current > 0 && (
                <span
                  className="hidden items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 sm:inline-flex"
                  aria-label={`Current streak: ${streaks.current} days`}
                >
                  <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                  {streaks.current}
                </span>
              )}
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => onToggle(habit.id)}
                disabled={pending}
                aria-pressed={done}
                aria-label={`${done ? "Mark incomplete" : "Mark complete"}: ${habit.name}`}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-60",
                  done
                    ? cn(colorDef.solid, "border-transparent text-white")
                    : "border-muted-foreground/25 text-transparent hover:border-muted-foreground/50 hover:text-muted-foreground/30"
                )}
              >
                {pending ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <Check className="h-5 w-5" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
