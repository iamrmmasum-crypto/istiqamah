"use client"

import { Download, Flame, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppHeader({ onNewHabit }: { onNewHabit: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
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
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
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
