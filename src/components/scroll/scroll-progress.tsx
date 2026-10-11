"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { useScrollToSection } from "@/components/scroll/smooth-scroll"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "hero", label: "নেভিগেট: হিরো", en: "Overview" },
  { id: "stats", label: "নেভিগেট: পরিসংখ্যান", en: "Stats" },
  { id: "today", label: "নেভিগেট: আজকের চেকলিস্ট", en: "Today" },
  { id: "habits", label: "নেভিগেট: সব অভ্যাস", en: "Habits" },
  { id: "insights", label: "নেভিগেট: ইনসাইট", en: "Insights" },
]

/** Thin gradient progress bar on top + a clickable section rail on the right. */
export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })
  const scrollTo = useScrollToSection()
  const [active, setActive] = useState("hero")

  useEffect(() => {
    if (reduced) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [reduced])

  if (reduced) return null

  return (
    <>
      {/* top edge — gradient fill */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400 shadow-[0_0_12px_rgba(251,146,60,0.55)]"
      />

      {/* right rail — desktop only */}
      <nav
        aria-label="Section navigation"
        className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      >
        <motion.span
          style={{ scaleY: scaleX }}
          className="absolute right-[7px] top-0 h-full w-[2px] origin-top rounded-full bg-gradient-to-b from-amber-400 via-rose-400 to-violet-400"
        />
        <span aria-hidden="true" className="absolute right-[7px] top-0 h-full w-[2px] rounded-full bg-foreground/10" />
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            title={s.en}
            aria-label={s.label}
            aria-current={active === s.id ? "true" : undefined}
            className="group relative flex h-4 w-4 items-center justify-center"
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full border border-foreground/25 bg-background transition-all duration-300",
                active === s.id &&
                  "h-3 w-3 border-transparent bg-gradient-to-br from-amber-400 to-rose-400 shadow-[0_0_10px_rgba(251,146,60,0.7)]"
              )}
            />
          </button>
        ))}
      </nav>
    </>
  )
}
