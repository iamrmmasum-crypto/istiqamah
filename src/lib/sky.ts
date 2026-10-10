/**
 * Real-sky astronomy for the sunset-sea hero — no external API.
 *
 * Computes, for the current date & time:
 *  - Sun altitude & screen-x (sunrise in the morning, high at noon, sunset in
 *    the evening — rises/sets naturally from the hour-angle math)
 *  - Moon phase from the synodic cycle: 0 = অমাবস্যা (new moon),
 *    0.5 = পূর্ণিমা (full moon), plus illumination % and Bengali label
 *  - Moon altitude & screen-x (full moon rises at sunset, new moon rises at
 *    sunrise, waxing crescent lags the sun, etc.)
 *
 * Positions use a low-precision solar/lunar model — plenty accurate for a
 * decorative sky. Latitude/longitude default to Dhaka; local clock time is
 * assumed to be Bangladesh time (UTC+6, lon 90.41°E → solar noon ≈ 12:01).
 */

export interface SkyState {
  /** degrees above horizon */
  sunAlt: number
  moonAlt: number
  /** -1 (left) .. 1 (right) screen factor from the hour angle */
  sunX: number
  moonX: number
  /** 0 = deep night, 1 = full day */
  dayFactor: number
  /** twilight warmth band (peaks when the sun sits at the horizon) */
  warm: number
  /** true before solar noon (sunrise side) */
  rising: boolean
  /** illuminated fraction 0..1 (0 new, 1 full) */
  moonIllum: number
  /** cycle position 0..1 (0 new, 0.5 full) */
  moonPhase: number
  waxing: boolean
  moonUp: boolean
  sunUp: boolean
  /** Bengali phase label, emoji, English tooltip */
  phaseLabel: string
  phaseEmoji: string
  phaseTitle: string
}

const DEG = Math.PI / 180
/** Dhaka */
const LAT = 23.81
const LON = 90.41
const SYNODIC = 29.530588853

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

function altitudeDeg(decRad: number, hRad: number): number {
  const lat = LAT * DEG
  const s =
    Math.sin(lat) * Math.sin(decRad) +
    Math.cos(lat) * Math.cos(decRad) * Math.cos(hRad)
  return Math.asin(clamp(s, -1, 1)) / DEG
}

function phaseInfo(phase: number): {
  illum: number
  waxing: boolean
  label: string
  emoji: string
  title: string
} {
  const illum = (1 - Math.cos(2 * Math.PI * phase)) / 2
  const waxing = phase < 0.5
  const pct = Math.round(illum * 100)
  if (illum < 0.02)
    return { illum, waxing, label: "অমাবস্যা", emoji: "🌑", title: "New moon" }
  if (illum > 0.98)
    return { illum, waxing, label: "পূর্ণিমা", emoji: "🌕", title: "Full moon" }
  if (waxing) {
    if (illum > 0.92)
      return {
        illum,
        waxing,
        label: "শুক্লপক্ষ",
        emoji: "🌔",
        title: `Waxing gibbous · ${pct}% lit`,
      }
    if (illum > 0.4)
      return {
        illum,
        waxing,
        label: "শুক্লপক্ষ",
        emoji: "🌓",
        title: `First quarter · ${pct}% lit`,
      }
    return {
      illum,
      waxing,
      label: "শুক্লপক্ষ",
      emoji: "🌒",
      title: `Waxing crescent · ${pct}% lit`,
    }
  }
  if (illum > 0.92)
    return {
      illum,
      waxing,
      label: "কৃষ্ণপক্ষ",
      emoji: "🌖",
      title: `Waning gibbous · ${pct}% lit`,
    }
  if (illum > 0.4)
    return {
      illum,
      waxing,
      label: "কৃষ্ণপক্ষ",
      emoji: "🌗",
      title: `Last quarter · ${pct}% lit`,
    }
  return {
    illum,
    waxing,
    label: "কৃষ্ণপক্ষ",
    emoji: "🌘",
    title: `Waning crescent · ${pct}% lit`,
  }
}

/**
 * @param date moment to render
 * @param phaseOverride force moon cycle position 0..1 (demo: 0 = অমাবস্যা,
 *   0.5 = পূর্ণিমা)
 */
