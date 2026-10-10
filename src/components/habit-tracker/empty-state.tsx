"use client"

import { Loader2, Plus, Sparkles, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  onCreate: () => void
  onSeed: () => void
  seeding: boolean
  className?: string
}

export function EmptyState({ onCreate, onSeed, seeding, className }: EmptyStateProps) {
  return (
    <Card className={`border-dashed ${className ?? ""}`}>
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <Target className="h-7 w-7 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Build your first habit</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Pick one small thing you can repeat daily. Discipline compounds — start
            with a single check-in today.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            onClick={onCreate}
            className="rounded-full bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create habit
          </Button>
          <Button variant="outline" onClick={onSeed} disabled={seeding} className="rounded-full">
            {seeding ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            )}
            {seeding ? "Loading sample data..." : "Load sample data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
