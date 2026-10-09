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
}

export interface ToggleResult {
  completed: boolean
}
