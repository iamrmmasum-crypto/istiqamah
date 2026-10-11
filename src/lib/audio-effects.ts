// Web Audio API procedural sound synthesizer
// Requires zero external audio files — 100% reliable, zero latency, offline-ready

class SoundSynthesizer {
  private ctx: AudioContext | null = null
  private muted: boolean = false

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("istiqamah_sound_muted")
      this.muted = stored === "true"
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public isMuted(): boolean {
    return this.muted
  }

  public toggleMute(): boolean {
    this.muted = !this.muted
    if (typeof window !== "undefined") {
      localStorage.setItem("istiqamah_sound_muted", String(this.muted))
    }
    return this.muted
  }

  /** Satisfying wooden tactile click for Tasbih beads */
  public playBeadClick(): void {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      // Wooden resonance click
      osc.type = "sine"
      osc.frequency.setValueAtTime(580, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.045)

      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.05)
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  /** Gentle crystal singing bell when completing 33/99/100 Tasbih cycle */
  public playCycleBell(): void {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const freqs = [528, 792, 1056] // Solfeggio / harmonic triad

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, now)

        const startVol = 0.15 / (idx + 1)
        gain.gain.setValueAtTime(startVol, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 1.25)
      })
    } catch {}
  }

  /** Uplifting chime when completing a habit */
  public playHabitDone(): void {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const notes = [440, 554.37, 659.25] // A major triad

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "triangle"
        osc.frequency.setValueAtTime(freq, now + i * 0.06)

        gain.gain.setValueAtTime(0, now + i * 0.06)
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.06 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + i * 0.06)
        osc.stop(now + i * 0.06 + 0.36)
      })
    } catch {}
  }
}

export const soundEffects = new SoundSynthesizer()
