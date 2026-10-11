"use client"

import { useState, useEffect } from "react"
import { BookOpen, Heart, PenLine, Sparkles, Quote, Check } from "lucide-react"
import { motion } from "framer-motion"

interface AyahQuote {
  arabic: string
  translationBn: string
  reference: string
}

const DAILY_AYAH: AyahQuote = {
  arabic: "فَاسْتَقِمْ كَمَا أُمِرْتَ وَمَن تَابَ مَعَكَ وَلَا تَطْغَوْا",
  translationBn: "অতএব আপনি যেভাবে আদিষ্ট হয়েছেন তাতে অটল (ইস্তিকামাহ) থাকুন — এবং আপনার সাথে যারা তওবা করেছে তারাও। আর সীমা লঙ্ঘন করবেন না।",
  reference: "সূরা হূদ (১১:১১২)",
}

export function DailyReflection() {
  const [gratitude1, setGratitude1] = useState("")
  const [gratitude2, setGratitude2] = useState("")
  const [gratitude3, setGratitude3] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const data = localStorage.getItem(`istiqamah_gratitude_${today}`)
      if (data) {
        const parsed = JSON.parse(data)
        setGratitude1(parsed.g1 || "")
        setGratitude2(parsed.g2 || "")
        setGratitude3(parsed.g3 || "")
      }
    } catch {}
  }, [])

  const handleSave = () => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      localStorage.setItem(
        `istiqamah_gratitude_${today}`,
        JSON.stringify({ g1: gratitude1, g2: gratitude2, g3: gratitude3 })
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card/90 via-card/70 to-teal-950/20 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Quranic Ayah of the Day */}
        <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                আজকের অনুপ্রেরণা ও তাদাব্বুর
              </span>
            </div>

            <div className="my-5 text-center">
              <Quote className="mx-auto h-6 w-6 text-emerald-500/40 rotate-180" />
              <p
                className="my-3 font-arabic text-2xl font-black leading-loose text-foreground sm:text-3xl"
                dir="rtl"
              >
                {DAILY_AYAH.arabic}
              </p>
              <p className="text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                "{DAILY_AYAH.translationBn}"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-emerald-500/10 pt-3 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <span>কুরআনুল কারীম</span>
            <span>{DAILY_AYAH.reference}</span>
          </div>
        </div>

        {/* Right Column: Daily Muhasabah (Self-Audit & Gratitude) */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-background/40 p-5">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Heart className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  মুহাসাবাহ ও শুকরিয়া
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">৩টি নেয়ামত</span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              আজকে আল্লাহর দেয়া যে ৩টি বিশেষ নেয়ামতের জন্য আপনি শোকরগোযার:
            </p>

            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="১. সুস্থতা ও জীবনের প্রতিটি নিঃশ্বাস..."
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-card/60 px-3 py-2 text-xs outline-none focus:border-amber-500/60 transition"
              />
              <input
                type="text"
                placeholder="২. পরিবার ও প্রিয়জনদের সান্নিধ্য..."
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-card/60 px-3 py-2 text-xs outline-none focus:border-amber-500/60 transition"
              />
              <input
                type="text"
                placeholder="৩. হালাল রিযিক ও মানসিক শান্তি..."
                value={gratitude3}
                onChange={(e) => setGratitude3(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-card/60 px-3 py-2 text-xs outline-none focus:border-amber-500/60 transition"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[10px] text-muted-foreground">প্রতিদিনের আত্মশুদ্ধি</span>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>সংরক্ষিত!</span>
                </>
              ) : (
                <>
                  <PenLine className="h-3.5 w-3.5" />
                  <span>সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
