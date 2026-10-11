"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  kicker: string
  title: string
  description?: string
  align?: "left" | "center"
  id?: string
}

/** Bengali-first section heading with a glow chip, gradient title and reveal. */
export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  id,
}: SectionHeadingProps) {
  const reduced = useReducedMotion()

  return (
    <div className={cn("mb-5 flex flex-col gap-1.5 sm:mb-7", align === "center" && "items-center text-center")}>
      <motion.span
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-400/25 dark:text-amber-300"
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
        {kicker}
      </motion.span>
      <motion.h2
        id={id}
        initial={reduced ? undefined : { opacity: 0, y: 22, rotateX: 12 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        style={reduced ? undefined : { transformPerspective: 800 }}
        className="text-2xl font-black tracking-tight sm:text-3xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="max-w-xl text-sm text-muted-foreground sm:text-[15px]"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
