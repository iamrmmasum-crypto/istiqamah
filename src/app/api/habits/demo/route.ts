import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { addDays, todayKey } from "@/lib/habit-utils"

// Deterministic PRNG so demo data looks the same every time it is generated.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface DemoSpec {
  name: string
  description: string
  icon: string
  color: "emerald" | "amber" | "rose" | "violet" | "teal" | "orange"
  frequency: "daily" | "weekly"
  targetDays: number
  historyDays: number
  rate: number
  seed: number
  doneToday: boolean
}

const DEMO_HABITS: DemoSpec[] = [
  {
    name: "Morning workout",
    description: "30 minutes of movement before anything else",
    icon: "💪",
    color: "emerald",
    frequency: "daily",
    targetDays: 7,
    historyDays: 70,
    rate: 0.82,
    seed: 11,
    doneToday: true,
  },
  {
    name: "Read 20 pages",
    description: "Non-fiction, before bed",
    icon: "📚",
    color: "amber",
    frequency: "daily",
    targetDays: 7,
    historyDays: 55,
    rate: 0.74,
    seed: 23,
    doneToday: false,
  },
  {
    name: "Drink 2L of water",
    description: "Stay hydrated through the day",
    icon: "💧",
    color: "teal",
    frequency: "daily",
    targetDays: 7,
    historyDays: 40,
    rate: 0.9,
    seed: 37,
    doneToday: true,
  },
  {
    name: "Evening journal",
    description: "Three lines of reflection",
    icon: "✍️",
    color: "violet",
    frequency: "weekly",
    targetDays: 5,
    historyDays: 28,
    rate: 0.62,
    seed: 53,
    doneToday: false,
  },
]

// POST /api/habits/demo — seed a set of sample habits with realistic history
export async function POST() {
  try {
    const existingCount = await db.habit.count()
    if (existingCount > 0) {
      return NextResponse.json(
        { error: "Demo data can only be seeded into an empty tracker" },
        { status: 409 }
      )
    }

    const today = todayKey()

    for (const spec of DEMO_HABITS) {
      const habit = await db.habit.create({
        data: {
          name: spec.name,
          description: spec.description,
          icon: spec.icon,
          color: spec.color,
          frequency: spec.frequency,
          targetDays: spec.targetDays,
          sortOrder: DEMO_HABITS.indexOf(spec) + 1,
        },
      })

      const rand = mulberry32(spec.seed)
      const rows: { habitId: string; date: string; completed: boolean }[] = []
      for (let i = spec.historyDays; i >= 1; i--) {
        const date = addDays(today, -i)
        const recencyBoost = i <= 6 ? 0.15 : 0 // recent days mostly kept
        if (rand() < spec.rate + recencyBoost) {
          rows.push({ habitId: habit.id, date, completed: true })
        }
      }
      if (spec.doneToday) {
        rows.push({ habitId: habit.id, date: today, completed: true })
      }

      for (const row of rows) {
        await db.habitEntry.create({ data: row })
      }
    }

    const habits = await db.habit.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { entries: { orderBy: { date: "desc" } } },
    })
    return NextResponse.json({ habits }, { status: 201 })
  } catch (error) {
    console.error("POST /api/habits/demo failed:", error)
    return NextResponse.json({ error: "Failed to seed demo data" }, { status: 500 })
  }
}
