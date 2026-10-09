"use client"

import { useEffect, useState } from "react"
import { computeSky, type SkyState } from "@/lib/sky"

/**
 * Live sky state for the hero scene — recomputed every 30 s so the sun/moon
 * crawl through the sky while the app stays open.
 *
 * Demo overrides (query params):
 *   /?hour=5:45    render the sky as if it were 05:45 local time
 *   /?hour=19.5    decimal hours also accepted
 *   /?phase=0      অমাবস্যা (new moon)   /?phase=0.5 → পূর্ণিমা (full moon)
 */
export function useSky(): SkyState | null {
  const [sky, setSky] = useState<SkyState | null>(null)

  useEffect(() => {
    const update = () => {
      const params = new URLSearchParams(window.location.search)
      let date = new Date()

      const hour = params.get("hour")
      if (hour) {
        const [hRaw, mRaw] = hour.split(":")
        const h = Math.floor(parseFloat(hRaw))
        const m = mRaw
          ? parseFloat(mRaw)
          : Math.round((parseFloat(hRaw) - h) * 60)
        date = new Date()
        date.setHours(((h % 24) + 24) % 24, ((m || 0) % 60 + 60) % 60, 0, 0)
      }

      const phaseRaw = params.get("phase")
      const phaseOverride =
        phaseRaw !== null && phaseRaw !== "" && !isNaN(parseFloat(phaseRaw))
          ? Math.min(1, Math.max(0, parseFloat(phaseRaw)))
          : undefined

      setSky(computeSky(date, phaseOverride))
    }

    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  return sky
}
