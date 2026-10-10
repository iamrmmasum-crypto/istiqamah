import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"

const toggleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
})

type RouteContext = { params: Promise<{ id: string }> }

// POST /api/habits/[id]/toggle — toggle completion for a given day
export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const parsed = toggleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 })
    }
    const { date } = parsed.data

    const habit = await db.habit.findUnique({ where: { id } })
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    const existing = await db.habitEntry.findUnique({
      where: { habitId_date: { habitId: id, date } },
    })

    if (existing?.completed) {
      await db.habitEntry.delete({ where: { id: existing.id } })
      return NextResponse.json({ completed: false })
    }

    await db.habitEntry.upsert({
      where: { habitId_date: { habitId: id, date } },
      update: { completed: true },
      create: { habitId: id, date, completed: true },
    })
    return NextResponse.json({ completed: true })
  } catch (error) {
    console.error("POST /api/habits/[id]/toggle failed:", error)
    return NextResponse.json({ error: "Failed to toggle habit" }, { status: 500 })
  }
}
