export type HabitColor =
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "teal"
  | "orange"

export type HabitFrequency = "daily" | "weekly"

export interface HabitEntry {
  id: string
  habitId: string
  date: string // YYYY-MM-DD (client-local)
  completed: boolean
  createdAt: string
}

export interface Habit {
  id: string
  name: string
  description: string | null
  icon: string
  color: HabitColor
  frequency: HabitFrequency
  targetDays: number
  /** CSV of due weekdays 0-6 (0=Sun…6=Sat); "" = due every day */
  scheduledDays: string
  archived: boolean
  sortOrder: number
  createdAt: string
  entries: HabitEntry[]
}

export interface HabitInput {
  name: string
  description?: string | null
  icon: string
  color: HabitColor
  frequency: HabitFrequency
  targetDays: number
  scheduledDays?: string
}

export interface ToggleResult {
  completed: boolean
}
