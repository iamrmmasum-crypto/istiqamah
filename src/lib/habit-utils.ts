import type { Habit, HabitColor } from "@/types/habit"

/* ---------------------------------- dates --------------------------------- */

/** Format a Date as a local "YYYY-MM-DD" key. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Parse a "YYYY-MM-DD" key into a local Date (midnight). */
export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key: string, n: number): string {
  const d = parseKey(key)
  d.setDate(d.getDate() + n)
  return toDateKey(d)
}

export function todayKey(): string {
  return toDateKey(new Date())
}

/** 0 = Sunday ... 6 = Saturday */
export function dayOfWeek(key: string): number {
  return parseKey(key).getDay()
}

/** Short weekday letter for a date key: S M T W T F S */
export function weekdayLetter(key: string): string {
  return "SMTWTFS"[dayOfWeek(key)]
}

/** Last n date keys ending at `end` (inclusive), oldest first. */
export function lastNDays(n: number, end: string = todayKey()): string[] {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) days.push(addDays(end, -i))
  return days
}

/** Pretty label like "Mar 14" for tooltips. */
export function formatDayLabel(key: string): string {
  return parseKey(key).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

/** Full pretty label like "Saturday, March 14". */
export function formatDayLabelLong(key: string): string {
  return parseKey(key).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

/**
 * First day (Friday) of the week containing `key`.
 * The week starts on Jumu'ah (Friday) and runs through Thursday,
 * following the Islamic week.
 */
export function startOfWeek(key: string): string {
  // dayOfWeek: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const dow = dayOfWeek(key)
  return addDays(key, -((dow - 5 + 7) % 7))
}

/* --------------------------------- streaks -------------------------------- */

export interface Streaks {
  /** consecutive days ending today (or yesterday if today not yet done) */
  current: number
  /** longest consecutive run ever */
  best: number
}

export function computeStreaks(completedDates: Set<string>): Streaks {
  if (completedDates.size === 0) return { current: 0, best: 0 }

  const sorted = [...completedDates].sort()
  let best = 1
  let run = 1
  for (let i = 1; i < sorted.length; i++) {
    if (addDays(sorted[i - 1], 1) === sorted[i]) run++
    else run = 1
    if (run > best) best = run
  }

  const today = todayKey()
  let cursor = completedDates.has(today) ? today : addDays(today, -1)
  let current = 0
  while (completedDates.has(cursor)) {
    current++
    cursor = addDays(cursor, -1)
  }

  return { current, best }
}

/* ------------------------------ habit helpers ----------------------------- */

export function habitCompletedSet(habit: Habit): Set<string> {
  return new Set(
    habit.entries.filter((e) => e.completed).map((e) => e.date)
  )
}

export function isDoneOn(habit: Habit, date: string): boolean {
  return habit.entries.some((e) => e.date === date && e.completed)
}

export function countCompletions(habit: Habit): number {
  return habit.entries.filter((e) => e.completed).length
}

/* --------------------------- rate windows --------------------------- */

/** Local date key of the day a habit was created. */
export function createdKey(habit: Habit): string {
  const d = new Date(habit.createdAt)
  return isNaN(d.getTime()) ? todayKey() : toDateKey(d)
}

/**
 * Date keys used for rate calculations: the last `days` days ending today,
 * but never reaching back before the habit was created. A brand-new habit
 * is only measured from its start day, so a fresh app shows honest rates
 * (e.g. 100% for today when done) instead of ~3% against days that did
 * not exist yet. Falls back to just today if creation is in the future.
 */
export function rateWindow(habit: Habit, days = 30): string[] {
  const created = createdKey(habit)
  const clamped = lastNDays(days).filter((d) => d >= created)
  return clamped.length > 0 ? clamped : [todayKey()]
}

/** Number of days in the clamped rate window (for labels like "1d"). */
export function rateWindowDays(habit: Habit, days = 30): number {
  return rateWindow(habit, days).length
}

/**
 * Completion rate over the rate window (last `days` days, clamped to the
 * habit's creation date). Daily habits expect one entry per day; weekly
 * habits expect `targetDays` per 7 days. Capped at 100%.
 */
export function completionRate(habit: Habit, days = 30): number {
  const dates = habitCompletedSet(habit)
  const window = rateWindow(habit, days)
  let done = 0
  for (const d of window) if (dates.has(d)) done++
  const expected =
    habit.frequency === "daily"
      ? window.length
      : Math.max(1, Math.round((habit.targetDays * window.length) / 7))
  return Math.min(100, Math.round((done / expected) * 100))
}

export interface AggregatedStats {
  todayDone: number
  todayTotal: number
  activeStreak: number // best current streak across habits
  bestStreak: number // all-time best across habits
  rate: number // 0-100 combined completion rate (since each habit was created, capped at 30 days)
  rateWindowDays: number // longest per-habit window used, for honest labels ("since Oct 9")
  totalCompletions: number
}

export function aggregateStats(habits: Habit[]): AggregatedStats {
  const today = todayKey()
  let todayDone = 0
  let activeStreak = 0
  let bestStreak = 0
  let totalDone = 0
  let doneSum = 0
  let expectedSum = 0
  let windowDays = 0

  for (const habit of habits) {
    if (isDoneOn(habit, today)) todayDone++
    const dates = habitCompletedSet(habit)
    const streaks = computeStreaks(dates)
    if (streaks.current > activeStreak) activeStreak = streaks.current
    if (streaks.best > bestStreak) bestStreak = streaks.best
    totalDone += countCompletions(habit)

    // Each habit is only measured from its own creation date forward
    const window = rateWindow(habit, 30)
    if (window.length > windowDays) windowDays = window.length
    for (const d of window) if (dates.has(d)) doneSum++
    expectedSum +=
      habit.frequency === "daily"
        ? window.length
        : Math.max(1, Math.round((habit.targetDays * window.length) / 7))
  }

  const rate = expectedSum === 0 ? 0 : Math.min(100, Math.round((doneSum / expectedSum) * 100))

  return {
    todayDone,
    todayTotal: habits.length,
    activeStreak,
    bestStreak,
    rate,
    rateWindowDays: windowDays || 30,
    totalCompletions: totalDone,
  }
}

/** Completions per day across all habits, for the combined heatmap. */
export function completionsPerDay(habits: Habit[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const habit of habits) {
    for (const entry of habit.entries) {
      if (!entry.completed) continue
      map.set(entry.date, (map.get(entry.date) ?? 0) + 1)
    }
  }
  return map
}

/* --------------------------------- palette -------------------------------- */

export interface ColorDef {
  label: string
  hex: string
  /** icon chip: soft background + readable text */
  chip: string
  /** solid filled button / dot */
  solid: string
  solidHover: string
  text: string
  border: string
}

export const HABIT_COLORS: Record<HabitColor, ColorDef> = {
  emerald: {
    label: "Emerald",
    hex: "#10b981",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    solid: "bg-emerald-500",
    solidHover: "hover:bg-emerald-600",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/40",
  },
  amber: {
    label: "Amber",
    hex: "#f59e0b",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    solid: "bg-amber-500",
    solidHover: "hover:bg-amber-600",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/40",
  },
  rose: {
    label: "Rose",
    hex: "#f43f5e",
    chip: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    solid: "bg-rose-500",
    solidHover: "hover:bg-rose-600",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/40",
  },
  violet: {
    label: "Violet",
    hex: "#8b5cf6",
    chip: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    solid: "bg-violet-500",
    solidHover: "hover:bg-violet-600",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/40",
  },
  teal: {
    label: "Teal",
    hex: "#14b8a6",
    chip: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
    solid: "bg-teal-500",
    solidHover: "hover:bg-teal-600",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/40",
  },
  orange: {
    label: "Orange",
    hex: "#f97316",
    chip: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
    solid: "bg-orange-500",
    solidHover: "hover:bg-orange-600",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/40",
  },
}

export const HABIT_COLOR_KEYS = Object.keys(HABIT_COLORS) as HabitColor[]

export const ICON_CHOICES = [
  "💪", "🏃", "📚", "💧", "🧘", "✍️", "🎸", "🥗",
  "😴", "🧹", "💻", "🎯", "🙏", "🚶", "🦷", "☀️",
  "📵", "🧠", "💊", "🌿", "🏋️", "🥤", "📝", "🛏️",
  "🚿", "🛁", "🍎", "🕌",
] as const

/* ------------------------------ motivational ------------------------------ */

export function motivationalMessage(done: number, total: number): string {
  if (total === 0) return "Create your first habit and begin your journey of istiqamah."
  if (done === 0) return "Every streak starts with a single step. Stay istiqamah!"
  if (done < total) {
    const remaining = total - done
    return `Just ${remaining} habit${remaining > 1 ? "s" : ""} away from a perfect day.`
  }
  return "Perfect day complete. Alhamdulillah! Your future self says thank you."
}

export function greetingForNow(): string {
  const h = new Date().getHours()
  if (h < 5) return "Burning the midnight oil"
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}
