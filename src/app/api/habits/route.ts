import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"

const createSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  description: z.string().trim().max(200).nullable().optional(),
  icon: z.string().min(1).max(8).default("✅"),
  color: z.enum(["emerald", "amber", "rose", "violet", "teal", "orange"]).default("emerald"),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
  targetDays: z.number().int().min(1).max(7).default(7),
  // CSV of due weekdays 0-6 (0=Sun…6=Sat); "" = every day (e.g. "5" = Fridays)
  scheduledDays: z
    .string()
    .regex(/^$|^[0-6](,[0-6])*$/, "Must be empty or CSV of weekdays 0-6")
    .default(""),
})

// GET /api/habits — list all habits with their entries
export async function GET() {
  try {
    const habits = await db.habit.findMany({
      where: { archived: false },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        entries: {
          orderBy: { date: "desc" },
        },
      },
    })
    return NextResponse.json({ habits })
  } catch (error) {
    console.error("GET /api/habits failed:", error)
    return NextResponse.json({ error: "Failed to load habits" }, { status: 500 })
  }
}

// POST /api/habits — create a habit
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid habit data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const max = await db.habit.aggregate({ _max: { sortOrder: true } })
    const habit = await db.habit.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        icon: parsed.data.icon,
        color: parsed.data.color,
        frequency: parsed.data.frequency,
        targetDays:
          parsed.data.frequency === "weekly" ? parsed.data.targetDays : 7,
        scheduledDays: parsed.data.scheduledDays,
        sortOrder: (max._max.sortOrder ?? 0) + 1,
      },
      include: { entries: true },
    })

    return NextResponse.json({ habit }, { status: 201 })
  } catch (error) {
    console.error("POST /api/habits failed:", error)
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 })
  }
}
