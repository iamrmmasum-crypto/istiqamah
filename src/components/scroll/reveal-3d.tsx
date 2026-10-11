"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type RevealVariant = "rise" | "flipUp" | "swingLeft" | "swingRight" | "drop"

const FROM: Record<RevealVariant, { opacity: number; y: number; x: number; rotateX: number; rotateY: number; z: number }> = {
  rise: { opacity: 0, y: 90, x: 0, rotateX: 16, rotateY: 0, z: -140 },
  flipUp: { opacity: 0, y: 70, x: 0, rotateX: -72, rotateY: 0, z: -90 },
  swingLeft: { opacity: 0, y: 40, x: -70, rotateX: 6, rotateY: 42, z: -120 },
  swingRight: { opacity: 0, y: 40, x: 70, rotateX: 6, rotateY: -42, z: -120 },
  drop: { opacity: 0, y: -70, x: 0, rotateX: -14, rotateY: 0, z: -80 },
}

interface Reveal3DProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  className?: string
  /** inner wrapper gets the transform; outer supplies perspective */
  innerClassName?: string
}

/**
 * Scroll-triggered 3D entrance. Content "arrives" from a rotated plane
 * in perspective, then settles flat. Static under reduced motion.
 */
export function Reveal3D({
  children,
  variant = "rise",
  delay = 0,
  className,
  innerClassName,
}: Reveal3DProps) {
  const reduced = useReducedMotion()
  const from = FROM[variant]

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn("[perspective:1200px]", className)}>
      <motion.div
        initial={{ opacity: from.opacity, y: from.y, x: from.x, rotateX: from.rotateX, rotateY: from.rotateY, z: from.z }}
        whileInView={{ opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, z: 0 }}
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ type: "spring", stiffness: 64, damping: 16, mass: 0.9, delay }}
        style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
        className={innerClassName}
      >
        {children}
      </motion.div>
    </div>
  )
}
