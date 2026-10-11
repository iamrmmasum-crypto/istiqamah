import type { CSSProperties } from "react"

/**
 * Rotating 3D treatments for habit cards.
 * Each habit gets one of four styles (by list index), tinted with the
 * habit's own color so the variety still feels like one system.
 */

export type Habit3DVariant = "emboss" | "slab" | "stack" | "plaque"

export interface Habit3D {
  variant: Habit3DVariant
  /** extra classes for the card surface */
  cardClass: string
  /** inline style for the card surface (shadow / border color) */
  cardStyle: CSSProperties
  /** puffy shadow for the icon tile */
  iconStyle: CSSProperties
  /** raised (not-done) toggle button shadow */
  buttonUpStyle: CSSProperties
  /** pressed-in (done) toggle button shadow */
  buttonDownStyle: CSSProperties
  /** show a glass sheen strip across the top of the card */
  sheen: boolean
}

const BUTTON_UP: CSSProperties = {
  boxShadow:
    "0 3px 0 rgba(0,0,0,0.16), 0 7px 14px -4px rgba(0,0,0,0.3), inset 0 1.5px 0 rgba(255,255,255,0.4)",
}

const BUTTON_DOWN: CSSProperties = {
  boxShadow:
    "inset 0 2px 5px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.18)",
}

export function habit3D(index: number, hex: string): Habit3D {
  switch (index % 4) {
    // ── Soft neumorphic emboss ────────────────────────────────────────────
    case 0:
      return {
        variant: "emboss",
        cardClass: "rounded-2xl",
        cardStyle: {
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.28), 0 12px 24px -14px rgba(0,0,0,0.4)",
        },
        iconStyle: {
          boxShadow: `0 4px 9px -2px ${hex}59, inset 0 1.5px 0 rgba(255,255,255,0.45)`,
        },
        buttonUpStyle: BUTTON_UP,
        buttonDownStyle: BUTTON_DOWN,
        sheen: false,
      }

    // ── Chunky slab with extruded bottom edge ─────────────────────────────
    case 1:
      return {
        variant: "slab",
        cardClass: "rounded-2xl border-b-4",
        cardStyle: {
          borderBottomColor: `${hex}80`,
          boxShadow: `0 8px 18px -10px ${hex}66`,
        },
        iconStyle: {
          boxShadow: `0 3px 0 0 ${hex}59, inset 0 1px 0 rgba(255,255,255,0.4)`,
        },
        buttonUpStyle: BUTTON_UP,
        buttonDownStyle: BUTTON_DOWN,
        sheen: true,
      }

    // ── Layered stack (offset panels behind, rendered by the caller) ──────
    case 2:
      return {
        variant: "stack",
        cardClass: "rounded-2xl border",
        cardStyle: {
          borderColor: `${hex}33`,
          boxShadow: `0 10px 20px -12px ${hex}4d`,
        },
        iconStyle: {
          boxShadow: `0 4px 9px -2px ${hex}59, inset 0 1.5px 0 rgba(255,255,255,0.45)`,
        },
        buttonUpStyle: BUTTON_UP,
        buttonDownStyle: BUTTON_DOWN,
        sheen: false,
      }

    // ── Colored plaque (inner bevel ring + glow) ──────────────────────────
    default:
      return {
        variant: "plaque",
        cardClass: "rounded-2xl",
        cardStyle: {
          boxShadow: `inset 0 0 0 1.5px ${hex}66, 0 12px 24px -12px ${hex}59`,
        },
        iconStyle: {
          boxShadow: `0 4px 10px -2px ${hex}73, inset 0 1.5px 0 rgba(255,255,255,0.55)`,
        },
        buttonUpStyle: BUTTON_UP,
        buttonDownStyle: BUTTON_DOWN,
        sheen: true,
      }
  }
}

/** Two offset panels rendered behind a "stack"-variant card. */
export function stackLayerStyles(hex: string): CSSProperties[] {
  return [
    { backgroundColor: `${hex}1a` },
    { backgroundColor: `${hex}2e` },
  ]
}
