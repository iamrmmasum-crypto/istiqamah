"use client"

import { useMemo } from "react"
import { Shield, Trophy, Flame, Zap, Award, Sparkles, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import type { AggregatedStats } from "@/lib/habit-utils"

interface DisciplineRankProps {
  stats: AggregatedStats
}

interface RankTier {
  level: number
  arabic: string
  titleBn: string
  titleEn: string
  minXp: number
  maxXp: number
  color: string
  badgeBg: string
  description: string
}

const RANKS: RankTier[] = [
  {
    level: 1,
    arabic: "طالب",
    titleBn: "তালিব (অনুসন্ধানী)",
    titleEn: "Talib — The Seeker",
    minXp: 0,
    maxXp: 400,
    color: "from-blue-500 to-indigo-500",
    badgeBg: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    description: "নিয়মিত অভ্যাস ও আত্মশুদ্ধির প্রথম ধাপে পদার্পণ।",
  },
  {
    level: 2,
    arabic: "سالك",
    titleBn: "সালিক (পথযাত্রী)",
    titleEn: "Salik — The Traveler",
    minXp: 400,
    maxXp: 1200,
    color: "from-teal-500 to-emerald-500",
    badgeBg: "bg-teal-500/10 text-teal-500 border-teal-500/30",
    description: "দৈনন্দিন শৃঙ্খলায় অটলতা তৈরি হচ্ছে, মোমেন্টাম ক্রমবর্ধমান।",
  },
  {
    level: 3,
    arabic: "صابر",
    titleBn: "সাবির (অটল ধৈর্যশীল)",
    titleEn: "Sabir — The Steadfast",
    minXp: 1200,
    maxXp: 2800,
    color: "from-amber-500 to-orange-500",
    badgeBg: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    description: "প্রলোভন ও অলসতাকে পরাস্ত করে একটানা ধারা বজায় রাখা।",
  },
  {
    level: 4,
    arabic: "قوي",
    titleBn: "ক্বাভিয়্য (অপরাজেয়)",
    titleEn: "Qawiyy — The Resilient",
    minXp: 2800,
    maxXp: 5500,
    color: "from-purple-500 to-pink-500",
    badgeBg: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    description: "লৌহদৃঢ় ইচ্ছাশক্তি — দৈনন্দিন রুটিন এখন স্বভাবের অংশ।",
  },
  {
    level: 5,
    arabic: "متقي",
    titleBn: "মুত্তাকী (ইস্তিকামাহ মাস্টার)",
    titleEn: "Muttaqi — Master of Discipline",
    minXp: 5500,
    maxXp: 10000,
    color: "from-emerald-400 via-amber-400 to-yellow-500",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-400/40",
    description: "পূর্ণাঙ্গ ইস্তিকামাহ ও সর্বোচ্চ আধ্যাত্মিক একাগ্রতা অর্জিত।",
  },
]

export function DisciplineRank({ stats }: DisciplineRankProps) {
  // Calculate dynamic XP
  const xp = useMemo(() => {
    const habitXp = stats.todayDone * 60
    const streakXp = stats.activeStreak * 120
    const consistencyXp = stats.rate * 10
    const bestXp = stats.bestStreak * 80
    return Math.max(120, habitXp + streakXp + consistencyXp + bestXp)
  }, [stats])

  const currentRank = useMemo(() => {
    return (
      RANKS.find((r) => xp >= r.minXp && xp < r.maxXp) ||
      RANKS[RANKS.length - 1]
    )
  }, [xp])

  const nextRank = RANKS.find((r) => r.level === currentRank.level + 1)
  const progressToNext = nextRank
    ? Math.min(100, Math.max(0, ((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100))
    : 100

  const badges = [
    {
      title: "ফজর রক্ষক",
      unlocked: stats.todayDone >= 1,
      icon: Flame,
      desc: "ভোরের ইবাদতে অংশগ্রহণ",
    },
    {
      title: "লৌহ সংকল্প",
      unlocked: stats.activeStreak >= 3,
      icon: Shield,
      desc: "৩+ দিন একটানা ধারা",
    },
    {
      title: "অর্ধেক জয়",
      unlocked: stats.todayDone >= Math.ceil(stats.todayTotal / 2),
      icon: Zap,
      desc: "আজকের ৫০%+ কাজ শেষ",
    },
    {
      title: "শৃঙ্খলা চ্যাম্পিয়ন",
      unlocked: stats.rate >= 50,
      icon: Trophy,
      desc: "৫০%+ ধারাবাহিকতা",
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card/90 via-card/70 to-emerald-950/20 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Current Level Banner */}
        <div className="flex items-start gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white shadow-xl shadow-amber-500/20 sm:h-20 sm:w-20">
            <span className="font-arabic text-2xl font-black sm:text-3xl" dir="rtl">
              {currentRank.arabic}
            </span>
            <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-white/20 text-xs font-black text-amber-500 shadow-md">
              L{currentRank.level}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${currentRank.badgeBg}`}>
                <Sparkles className="h-3 w-3" />
                লেভেল {currentRank.level} র্যাংক
              </span>
              <span className="text-xs font-mono font-bold text-muted-foreground tabular-nums">
                {xp} XP অর্জিত
              </span>
            </div>

            <h3 className="mt-1 text-xl font-black tracking-tight text-foreground sm:text-2xl">
              {currentRank.titleBn}
            </h3>
            <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
              {currentRank.description}
            </p>
          </div>
        </div>

        {/* Right: Progress to next rank */}
        <div className="w-full md:w-72 rounded-2xl border border-white/10 bg-background/40 p-4 backdrop-blur">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-muted-foreground">পরবর্তী র্যাংক</span>
            <span className="text-amber-600 dark:text-amber-400">
              {nextRank ? nextRank.titleBn.split(" ")[0] : "সর্বোচ্চ র্যাংক"}
            </span>
          </div>

          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{Math.round(progressToNext)}% সম্পন্ন</span>
            {nextRank && (
              <span>বাকি: {Math.max(0, nextRank.minXp - xp)} XP</span>
            )}
          </div>
        </div>
      </div>

      {/* Badges strip */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          অর্জিত সম্মাননা ও ব্যাজ
        </span>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {badges.map((b) => {
            const Icon = b.icon
            return (
              <div
                key={b.title}
                className={`flex items-center gap-2.5 rounded-2xl border p-2.5 transition-all ${
                  b.unlocked
                    ? "border-emerald-500/40 bg-emerald-500/10 shadow-sm"
                    : "border-white/5 bg-background/30 opacity-50"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    b.unlocked
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                      : "bg-foreground/5 text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">{b.title}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
