import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * GET /api/habits/export
 * Returns every habit and its check-in history as a CSV backup download.
 * Columns: habit_name, habit_icon, habit_color, frequency, target_days,
 *          created_at, date, completed
 * Habits with no entries still produce one row (date/completed empty),
 * so nothing is lost in the export.
 */
export async function GET() {
  try {
    const habits = await db.habit.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        entries: { orderBy: [{ date: "asc" }, { createdAt: "asc" }] },
      },
    })

    const header = [
      "habit_name",
      "habit_icon",
      "habit_color",
      "frequency",
      "target_days",
      "habit_created_at",
      "date",
      "completed",
    ].join(",")

    const lines: string[] = [header]

    for (const habit of habits) {
      const base = [
        csvEscape(habit.name),
        csvEscape(habit.icon),
        habit.color,
        habit.frequency,
        String(habit.targetDays),
        habit.createdAt.toISOString(),
      ]

      if (habit.entries.length === 0) {
        lines.push([...base, "", ""].join(","))
        continue
      }

      for (const entry of habit.entries) {
        lines.push(
          [...base, entry.date, entry.completed ? "true" : "false"].join(",")
        )
      }
    }

    const csv = "\uFEFF" + lines.join("\r\n") // BOM so Excel opens Bengali text correctly

    const stamp = new Date().toISOString().slice(0, 10)
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="istiqamah-backup-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("GET /api/habits/export failed:", error)
    return NextResponse.json({ error: "Failed to export habits" }, { status: 500 })
  }
}
