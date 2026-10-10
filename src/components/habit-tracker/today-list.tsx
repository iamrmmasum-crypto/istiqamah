"use client"

import { motion } from "framer-motion"
import { Check, Flame, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  HABIT_COLORS,
  computeStreaks,
  habitCompletedSet,
  isDoneOn,
  isScheduledOn,
} from "@/lib/habit-utils"
import { habit3D, stackLayerStyles } from "@/lib/habit-3d"
import type { Habit } from "@/types/habit"
import { cn } from "@/lib/utils"

interface TodayListProps {
  habits: Habit[]
  loading: boolean
  today: string
  pendingHabitId?: string
  onToggle: (habitId: string) => void
}

const STACK_OFFSETS = [
  "translate-x-2.5 translate-y-2.5",
  "translate-x-[5px] translate-y-[5px]",
]

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

  // Only habits due today appear in the Today list (e.g. জুমার নামাজ Fridays)
  const dueHabits = habits.filter((habit) => isScheduledOn(habit, today))

  return (
    <div className="space-y-4">
      {dueHabits.map((habit, index) => {
        const done = isDoneOn(habit, today)
        const colorDef = HABIT_COLORS[habit.color]
        const streaks = computeStreaks(habitCompletedSet(habit), (k) =>
          isScheduledOn(habit, k)
        )
        const pending = pendingHabitId === habit.id
        const style3d = habit3D(index, colorDef.hex)

        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.04 }}
            layout
            className="relative"
          >
            {/* offset depth panels behind "stack"-variant cards */}
            {style3d.variant === "stack" &&
              stackLayerStyles(colorDef.hex).map((layerStyle, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 rounded-2xl",
                    STACK_OFFSETS[i]
                  )}
                  style={layerStyle}
                />
              ))}

            <div
              className={cn(
                "relative flex items-center gap-3 bg-card p-3.5 sm:gap-4 sm:p-4",
                style3d.cardClass,
                done && "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]"
              )}
              style={style3d.cardStyle}
            >
              {style3d.sheen && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/10 to-transparent"
                />
              )}
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl",
                  colorDef.chip
                )}
                style={style3d.iconStyle}
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
                  className="hidden items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] dark:text-amber-400 sm:inline-flex"
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
                style={done ? style3d.buttonDownStyle : style3d.buttonUpStyle}
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
