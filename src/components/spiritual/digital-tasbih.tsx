"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, Volume2, VolumeX, Sparkles, Award, Check } from "lucide-react"
import { soundEffects } from "@/lib/audio-effects"

interface DhikrPreset {
  id: string
  arabic: string
  transliteration: string
  meaningBn: string
  target: number
}

const PRESETS: DhikrPreset[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ ٱللَّٰهِ",
    transliteration: "SubhanAllah",
    meaningBn: "আল্লাহ পরম পবিত্র ও মহিমান্বিত",
    target: 33,
  },
  {
    id: "alhamdulillah",
    arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    transliteration: "Alhamdulillah",
    meaningBn: "সকল প্রশংসা ও কৃতজ্ঞতা মহান আল্লাহর",
    target: 33,
  },
  {
    id: "allahuakbar",
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaningBn: "আল্লাহ সর্বশ্রেষ্ঠ ও মহান",
    target: 34,
  },
  {
    id: "lailahaillallah",
    arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ",
    transliteration: "La ilaha illallah",
    meaningBn: "আল্লাহ ছাড়া সত্য কোনো উপাস্য নেই",
    target: 100,
  },
  {
    id: "astaghfirullah",
    arabic: "أَسْتَغْفِرُ ٱللَّٰهَ",
    transliteration: "Astaghfirullah",
    meaningBn: "আমি ক্ষমা প্রার্থনা করছি আল্লাহর কাছে",
    target: 100,
  },
  {
    id: "durood",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    transliteration: "Allahumma Salli Ala Muhammad",
    meaningBn: "হে আল্লাহ! নবীজির উপর রহমত বর্ষণ করুন",
    target: 100,
  },
]

export function DigitalTasbih() {
  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(PRESETS[0])
  const [count, setCount] = useState<number>(0)
  const [laps, setLaps] = useState<number>(0)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [justCompleted, setJustCompleted] = useState<boolean>(false)

  // Initialize and load saved dhikr count from localStorage
  useEffect(() => {
    try {
      const savedTotal = localStorage.getItem("istiqamah_tasbih_total")
      if (savedTotal) setTotalCount(Number(savedTotal))
      setIsMuted(soundEffects.isMuted())
    } catch {}
  }, [])

  const handleIncrement = useCallback(() => {
    // Vibrate haptics
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(18)
      } catch {}
    }

    // Play tactile bead click
    soundEffects.playBeadClick()

    setCount((prev) => {
      const nextCount = prev + 1
      const isTargetReached = nextCount >= selectedPreset.target

      if (isTargetReached) {
        soundEffects.playCycleBell()
        setJustCompleted(true)
        setTimeout(() => setJustCompleted(false), 1200)
        setLaps((l) => l + 1)
        return 0
      }
      return nextCount
    })

    setTotalCount((prev) => {
      const updated = prev + 1
      try {
        localStorage.setItem("istiqamah_tasbih_total", String(updated))
      } catch {}
      return updated
    })
  }, [selectedPreset.target])

  // Spacebar hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        handleIncrement()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleIncrement])

  const handleReset = () => {
    setCount(0)
    setLaps(0)
  }

  const toggleSound = () => {
    const muted = soundEffects.toggleMute()
    setIsMuted(muted)
  }

  const progress = Math.min(100, (count / selectedPreset.target) * 100)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-card/90 via-card/70 to-amber-950/20 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
      {/* Decorative ambient glowing accents */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

      {/* Header bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-lg shadow-amber-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                ইন্টারেক্টিভ ডিজিটাল তাসবীহ
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                হ্যাপটিক সাউন্ড
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight sm:text-xl">স্মরণ ও জিকির — তাসবীহ করতাল</h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? "সাউন্ড অন করুন" : "সাউন্ড মিউট করুন"}
            aria-label="Toggle Sound"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-background/60 text-muted-foreground transition hover:text-foreground cursor-pointer"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-500" />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="রিসেট করুন"
            aria-label="Reset Tasbih"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-background/60 text-muted-foreground transition hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preset pills slider */}
      <div className="my-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PRESETS.map((p) => {
          const isSelected = p.id === selectedPreset.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPreset(p)
                setCount(0)
              }}
              className={`shrink-0 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-400/40"
                  : "border border-white/10 bg-background/50 text-muted-foreground hover:bg-background/80 hover:text-foreground"
              }`}
            >
              {p.transliteration} · <span className="opacity-80">{p.target} বার</span>
            </button>
          )
        })}
      </div>

      {/* Main Tasbih interactive dial */}
      <div className="my-6 flex flex-col items-center justify-center text-center">
        {/* Arabic Calligraphy Banner */}
        <motion.div
          key={selectedPreset.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 max-w-md px-4"
        >
          <div className="font-arabic text-3xl font-black tracking-wide text-amber-700 dark:text-amber-300 sm:text-4xl" dir="rtl">
            {selectedPreset.arabic}
          </div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {selectedPreset.meaningBn}
          </p>
        </motion.div>

        {/* 3D Circular Touch Dial */}
        <div className="relative flex items-center justify-center">
          {/* Outer glowing ring */}
          <div className="absolute h-56 w-56 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/10 blur-xl sm:h-64 sm:w-64" />

          {/* SVG Progress Ring */}
          <div className="relative h-52 w-52 sm:h-60 sm:w-60">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="7"
                className="stroke-foreground/10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="326.7"
                strokeDashoffset={326.7 - (326.7 * progress) / 100}
                className="stroke-amber-500 transition-all duration-200"
              />
            </svg>

            {/* Clickable Touch Pad */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={handleIncrement}
              className="group absolute inset-3 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-card via-card/90 to-amber-950/40 p-4 shadow-inner ring-1 ring-white/20 transition-all hover:ring-amber-500/40 cursor-pointer"
            >
              {justCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-amber-500/20 backdrop-blur-sm"
                >
                  <Award className="h-12 w-12 text-amber-400 animate-bounce" />
                </motion.div>
              )}

              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                চাপুন বা স্পেসবার
              </span>
              <span className="my-1 font-mono text-5xl font-black tabular-nums tracking-tighter text-foreground sm:text-6xl">
                {count}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                লক্ষ্য: {selectedPreset.target}
              </span>
            </motion.button>
          </div>
        </div>

        <p className="mt-4 text-[11px] font-semibold text-muted-foreground">
          টিপস: কীবোর্ডে <kbd className="rounded border border-border/80 bg-muted/60 px-1 font-mono text-[10px]">Space</kbd> চেপে দ্রুত গণনা করতে পারেন
        </p>
      </div>

      {/* Footer stats bar */}
      <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
        <div className="rounded-2xl border border-white/5 bg-background/40 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">চলমান ল্যাপ</p>
          <p className="text-base font-black text-foreground">{laps} বার পূর্ণ</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-background/40 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">সারাদিনের মোট</p>
          <p className="text-base font-black text-amber-600 dark:text-amber-400">{totalCount}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-background/40 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ইস্তিকামাহ বোনাস</p>
          <p className="text-base font-black text-emerald-600 dark:text-emerald-400">+{Math.floor(totalCount / 10)} XP</p>
        </div>
      </div>
    </div>
  )
}
