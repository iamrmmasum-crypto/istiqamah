"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, ListChecks, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useHabits } from "@/hooks/use-habits"
import { Providers } from "@/components/providers"
import { SmoothScroll } from "@/components/scroll/smooth-scroll"
import { DepthBackground } from "@/components/scroll/depth-background"
import { ScrollProgress } from "@/components/scroll/scroll-progress"
import { Reveal3D } from "@/components/scroll/reveal-3d"
import { HeroScene } from "@/components/scroll/scene-hero"
import { HabitDeck } from "@/components/scroll/scene-deck"
import { SectionHeading } from "@/components/scroll/section-heading"
import { AppHeader } from "@/components/habit-tracker/app-header"
import { DeleteDialog } from "@/components/habit-tracker/delete-dialog"
import { EmptyState } from "@/components/habit-tracker/empty-state"
import { HabitCard } from "@/components/habit-tracker/habit-card"
import { HabitDialog } from "@/components/habit-tracker/habit-dialog"
import { Hero } from "@/components/habit-tracker/hero"
import { Insights } from "@/components/habit-tracker/insights"
import { StatsCards } from "@/components/habit-tracker/stats-cards"
import { TodayList } from "@/components/habit-tracker/today-list"
import { PrayerWidget } from "@/components/spiritual/prayer-widget"
import { DigitalTasbih } from "@/components/spiritual/digital-tasbih"
import { DisciplineRank } from "@/components/spiritual/discipline-rank"
import { FastingTracker } from "@/components/spiritual/fasting-tracker"
import { DailyReflection } from "@/components/spiritual/daily-reflection"
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

  const hero = (
    <Hero
      loading={isLoading}
      done={stats.todayDone}
      total={stats.todayTotal}
      activeStreak={stats.activeStreak}
    />
  )

  return (
    <div className="relative flex min-h-screen flex-col">
      <DepthBackground />
      <ScrollProgress />
      <AppHeader onNewHabit={openCreate} />

      <main className="relative flex-1">
        {isError ? (
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
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
          </div>
        ) : !isLoading && habits.length === 0 ? (
          <>
            <HeroScene>{hero}</HeroScene>
            <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
              <Reveal3D variant="rise">
                <EmptyState
                  onCreate={openCreate}
                  onSeed={handleSeed}
                  seeding={seedDemo.isPending}
                />
              </Reveal3D>
            </section>
          </>
        ) : (
          <>
            {/* ── Scene 1 · pinned cinematic hero ─────────────────────── */}
            <HeroScene>{hero}</HeroScene>

            {/* ── Scene 2 · stats fly in from four axes ───────────────── */}
            <section id="stats" aria-label="Statistics" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
              <SectionHeading
                kicker="এক নজরে"
                title="আজকের মোমেন্টাম"
                description="আজকের অগ্রগতি, চলমান ধারা ও সর্বোচ্চ রেকর্ড — গ্লাস কার্ডে মুহূর্তেই ধরা পড়ে।"
              />
              <StatsCards stats={stats} loading={isLoading} />
            </section>

            {/* ── Scene 3 · Live Prayer Times & Countdown ─────────────── */}
            <section id="prayers" aria-label="Prayer Times" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
              <SectionHeading
                kicker="ওয়াক্ত ও ইবাদত"
                title="লাইভ নামাজের সময়সূচি"
                description="স্বয়ংক্রিয় জ্যোতির্বৈজ্ঞানিক সময় গণনা, পরবর্তী ওয়াক্তের কাউন্টডাউন এবং এক ক্লিকে নামাজ আদায় রেকর্ড।"
              />
              <Reveal3D variant="rise">
                <PrayerWidget
                  habits={habits}
                  todayKey={today}
                  onToggleHabit={handleToggle}
                />
              </Reveal3D>
            </section>

            {/* ── Scene 4 · Interactive Digital Tasbih ─────────────────── */}
            <section id="tasbih" aria-label="Digital Tasbih" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
              <SectionHeading
                kicker="জিকির ও স্মরণ"
                title="ইন্টারেক্টিভ ডিজিটাল তাসবীহ"
                description="বাস্তবধর্মী হ্যাপটিক উডেন ক্লিকের শব্দ, একাধিক মাসনুন জিকির প্রিসেট ও সাইকেল সমাপ্তির সুরেলা ঘণ্টা।"
              />
              <Reveal3D variant="rise">
                <DigitalTasbih />
              </Reveal3D>
            </section>

            {/* ── Scene 5 · Discipline Rank & Achievement Badges ──────── */}
            <section id="rank" aria-label="Discipline Rank" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
              <SectionHeading
                kicker="শৃঙ্খলা ও অর্জন"
                title="আধ্যাত্মিক র্যাংক ও সম্মাননা"
                description="তালিব থেকে মুত্তাকী পর্যন্ত ৫টি মর্যাদাপূর্ণ র্যাংক, অর্জিত XP ও ধারাবাহিকতার ব্যাজ আনলক।"
              />
              <Reveal3D variant="rise">
                <DisciplineRank stats={stats} />
              </Reveal3D>
            </section>

            {/* ── Scene 6 · Fasting & Daily Muhasabah ───────────────────── */}
            <section id="fasting" aria-label="Fasting & Reflection" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
              <SectionHeading
                kicker="সিয়াম ও আত্মশুদ্ধি"
                title="রোজা ও দৈনিক মুহাসাবাহ"
                description="সাহরি-ইফতারের লাইভ কাউন্টডাউন, সুন্নাত রোজার দিকনির্দেশনা ও ৩টি নিয়ামতের শুকরিয়া জার্নাল।"
              />
              <Reveal3D variant="rise">
                <div className="space-y-6">
                  <FastingTracker />
                  <DailyReflection />
                </div>
              </Reveal3D>
            </section>

            {/* ── Scene 3 · today's checklist, rows rise from depth ───── */}
            <section id="today" aria-label="Today's checklist" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
              <SectionHeading
                kicker="চেকলিস্ট"
                title="আজকের অভ্যাস"
                description={
                  remaining > 0
                    ? `আর মাত্র ${remaining}টি বাকি — প্রতিটি টিক এক ধাপ এগিয়ে।`
                    : "আজকের সব কুঠুরি টিক — আলহামদুলিল্লাহ, পুরো দিন শেষ!"
                }
              />
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground">
                <ListChecks className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>
                  {stats.todayDone}/{stats.todayTotal} সম্পন্ন ·{" "}
                  <span className="hidden sm:inline">কীবোর্ডে </span>
                  <kbd className="rounded border border-border/70 bg-muted/50 px-1 font-mono text-[10px]">1</kbd>–
                  <kbd className="rounded border border-border/70 bg-muted/50 px-1 font-mono text-[10px]">9</kbd>
                  <span className="hidden sm:inline"> চেপেও টিক করা যায়</span>
                </span>
              </div>
              <TodayList
                habits={habits}
                loading={isLoading}
                today={today}
                pendingHabitId={toggleHabit.isPending ? toggleHabit.variables?.habitId : undefined}
                onToggle={handleToggle}
              />
            </section>

            {/* ── Scene 4 · habit deck — horizontal 3D coverflow ──────── */}
            {!isLoading && habits.length > 0 && (
              <HabitDeck
                count={habits.length}
                heading={
                  <SectionHeading
                    kicker="কালেকশন"
                    title="সব অভ্যাস"
                    description="স্ক্রল করতেই থাকুন — কার্ডগুলো ত্রিমাত্রিক কভারফ্লোতে পাশে গড়িয়ে যাবে।"
                  />
                }
                renderItem={(index) => (
                  <HabitCard
                    habit={habits[index]}
                    index={index}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                  />
                )}
              />
            )}

            {/* ── Scene 5 · insights ──────────────────────────────────── */}
            <section id="insights" aria-label="Insights" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
              <SectionHeading
                kicker="ইনসাইট"
                title="ধরা ও অগ্রগতি"
                description="২০ সপ্তাহের হিটম্যাপ, সাপ্তাহিক তুলনা আর প্রতিটি অভ্যাসের নিজস্ব ছন্দ।"
              />
              <Reveal3D variant="rise">
                <Insights habits={habits} perDayCounts={perDayCounts} />
              </Reveal3D>
            </section>
          </>
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
      <SmoothScroll>
        <TrackerApp />
      </SmoothScroll>
    </Providers>
  )
}
