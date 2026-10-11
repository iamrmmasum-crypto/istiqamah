"use client"

import { useState, useEffect, useMemo } from "react"
import { Moon, Utensils, Sparkles, CheckCircle2, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { calculatePrayerTimes, formatPrayerTime, POPULAR_CITIES } from "@/lib/prayer-times"
import { soundEffects } from "@/lib/audio-effects"

export function FastingTracker() {
  const [isFasting, setIsFasting] = useState(false)
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const saved = localStorage.getItem(`istiqamah_fasting_${today}`)
      if (saved) setIsFasting(saved === "true")
    } catch {}
  }, [])

  const toggleFasting = () => {
    const updated = !isFasting
    setIsFasting(updated)
    soundEffects.playHabitDone()
    try {
      const today = new Date().toISOString().slice(0, 10)
      localStorage.setItem(`istiqamah_fasting_${today}`, String(updated))
    } catch {}
  }

  const times = useMemo(() => calculatePrayerTimes(now, POPULAR_CITIES[0].coords), [now])

  // Is today Monday (1) or Thursday (4)? Sunnah fasting days!
  const day = now.getDay()
  const isSunnahDay = day === 1 || day === 4

  // Time remaining to Iftar (Maghrib)
  const diffIftar = Math.max(0, times.maghrib.getTime() - now.getTime())
  const iftarHours = Math.floor(diffIftar / (1000 * 60 * 60))
  const iftarMins = Math.floor((diffIftar / (1000 * 60)) % 60)
  const iftarSecs = Math.floor((diffIftar / 1000) % 60)

  // Time remaining to Suhoor end (Fajr)
  const diffSuhoor = Math.max(0, times.fajr.getTime() - now.getTime())
  const suhoorHours = Math.floor(diffSuhoor / (1000 * 60 * 60))
  const suhoorMins = Math.floor((diffSuhoor / (1000 * 60)) % 60)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-card/90 via-card/70 to-indigo-950/20 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Moon className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              সিয়াম ও রোজা মোড
            </span>
            {isSunnahDay && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                সুন্নাত রোজার দিন
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-black tracking-tight sm:text-xl">সাহরি ও ইফতার কাউন্টডাউন</h3>
          <p className="text-xs text-muted-foreground">
            {isSunnahDay
              ? "আজ সোমবার/বৃহস্পতিবার — রাসুলুল্লাহ (সাঃ) এই দিনে রোজা রাখতেন।"
              : "নফল বা কাজা রোজা রাখা আত্মনিয়ন্ত্রণ ও তাকওয়ার অন্যতম সোপান।"}
          </p>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={toggleFasting}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-lg transition-all cursor-pointer ${
            isFasting
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40"
              : "border border-white/10 bg-background/60 text-muted-foreground hover:bg-background/90 hover:text-foreground"
          }`}
        >
          <CheckCircle2 className={`h-4 w-4 ${isFasting ? "text-white" : "text-muted-foreground"}`} />
          <span>{isFasting ? "আজ আলহামদুলিল্লাহ রোজা আছি" : "আজ রোজা পালন করছি"}</span>
        </button>
      </div>

      {/* Countdown Grid */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Suhoor card */}
        <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-muted-foreground">সাহরির শেষ সময় (ফজর)</span>
            <span className="font-bold text-indigo-400">{formatPrayerTime(times.fajr, "bn")}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-foreground">
              {diffSuhoor > 0 ? `${suhoorHours} ঘণ্টা ${suhoorMins} মিনিট` : "সময় অতিবাহিত"}
            </span>
          </div>
        </div>

        {/* Iftar card */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Utensils className="h-3.5 w-3.5" />
              ইফতারের সময় (মাগরিব)
            </span>
            <span className="font-bold text-amber-700 dark:text-amber-300">
              {formatPrayerTime(times.maghrib, "bn")}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {diffIftar > 0
                ? `${String(iftarHours).padStart(2, "0")}:${String(iftarMins).padStart(2, "0")}:${String(iftarSecs).padStart(2, "0")}`
                : "ইফতারের সময় হয়েছে!"}
            </span>
            {diffIftar > 0 && <span className="text-xs text-muted-foreground">বাকি</span>}
          </div>
        </div>
      </div>

      {/* Iftar Dua quote */}
      <div className="mt-4 rounded-xl border border-white/5 bg-background/20 p-3 text-center">
        <p className="font-arabic text-sm text-foreground" dir="rtl">
          ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          "পিপাসা দূর হলো, শিরা-উপশিরা সিক্ত হলো এবং ইনশাআল্লাহ প্রতিদান নিশ্চিত হলো।" (আবু দাউদ)
        </p>
      </div>
    </div>
  )
}
