"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
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
  // Only habits due today appear in the Today list (e.g. জুমার নামাজ Fridays)
  const dueHabits = habits.filter((habit) => isScheduledOn(habit, today))

  // Keyboard shortcuts: press 1–9 to toggle the first nine habits.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return
      }
      const n = Number(e.key)
      if (!Number.isInteger(n) || n < 1 || n > 9) return
      const habit = dueHabits[n - 1]
      if (habit) onToggle(habit.id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [dueHabits, onToggle])

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
              {index < 9 && (
                <kbd
                  aria-hidden="true"
                  className="hidden h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/50 px-1 font-mono text-[10px] font-medium text-muted-foreground/70 sm:inline-flex"
                >
                  {index + 1}
                </kbd>
              )}
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => onToggle(habit.id)}
                disabled={pending}
                aria-pressed={done}
                aria-label={`${done ? "Mark incomplete" : "Mark complete"}: ${habit.name}`}
                className={cn(
                  "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-60",
                  done
                    ? cn(colorDef.solid, "border-transparent text-white")
                    : "border-muted-foreground/25 text-transparent hover:border-muted-foreground/50 hover:text-muted-foreground/30"
                )}
                style={done ? style3d.buttonDownStyle : style3d.buttonUpStyle}
              >
                {/* one-shot ring pulse on completion */}
                {done && !pending && (
                  <motion.span
                    key={`pulse-${today}`}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border-2 border-current"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.9, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                )}
                <AnimatePresence mode="wait" initial={false}>
                  {pending ? (
                    <motion.span
                      key="pending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key={done ? "done" : "undone"}
                      initial={{ scale: 0, rotate: -30, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                      className="flex"
                    >
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        )
      })}
      {dueHabits.length > 0 && (
        <p className="hidden text-center text-xs text-muted-foreground/70 sm:block">
          Tip: press{" "}
          <kbd className="rounded border border-border/70 bg-muted/50 px-1 font-mono text-[10px]">
            1
          </kbd>
          –
          <kbd className="rounded border border-border/70 bg-muted/50 px-1 font-mono text-[10px]">
            9
          </kbd>{" "}
          to tick habits instantly
        </p>
      )}
    </div>
  )
}
