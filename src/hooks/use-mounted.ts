"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Hydration-safe `mounted` flag.
 * Returns `false` during SSR and the hydration render, `true` afterwards.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
