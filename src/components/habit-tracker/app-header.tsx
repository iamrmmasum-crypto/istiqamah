"use client"

import { Download, Flame, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useScrollToSection } from "@/components/scroll/smooth-scroll"

const NAV = [
  { id: "today", label: "আজ" },
  { id: "habits", label: "অভ্যাস" },
  { id: "insights", label: "ইনসাইট" },
]

export function AppHeader({ onNewHabit }: { onNewHabit: () => void }) {
  const scrollTo = useScrollToSection()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2.5 rounded-xl text-left transition-opacity hover:opacity-80"
          aria-label="Back to top"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight">
              Istiqamah{" "}
              <span
                className="ml-0.5 font-normal text-emerald-600 dark:text-emerald-400"
                lang="ar"
              >
                اسْتِقَامَة
              </span>
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Habit &amp; discipline tracker
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* section nav */}
          <nav aria-label="Page sections" className="mr-1 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <a
              href="/api/habits/export"
              download
              aria-label="Download data backup (CSV)"
              title="Download data backup (CSV)"
            >
              <Download className="h-4.5 w-4.5" aria-hidden="true" />
            </a>
          </Button>
          <ThemeToggle />
          <Button
            onClick={onNewHabit}
            className="rounded-full bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">New habit</span>
            <span className="sr-only">New habit</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
