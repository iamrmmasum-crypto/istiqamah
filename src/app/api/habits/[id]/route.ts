import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"

const updateSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  description: z.string().trim().max(200).nullable().optional(),
  icon: z.string().min(1).max(8).optional(),
  color: z.enum(["emerald", "amber", "rose", "violet", "teal", "orange"]).optional(),
  frequency: z.enum(["daily", "weekly"]).optional(),
  targetDays: z.number().int().min(1).max(7).optional(),
  // CSV of due weekdays 0-6 (0=Sun…6=Sat); "" = every day
  scheduledDays: z
    .string()
    .regex(/^$|^[0-6](,[0-6])*$/, "Must be empty or CSV of weekdays 0-6")
    .optional(),
  archived: z.boolean().optional(),
})

type RouteContext = { params: Promise<{ id: string }> }

// PATCH /api/habits/[id] — update a habit
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid habit data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await db.habit.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    const data: Record<string, unknown> = { ...parsed.data }
    // If frequency changed to daily, reset targetDays to 7
    if (parsed.data.frequency === "daily") data.targetDays = 7
    if (parsed.data.description === undefined && "description" in body) {
      data.description = null
    }

    const habit = await db.habit.update({
      where: { id },
      data,
      include: { entries: { orderBy: { date: "desc" } } },
    })

    return NextResponse.json({ habit })
  } catch (error) {
    console.error("PATCH /api/habits/[id] failed:", error)
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 })
  }
}

// DELETE /api/habits/[id] — delete a habit (entries cascade)
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const existing = await db.habit.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    await db.habit.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE /api/habits/[id] failed:", error)
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 })
  }
}
