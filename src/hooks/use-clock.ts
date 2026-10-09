"use client"

import { useSyncExternalStore } from "react"

/**
 * Live wall clock — ticks every second.
 *
 * Built on useSyncExternalStore so it is hydration-safe (server + first
 * client render use the null placeholder) and free of setState-in-effect.
 * The snapshot is quantized to whole seconds so React sees a stable value
 * within a single render pass.
 */
const SECOND = 1000

function subscribe(onChange: () => void): () => void {
  const id = setInterval(onChange, SECOND)
  return () => clearInterval(id)
}

function getSnapshot(): number {
  return Math.floor(Date.now() / SECOND)
}

function getServerSnapshot(): number {
  return 0 // never a real timestamp → renders the placeholder on the server
}

export function useClock(): Date | null {
  const secs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return secs === 0 ? null : new Date(secs * SECOND)
}
