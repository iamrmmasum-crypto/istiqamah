"use client"

import { useEffect, useState, useMemo } from "react"
import { Clock, MapPin, Compass, CheckCircle2, ChevronRight, Moon, Sun, Sunrise } from "lucide-react"
import { motion } from "framer-motion"
import { calculatePrayerTimes, formatPrayerTime, POPULAR_CITIES, type CityLocation } from "@/lib/prayer-times"
import { soundEffects } from "@/lib/audio-effects"
import type { Habit } from "@/types/habit"

interface PrayerWidgetProps {
  habits?: Habit[]
  onToggleHabit?: (habitId: string) => void
  todayKey?: string
}

export function PrayerWidget({ habits = [], onToggleHabit, todayKey = "" }: PrayerWidgetProps) {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(POPULAR_CITIES[0])
  const [now, setNow] = useState<Date>(new Date())

  // Keep time ticking
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const prayerData = useMemo(() => {
    return calculatePrayerTimes(now, selectedCity.coords)
  }, [now, selectedCity])

  // Map prayer to habit
  const prayerHabitMap: Record<string, Habit | undefined> = useMemo(() => {
    return {
      fajr: habits.find((h) => h.name.includes("ফজর") || h.name.toLowerCase().includes("fajr")),
      dhuhr: habits.find((h) => h.name.includes("জোহর") || h.name.toLowerCase().includes("dhuhr")),
      asr: habits.find((h) => h.name.includes("আসর") || h.name.toLowerCase().includes("asr")),
      maghrib: habits.find((h) => h.name.includes("মাগরিব") || h.name.toLowerCase().includes("maghrib")),
      isha: habits.find((h) => h.name.includes("এশা") || h.name.toLowerCase().includes("isha")),
    }
  }, [habits])

  const prayersList = [
    {
      id: "fajr",
      name: "Fajr",
      nameBn: "ফজর",
      time: prayerData.fajr,
      icon: Sunrise,
      gradient: "from-indigo-500/20 to-sky-500/10",
      activeBorder: "border-indigo-400/50",
    },
    {
      id: "dhuhr",
      name: "Dhuhr",
      nameBn: "জোহর",
      time: prayerData.dhuhr,
      icon: Sun,
      gradient: "from-amber-500/20 to-yellow-500/10",
      activeBorder: "border-amber-400/50",
    },
    {
      id: "asr",
      name: "Asr",
      nameBn: "আসর",
      time: prayerData.asr,
      icon: Sun,
      gradient: "from-orange-500/20 to-amber-500/10",
      activeBorder: "border-orange-400/50",
    },
    {
      id: "maghrib",
      name: "Maghrib",
      nameBn: "মাগরিব",
      time: prayerData.maghrib,
      icon: Sunrise,
      gradient: "from-rose-500/20 to-pink-500/10",
      activeBorder: "border-rose-400/50",
    },
    {
      id: "isha",
      name: "Isha",
      nameBn: "এশা",
      time: prayerData.isha,
      icon: Moon,
      gradient: "from-violet-500/20 to-purple-500/10",
      activeBorder: "border-violet-400/50",
    },
  ]

  const next = prayerData.nextPrayer

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card/90 via-card/60 to-emerald-950/20 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
      {/* Decorative Islamic geometry ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/25">
            <Compass className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                সঠিক ওয়াক্ত ও মোনাজাত
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                লাইভ গণনা
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight sm:text-xl">নামাজের সময়সূচি ও ইস্তিকামাহ</h3>
          </div>
        </div>

        {/* City selector */}
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-background/60 px-3 py-1.5 backdrop-blur-md">
          <MapPin className="h-4 w-4 text-emerald-500" />
          <select
            value={selectedCity.id}
            onChange={(e) => {
              const found = POPULAR_CITIES.find((c) => c.id === e.target.value)
              if (found) setSelectedCity(found)
            }}
            className="bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
            aria-label="Select City"
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-background text-foreground">
                {c.nameBn} ({c.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Next prayer spotlight banner */}
      <div className="relative my-6 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/15 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              পরবর্তী ওয়াক্ত
            </span>
            <div className="mt-0.5 flex items-baseline gap-3">
              <h4 className="text-2xl font-black sm:text-3xl text-foreground">
                {next.nameBn} এর নামাজ
              </h4>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {formatPrayerTime(next.time, "bn")}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              ওয়াক্ত শুরু হতে বাকি:{" "}
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                {next.remainingFormatted}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-background/80 px-4 py-2 border border-white/10 shadow-sm backdrop-blur">
              <Clock className="h-4 w-4 text-emerald-500 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="font-mono text-sm font-bold tabular-nums">
                {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Prayers Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {prayersList.map((prayer) => {
          const isNext = prayer.id === next.key
          const habit = prayerHabitMap[prayer.id]
          const isDone = habit?.entries?.some((e) => e.date === todayKey && e.completed)

          const Icon = prayer.icon

          return (
            <motion.div
              key={prayer.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3.5 transition-all ${
                isNext
                  ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                  : "border-white/10 bg-card/60 hover:border-white/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">{prayer.nameBn}</span>
                  <Icon className={`h-4 w-4 ${isNext ? "text-emerald-400" : "text-muted-foreground"}`} />
                </div>
                <div className="mt-2">
                  <span className="text-base font-black tracking-tight text-foreground sm:text-lg">
                    {formatPrayerTime(prayer.time, "bn")}
                  </span>
                </div>
              </div>

              {/* Habit sync button */}
              <div className="mt-3 pt-2.5 border-t border-white/5">
                {habit ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playHabitDone()
                      if (onToggleHabit) onToggleHabit(habit.id)
                    }}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      isDone
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/40"
                        : "bg-foreground/5 hover:bg-emerald-500/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isDone ? "আদায় সম্পন্ন" : "আদায় করুন"}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-muted-foreground/70 flex items-center justify-center py-1">
                    ওয়াক্ত টাইম
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Extra spiritual indicators: Sunrise & Tahajjud */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground rounded-2xl border border-white/5 bg-background/30 p-3">
        <div className="flex items-center gap-2">
          <Sunrise className="h-3.5 w-3.5 text-amber-500" />
          <span>সূর্যোদয় (ইশরাক): {formatPrayerTime(prayerData.sunrise, "bn")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="h-3.5 w-3.5 text-indigo-400" />
          <span>তাহাজ্জুদ শেষ: {formatPrayerTime(prayerData.tahajjudEnd, "bn")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
          <span>ইস্তিকামাহ গাইড</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  )
}