export function computeSky(date: Date, phaseOverride?: number): SkyState {
  const jd = date.getTime() / 86400000 + 2440587.5
  const n = jd - 2451545.0

  // --- Sun (low-precision apparent position) ---
  const L = (280.46 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * DEG
  const lam = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * DEG
  const eps = (23.439 - 0.0000004 * n) * DEG
  const sunDec = Math.asin(Math.sin(eps) * Math.sin(lam))
  const sunRa =
    Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam)) / DEG

  const utcH =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  // Greenwich mean sidereal time (deg) → local sidereal → hour angle
  const gmst = (280.46061837 + 360.98564736629 * n) % 360
  const lst = (gmst + LON) % 360
  let hSun = ((lst - sunRa) % 360) * DEG
  if (hSun > Math.PI) hSun -= 2 * Math.PI
  if (hSun < -Math.PI) hSun += 2 * Math.PI

  const sunAlt = altitudeDeg(sunDec, hSun)
  const sunX = Math.sin(hSun)

  // --- Moon ---
  const rawPhase =
    ((jd - 2451550.1) / SYNODIC) % 1
  const phase = phaseOverride ?? (rawPhase < 0 ? rawPhase + 1 : rawPhase)
  const elong = 2 * Math.PI * phase
  const lamMoon = lam + elong
  const moonDec = Math.asin(Math.sin(eps) * Math.sin(lamMoon))
  const moonRa =
    Math.atan2(Math.cos(eps) * Math.sin(lamMoon), Math.cos(lamMoon)) / DEG
  let hMoon = ((lst - moonRa) % 360) * DEG
  if (hMoon > Math.PI) hMoon -= 2 * Math.PI
  if (hMoon < -Math.PI) hMoon += 2 * Math.PI

  const moonAlt = altitudeDeg(moonDec, hMoon)
  const moonX = Math.sin(hMoon)

  const info = phaseInfo(phase)
  const dayFactor = sstep(-6, 8, sunAlt)
  const warm = Math.exp(-(((sunAlt - 1.5) / 7.0) ** 2))

  return {
    sunAlt,
    moonAlt,
    sunX,
    moonX,
    dayFactor,
    warm,
    rising: hSun < 0,
    moonIllum: info.illum,
    moonPhase: phase,
    waxing: info.waxing,
    moonUp: moonAlt > 0,
    sunUp: sunAlt > 0,
    phaseLabel: info.label,
    phaseEmoji: info.emoji,
    phaseTitle: info.title,
  }
}

export interface RiseSet {
  /** decimal local hours (5.9 ≈ 5:54 AM), null = no crossing that day */
  sunrise: number | null
  sunset: number | null
  moonrise: number | null
  moonset: number | null
}

/** Linear zero-crossing between two altitude samples. */
function crossTime(h0: number, a0: number, h1: number, a1: number): number {
  return h0 + (h1 - h0) * (-a0 / (a1 - a0))
}

/**
 * Sunrise/sunset & moonrise/moonset for the calendar day of `date`
 * (Dhaka lat/lon, device-local hours). Scans the sky every 10 minutes and
 * interpolates the horizon crossings — accurate to ~1 minute.
 * At 23.8°N the sun always rises/sets once; the moon can miss a crossing
 * only in the rare day-edge cases, which report null.
 */
export function computeRiseSet(date: Date, phaseOverride?: number): RiseSet {
  const out: RiseSet = {
    sunrise: null,
    sunset: null,
    moonrise: null,
    moonset: null,
  }
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()

  let prevSun: number | null = null
  let prevMoon: number | null = null

  for (let min = 10; min <= 1440; min += 10) {
    const s = computeSky(new Date(y, m, d, 0, min), phaseOverride)
    const h = min / 60
    const h0 = h - 1 / 6

    if (prevSun !== null) {
      if (out.sunrise === null && prevSun < 0 && s.sunAlt >= 0)
        out.sunrise = crossTime(h0, prevSun, h, s.sunAlt)
      if (out.sunset === null && prevSun >= 0 && s.sunAlt < 0)
        out.sunset = crossTime(h0, prevSun, h, s.sunAlt)
    }
    if (prevMoon !== null) {
      if (out.moonrise === null && prevMoon < 0 && s.moonAlt >= 0)
        out.moonrise = crossTime(h0, prevMoon, h, s.moonAlt)
      if (out.moonset === null && prevMoon >= 0 && s.moonAlt < 0)
        out.moonset = crossTime(h0, prevMoon, h, s.moonAlt)
    }
    prevSun = s.sunAlt
    prevMoon = s.moonAlt
  }
  return out
}

/** Decimal local hours → "5:53 AM" (12-hour clock). */
export function formatTime12(hours: number): string {
  const total = Math.round(hours * 60)
  const h24 = Math.floor(total / 60) % 24
  const mm = String(total % 60).padStart(2, "0")
  const ampm = h24 < 12 ? "AM" : "PM"
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${mm} ${ampm}`
}
