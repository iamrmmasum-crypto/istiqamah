"use client"

import { motion } from "framer-motion"
import { Check, Flame, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HABIT_COLORS,
  addDays,
  completionRate,
  computeStreaks,
  countCompletions,
  habitCompletedSet,
  isDoneOn,
  isScheduledOn,
  rateWindowDays,
  scheduleLabel,
  todayKey,
  weekdayLetter,
} from "@/lib/habit-utils"
import type { Habit } from "@/types/habit"
import { cn } from "@/lib/utils"

interface HabitCardProps {
  habit: Habit
  index: number
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
}

export function HabitCard({ habit, index, onEdit, onDelete }: HabitCardProps) {
  const colorDef = HABIT_COLORS[habit.color]
  const today = todayKey()
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, -(6 - i)))
  const streaks = computeStreaks(habitCompletedSet(habit), (k) =>
    isScheduledOn(habit, k)
  )
  const total = countCompletions(habit)
  const rate = completionRate(habit, 30)
  // Measured from the habit's creation day (a fresh habit shows "1d", not "30d")
  const rateDays = rateWindowDays(habit, 30)
  const schedule = scheduleLabel(habit)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      layout
      className="h-full"
    >
      <Card className="flex h-full flex-col rounded-xl transition-shadow hover:shadow-md">
        <CardContent className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-start gap-3">
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
              <p className="truncate font-semibold leading-tight">{habit.name}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                  {schedule ??
                    (habit.frequency === "daily"
                      ? "Daily"
                      : `${habit.targetDays}\u00D7/week`)}
                </Badge>
                <span
                  className={cn("text-xs font-semibold", colorDef.text)}
                  title={`Completion rate since this habit was created (up to 30 days)`}
                >
                  {rate}% · {rateDays}d
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  aria-label={`Options for ${habit.name}`}
                >
                  <MoreVertical className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(habit)}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(habit)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {habit.description && (
            <p className="-mt-1 line-clamp-2 text-sm text-muted-foreground">
              {habit.description}
            </p>
          )}

          <div className="mt-auto space-y-4">
            <div className="flex justify-between" aria-label="Last 7 days">
              {last7.map((date) => {
                const done = isDoneOn(habit, date)
                const isToday = date === today
                const due = isScheduledOn(habit, date)
                return (
                  <div key={date} className="flex flex-col items-center gap-1">
                    <span
                      className={cn(
                        "text-[10px] text-muted-foreground",
                        isToday && "font-bold text-foreground"
                      )}
                    >
                      {weekdayLetter(date)}
                    </span>
                    <div
                      title={date + (due ? "" : " · not scheduled")}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                        done
                          ? cn(colorDef.solid, "border-transparent text-white")
                          : "border-border",
                        !due && "opacity-40",
                        isToday && !done && "ring-2 ring-foreground/15"
                      )}
                    >
                      {done && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Flame className={cn("h-3.5 w-3.5", streaks.current > 0 ? "text-amber-500" : "text-muted-foreground")} aria-hidden="true" />
                {streaks.current} day streak
              </span>
              <span>{total} check-ins</span>
              <span>best: {streaks.best}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
