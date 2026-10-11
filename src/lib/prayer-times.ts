// Precision astronomical Islamic prayer times calculator
// Implements standard solar position equations with high accuracy.

export interface Coordinates {
  latitude: number
  longitude: number
  timezoneOffset?: number // hours from UTC, e.g. +6 for Dhaka
}

export interface CityLocation {
  id: string
  name: string
  nameBn: string
  coords: Coordinates
  country: string
}

export const POPULAR_CITIES: CityLocation[] = [
  { id: "dhaka", name: "Dhaka", nameBn: "ঢাকা", coords: { latitude: 23.8103, longitude: 90.4125, timezoneOffset: 6 }, country: "Bangladesh" },
  { id: "chittagong", name: "Chattogram", nameBn: "চট্টগ্রাম", coords: { latitude: 22.3569, longitude: 91.7832, timezoneOffset: 6 }, country: "Bangladesh" },
  { id: "sylhet", name: "Sylhet", nameBn: "সিলেট", coords: { latitude: 24.8949, longitude: 91.8687, timezoneOffset: 6 }, country: "Bangladesh" },
  { id: "mecca", name: "Makkah", nameBn: "মক্কা মোকাররমা", coords: { latitude: 21.3891, longitude: 39.8579, timezoneOffset: 3 }, country: "Saudi Arabia" },
  { id: "medina", name: "Madinah", nameBn: "মদিনা মনোয়ারা", coords: { latitude: 24.5247, longitude: 39.5692, timezoneOffset: 3 }, country: "Saudi Arabia" },
  { id: "london", name: "London", nameBn: "লন্ডন", coords: { latitude: 51.5074, longitude: -0.1278, timezoneOffset: 0 }, country: "UK" },
  { id: "newyork", name: "New York", nameBn: "নিউ ইয়র্ক", coords: { latitude: 40.7128, longitude: -74.006, timezoneOffset: -4 }, country: "USA" },
  { id: "dubai", name: "Dubai", nameBn: "দুবাই", coords: { latitude: 25.2048, longitude: 55.2708, timezoneOffset: 4 }, country: "UAE" },
  { id: "kualalumpur", name: "Kuala Lumpur", nameBn: "কুয়ালালামপুর", coords: { latitude: 3.139, longitude: 101.6869, timezoneOffset: 8 }, country: "Malaysia" },
]

export interface PrayerTimeResult {
  fajr: Date
  sunrise: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date
  tahajjudEnd: Date
  midnight: Date
  nextPrayer: {
    key: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
    name: string
    nameBn: string
    time: Date
    remainingMinutes: number
    remainingFormatted: string
  }
}

// Math helpers
const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

