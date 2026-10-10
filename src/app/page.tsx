"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useHabits } from "@/hooks/use-habits"
import { Providers } from "@/components/providers"
import {
  AppHeader,
} from "@/components/habit-tracker/app-header"
import { DeleteDialog } from "@/components/habit-tracker/delete-dialog"
import { EmptyState } from "@/components/habit-tracker/empty-state"
import { HabitCard } from "@/components/habit-tracker/habit-card"
import { HabitDialog } from "@/components/habit-tracker/habit-dialog"
import { Hero } from "@/components/habit-tracker/hero"
import { Insights } from "@/components/habit-tracker/insights"
import { StatsCards } from "@/components/habit-tracker/stats-cards"
import { TodayList } from "@/components/habit-tracker/today-list"
import {
  aggregateStats,
  completionsPerDay,
  todayKey,
} from "@/lib/habit-utils"
import type { Habit, HabitInput } from "@/types/habit"

function TrackerApp() {
  const {
    habits,
    isLoading,
    isError,
    refetch,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    seedDemo,
  } = useHabits()
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Habit | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null)

  const today = todayKey()
  const stats = useMemo(() => aggregateStats(habits), [habits])
  const perDayCounts = useMemo(() => completionsPerDay(habits), [habits])

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditing(habit)
    setDialogOpen(true)
  }

  const handleDialogSubmit = async (input: HabitInput) => {
    try {
      if (editing) {
        await updateHabit.mutateAsync({ id: editing.id, input })
        toast({ title: "Habit updated", description: input.name })
      } else {
        await createHabit.mutateAsync(input)
        toast({ title: "Habit created", description: `Started tracking "${input.name}".` })
      }
      setDialogOpen(false)
      setEditing(null)
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const target = deleteTarget
    try {
      await deleteHabit.mutateAsync(target.id)
      setDeleteTarget(null)
      toast({ title: "Habit deleted", description: target.name })
    } catch (err) {
      toast({
        title: "Could not delete habit",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggle = (habitId: string) => {
    toggleHabit.mutate({ habitId, date: today })
  }

  const handleSeed = () => {
    seedDemo.mutate(undefined, {
      onError: (err) =>
        toast({
          title: "Could not load sample data",
          description: err.message,
          variant: "destructive",
        }),
    })
  }

  const submitting = createHabit.isPending || updateHabit.isPending
  const remaining = stats.todayTotal - stats.todayDone

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader onNewHabit={openCreate} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {isError ? (
          <Card className="border-destructive/40">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
              <div>
                <p className="font-semibold">Could not load your habits</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check your connection and try again.
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline" className="rounded-full">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : !isLoading && habits.length === 0 ? (
          <div className="space-y-6">
            <Hero
              loading={isLoading}
              done={stats.todayDone}
              total={stats.todayTotal}
              activeStreak={stats.activeStreak}
            />
            <EmptyState
              onCreate={openCreate}
              onSeed={handleSeed}
              seeding={seedDemo.isPending}
            />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <Hero
              loading={isLoading}
              done={stats.todayDone}
              total={stats.todayTotal}
              activeStreak={stats.activeStreak}
            />

            <StatsCards stats={stats} loading={isLoading} />

            <Tabs defaultValue="today">
              <TabsList className="h-11 w-full justify-start overflow-x-auto rounded-xl bg-muted/60 p-1 sm:w-auto">
                <TabsTrigger value="today" className="rounded-lg px-4 data-[state=active]:bg-background">
                  Today
                  {!isLoading && remaining > 0 && (
                    <span className="ml-1.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {remaining} left
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="habits" className="rounded-lg px-4 data-[state=active]:bg-background">
                  All habits
                </TabsTrigger>
                <TabsTrigger value="insights" className="rounded-lg px-4 data-[state=active]:bg-background">
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-4 sm:mt-6">
                <TodayList
                  habits={habits}
                  loading={isLoading}
                  today={today}
                  pendingHabitId={toggleHabit.isPending ? toggleHabit.variables?.habitId : undefined}
                  onToggle={handleToggle}
                />
              </TabsContent>

              <TabsContent value="habits" className="mt-4 sm:mt-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {habits.map((habit, index) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      index={index}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-4 sm:mt-6">
                <Insights habits={habits} perDayCounts={perDayCounts} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-1 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>Istiqamah — habit &amp; discipline tracker</p>
          <p>
            <span lang="ar">فَاسْتَقِمْ كَمَا أُمِرْتَ</span> — অবিচল থাকুন, একদিন এক ধাপে।
          </p>
        </div>
      </footer>

      <HabitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        habit={editing}
        submitting={submitting}
        onSubmit={handleDialogSubmit}
      />

      <DeleteDialog
        habit={deleteTarget}
        deleting={deleteHabit.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default function Home() {
  return (
    <Providers>
      <TrackerApp />
    </Providers>
  )
}