/** Calculate prayer times for a given date and location */
export function calculatePrayerTimes(
  date: Date = new Date(),
  coords: Coordinates = POPULAR_CITIES[0].coords
): PrayerTimeResult {
  const { latitude, longitude } = coords

  // Julian date calculation
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()

  const a = Math.floor((14 - m) / 12)
  const yr = y + 4800 - a
  const mo = m + 12 * a - 3
  const julian =
    d +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045

  const julianCentury = (julian - 2451545.0) / 36525.0

  // Solar position parameters
  const geomMeanLongSun = (280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032)) % 360
  const geomMeanAnomSun = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury)
  const eccentEarthOrbit = 0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury)

  const sunEqOfCtr =
    Math.sin(rad(geomMeanAnomSun)) * (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) +
    Math.sin(rad(2 * geomMeanAnomSun)) * (0.019993 - 0.000101 * julianCentury) +
    Math.sin(rad(3 * geomMeanAnomSun)) * 0.000289

  const sunTrueLong = geomMeanLongSun + sunEqOfCtr
  const sunAppLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(rad(125.04 - 1934.136 * julianCentury))
  const meanObliqEcliptic =
    23 +
    (26 + (21.448 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813))) / 60) / 60
  const obliqCorr = meanObliqEcliptic + 0.00256 * Math.cos(rad(125.04 - 1934.136 * julianCentury))

  // Solar declination & Equation of time
  const sunDeclin = deg(Math.asin(Math.sin(rad(obliqCorr)) * Math.sin(rad(sunAppLong))))
  const varY = Math.tan(rad(obliqCorr / 2)) * Math.tan(rad(obliqCorr / 2))
  const eqOfTime =
    4 *
    deg(
      varY * Math.sin(2 * rad(geomMeanLongSun)) -
        2 * eccentEarthOrbit * Math.sin(rad(geomMeanAnomSun)) +
        4 * eccentEarthOrbit * varY * Math.sin(rad(geomMeanAnomSun)) * Math.cos(2 * rad(geomMeanLongSun)) -
        0.5 * varY * varY * Math.sin(4 * rad(geomMeanLongSun)) -
        1.25 * eccentEarthOrbit * eccentEarthOrbit * Math.sin(2 * rad(geomMeanAnomSun))
    )

  // Solar noon in minutes from midnight local time
  const timezoneOffsetMinutes = -date.getTimezoneOffset()
  const solarNoonMinutes = 720 - 4 * longitude - eqOfTime + timezoneOffsetMinutes

  const timeForHourAngle = (angle: number): number => {
    const latRad = rad(latitude)
    const decRad = rad(sunDeclin)
    const cosH = (Math.sin(rad(-angle)) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad))
    if (cosH > 1) return 0
    if (cosH < -1) return 180
    return deg(Math.acos(cosH))
  }

  // Prayer angles
  const fajrAngle = 18.0
  const ishaAngle = 18.0
  const sunriseAngle = 0.833

  const sunriseDiff = 4 * timeForHourAngle(sunriseAngle)
  const fajrDiff = 4 * timeForHourAngle(fajrAngle)
  const ishaDiff = 4 * timeForHourAngle(ishaAngle)

  // Asr calculation (Shafi/Standard shadow angle)
  const asrAlt = deg(Math.atan(1 + Math.tan(rad(Math.abs(latitude - sunDeclin)))))
  const asrDiff =
    4 *
    deg(
      Math.acos(
        (Math.sin(rad(90 - asrAlt)) - Math.sin(rad(latitude)) * Math.sin(rad(sunDeclin))) /
          (Math.cos(rad(latitude)) * Math.cos(rad(sunDeclin)))
      )
    )

  const toDate = (minutesFromMidnight: number): Date => {
    const res = new Date(date)
    const totalMinutes = Math.round(minutesFromMidnight)
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    res.setHours(hours, mins, 0, 0)
    return res
  }

  const fajr = toDate(solarNoonMinutes - fajrDiff)
  const sunrise = toDate(solarNoonMinutes - sunriseDiff)
  const dhuhr = toDate(solarNoonMinutes)
  const asr = toDate(solarNoonMinutes + asrDiff)
  const maghrib = toDate(solarNoonMinutes + sunriseDiff)
  const isha = toDate(solarNoonMinutes + ishaDiff)

  // Islamic midnight & Tahajjud
  const midnightMinutes = (solarNoonMinutes + 720) % 1440
  const midnight = toDate(midnightMinutes)
  const tahajjudEnd = new Date(fajr.getTime() - 15 * 60 * 1000)

  // Calculate Next Prayer
  const now = date.getTime()
  const prayers: Array<{
    key: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
    name: string
    nameBn: string
    time: Date
  }> = [
    { key: "fajr", name: "Fajr", nameBn: "ফজর", time: fajr },
    { key: "dhuhr", name: "Dhuhr", nameBn: "জোহর", time: dhuhr },
    { key: "asr", name: "Asr", nameBn: "আসর", time: asr },
    { key: "maghrib", name: "Maghrib", nameBn: "মাগরিব", time: maghrib },
    { key: "isha", name: "Isha", nameBn: "এশা", time: isha },
  ]

  let next = prayers.find((p) => p.time.getTime() > now)

  if (!next) {
    // Tomorrow's Fajr
    const tomorrowFajr = new Date(fajr)
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1)
    next = { key: "fajr", name: "Fajr", nameBn: "ফজর", time: tomorrowFajr }
  }

  const diffMs = Math.max(0, next.time.getTime() - now)
  const totalMins = Math.floor(diffMs / (1000 * 60))
  const hrs = Math.floor(totalMins / 60)
  const mins = totalMins % 60

  const remainingFormatted = hrs > 0 ? `${hrs} ঘণ্টা ${mins} মিনিট` : `${mins} মিনিট`

  return {
    fajr,
    sunrise,
    dhuhr,
    asr,
    maghrib,
    isha,
    tahajjudEnd,
    midnight,
    nextPrayer: {
      ...next,
      remainingMinutes: totalMins,
      remainingFormatted,
    },
  }
}

/** Format Date to 12-hour time string with Bengali numbers e.g. "০৫:১৪ AM" */
export function formatPrayerTime(d: Date, lang: "bn" | "en" = "bn"): string {
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  const strHours = String(hours).padStart(2, "0")

  const raw = `${strHours}:${minutes} ${ampm}`
  if (lang === "en") return raw

  const bnDigits: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  }
  return raw.replace(/\d/g, (match) => bnDigits[match] || match)
}
