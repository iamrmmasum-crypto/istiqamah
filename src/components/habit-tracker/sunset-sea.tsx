"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import type { SkyState } from "@/lib/sky"

/**
 * Live sunset sea rendered with a WebGL fragment shader.
 *
 * - Sky: warm sunset gradient, sun with glow, drifting fbm clouds, faint stars
 * - Sea: real reflections (the sky mirrored about the horizon and bent by the
 *   wave normals), perspective-compressed waves, sun glitter path, crest foam
 * - Pointer wake: every pointer move injects expanding ring ripples into the
 *   water field, so a wake literally follows the cursor; hovering adds a
 *   gentle bow-wave around the pointer; click/tap makes a splash
 *
 * Falls back to a static CSS sunset if WebGL is unavailable.
 */

const TRAIL_POINTS = 24
const TRAIL_LIFE = 2.6

const VERT_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define TRAIL ${TRAIL_POINTS}
#define LIFE ${TRAIL_LIFE.toFixed(1)}

uniform vec2 uRes;
uniform float uTime;
uniform vec4 uTrail[TRAIL];  // xy = world pos, z = birth time, w = strength
uniform vec3 uPointer;       // xy = world pos, z = active flag
uniform float uHorizon;      // world-space y of the horizon line
uniform float uSunX;         // world-space x of the sun
uniform float uSunY;         // world-space y of the sun (0 = horizon)
uniform float uDay;          // 0 = deep night, 1 = full day
uniform float uWarm;         // twilight warmth band at the horizon
uniform float uRising;       // 1 = morning side (sunrise), 0 = sunset
uniform vec3 uMoon;          // xy = world pos of moon, z = visible
uniform float uMoonF;        // illuminated fraction 0..1
uniform float uMoonWax;      // 1 = waxing (lit side right), 0 = waning
uniform float uLumX;         // brightest body x for the sea light path
uniform float uLumWarm;      // 1 = warm sun path, 0 = silver moon path
uniform float uLumStr;       // path strength

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(11.3, 7.1);
    a *= 0.5;
  }
  return v;
}

// Sky color. sp.y is height above the horizon.
// Palette follows the real sun: night deep-indigo, twilight warm,
// day soft azure with a peach horizon.
vec3 skyColor(vec2 sp) {
  float t = clamp(sp.y / 0.9, 0.0, 1.0);

  vec3 nTop = vec3(0.045, 0.050, 0.120);
  vec3 nMid = vec3(0.120, 0.100, 0.240);
  vec3 nLow = vec3(0.280, 0.150, 0.260);
  vec3 dTop = vec3(0.220, 0.500, 0.840);
  vec3 dMid = vec3(0.560, 0.760, 0.930);
  vec3 dLow = vec3(0.990, 0.840, 0.660);
  vec3 top = mix(nTop, dTop, uDay);
  vec3 mid = mix(nMid, dMid, uDay);
  vec3 low = mix(nLow, dLow, uDay);
  vec3 col = mix(low, mid, smoothstep(0.03, 0.40, t));
  col = mix(col, top, smoothstep(0.36, 0.92, t));

  // twilight warmth hugging the horizon (sunrise pinker, sunset goldener)
  float hw = exp(-t * 2.4) * uWarm;
  vec3 tLow = mix(vec3(1.0, 0.55, 0.26), vec3(1.0, 0.48, 0.42), uRising);
  vec3 tMid = mix(vec3(0.72, 0.28, 0.48), vec3(0.86, 0.36, 0.52), uRising);
  col = mix(col, tLow, hw * 0.85);
  col = mix(col, tMid, exp(-t * 1.2) * uWarm * 0.5);

  // stars, twinkling, fade out in daylight
  vec2 cell = floor(sp * vec2(110.0, 60.0));
  float star = pow(hash(cell), 42.0);
  float tw = 0.55 + 0.45 * sin(uTime * 1.8 + hash(cell + 3.7) * 40.0);
  col += vec3(1.0, 0.95, 0.9) * star * tw * smoothstep(0.30, 0.80, t)
       * (1.0 - uDay) * 1.1;

  // moon: phase-shaded disc + silver glow (fades out in daylight)
  if (uMoon.z > 0.5) {
    vec2 mq = sp - uMoon.xy;
    float md = length(mq);
    float mVis = 1.0 - uDay * 0.9;
    float glow = exp(-md * 4.5) * 0.5 * (0.35 + 0.65 * uMoonF) * mVis;
    col += vec3(0.75, 0.82, 1.0) * glow;
    float R = 0.042;
    vec2 q = mq / R;
    float r2 = dot(q, q);
    if (r2 < 1.0) {
      float wax = uMoonWax > 0.5 ? 1.0 : -1.0;
      float a = 1.0 - 2.0 * uMoonF;
      float lit = step(a, q.x * wax);
      float crater = 0.94 + 0.06 * noise(q * 5.0 + 7.0);
      vec3 bright = vec3(0.93, 0.94, 0.98) * crater;
      // dark side melts into the sky (earthshine look) instead of a hard disc
      vec3 dark = col * 0.72;
      col = mix(col, mix(dark, bright, lit),
                smoothstep(1.0, 0.85, r2) * mVis);
    }
  }

  // sun: real position; sinks below the horizon and disappears
  vec2 sun = vec2(uSunX, uSunY);
  float d = length(sp - sun);
  float fade = smoothstep(-0.045, 0.0, uSunY);
  col += vec3(1.0, 0.70, 0.36)
       * (exp(-d * 6.5) * 0.85 + exp(-d * 24.0) * 0.6)
       * fade * (0.35 + 0.65 * uWarm + 0.35 * uDay);
  float disc = smoothstep(0.052, 0.040, d);
  col = mix(col, mix(vec3(1.0, 0.94, 0.80), vec3(1.0, 0.98, 0.92), uDay),
            disc * fade);

  // warm drifting cloud band near the horizon
  float cl = fbm(vec2(sp.x * 1.6 + uTime * 0.028, sp.y * 3.4 - 0.6));
  float band = smoothstep(0.05, 0.22, sp.y) * smoothstep(0.95, 0.34, sp.y);
  vec3 cloudWarm = mix(vec3(1.0, 0.68, 0.56), vec3(1.0, 0.93, 0.86), uDay);
  col = mix(col, cloudWarm, smoothstep(0.50, 0.78, cl) * band * 0.55);

  // high clouds
  float cl2 = fbm(vec2(sp.x * 0.7 - uTime * 0.018 + 9.2, sp.y * 1.7 + 4.0));
  vec3 cloudHigh = mix(vec3(0.38, 0.24, 0.46), vec3(1.0), uDay);
  col = mix(col, cloudHigh,
    smoothstep(0.60, 0.84, cl2) * smoothstep(0.30, 0.85, sp.y) * 0.42);

  return col;
}

// Perspective-compressed wave field (world units).
// Wind-driven: crests travel with the wind, gust patches of chop race across
// the surface, and elongated streaks scroll along it.
float waveH(vec2 p, float depth, float t) {
  float persp = 1.0 / (depth + 0.30);
  float wy = persp * 1.6;
  float wx = p.x * persp * 2.6;

  // wind gusts: moving patches that roughen/calmer the surface
  float gust = 0.60 + 0.55 * noise(vec2(wx * 0.35 - t * 0.40, wy * 0.8 - t * 0.22));

  float h = 0.038 * sin(wy * 1.7 - t * 1.35 + wx * 0.30);
  h += 0.024 * sin(wy * 3.1 + t * 1.9 + wx * 0.55 + 1.7);
  h += 0.020 * sin(wx * 1.9 - wy * 0.6 - t * 1.7 + 2.4);
  h += 0.011 * sin(wx * 4.3 + wy * 5.3 - t * 2.6 + 4.0);
  h += 0.007 * sin(wx * 9.1 - wy * 9.7 + t * 3.4);

  // chop rides on the swell, modulated by gusts
  h += (noise(vec2(wx * 2.0 - t * 0.85, wy * 2.6 + t * 0.5)) - 0.5) * 0.034 * gust;
  // elongated wind streaks scrolling across
  h += (noise(vec2(wx * 0.7 - t * 1.05, wy * 2.9 + t * 0.35)) - 0.5) * 0.030 * gust;

  return h * smoothstep(0.0, 0.06, depth);
}

// Expanding ring ripples from the pointer trail.
float rippleH(vec2 p, float t) {
  float h = 0.0;
  for (int i = 0; i < TRAIL; i++) {
    vec4 tp = uTrail[i];
    float age = t - tp.z;
    if (tp.w > 0.001 && age > 0.0 && age < LIFE) {
      float d = distance(p, tp.xy);
      float r = 0.10 + age * 0.33;
      h += sin((d - r) * 30.0) * exp(-abs(d - r) * 9.0)
         * exp(-age * 1.9) * tp.w;
    }
  }
  return h * 0.055;
}

// Gentle bow-wave that sits around the pointer while it hovers.
float bowH(vec2 p, float t) {
  if (uPointer.z < 0.5) return 0.0;
  float dpt = uHorizon - p.y;
  if (dpt <= 0.0) return 0.0;
  float d = distance(p, uPointer.xy);
  float fade = smoothstep(0.0, 0.04, d) * exp(-d * 7.0) * smoothstep(0.0, 0.03, dpt);
  return sin(d * 34.0 - t * 7.0) * fade * 0.028;
}

float seaH(vec2 p, float depth, float t) {
  return waveH(p, depth, t) + rippleH(p, t) + bowH(p, t);
}

vec3 seaColor(vec2 p, float depth, float t) {
  float e = 0.014;
  float hC = seaH(p, depth, t);
  float hX = seaH(p + vec2(e, 0.0), depth + e, t);
  float hY = seaH(p + vec2(0.0, e), depth - e, t);
  vec2 g = vec2(hX - hC, hY - hC) / e * 0.20;

  // Real reflection: mirror the sky about the horizon, compressed by the
  // grazing viewing angle, bent by the surface normal.
  float bend = 0.5;
  float mirror = depth * 0.40;
  vec2 rp = vec2(p.x - g.x * bend, mirror - g.y * bend * 0.9);
  vec3 refl = skyColor(vec2(rp.x, uHorizon + rp.y));

  // Water body color: deep navy at night, turquoise by day, teal in between.
  vec3 deep = mix(vec3(0.012, 0.035, 0.065), vec3(0.020, 0.110, 0.160), uDay);
  vec3 far = mix(vec3(0.030, 0.070, 0.120), vec3(0.060, 0.240, 0.300), uDay);
  vec3 base = mix(deep, far, smoothstep(0.35, 0.0, depth));

  // Grazing angle: mirror-like near the horizon, translucent up close.
  float fres = mix(0.08, 0.98, exp(-depth * 5.5));
  vec3 col = mix(base, refl, clamp(fres + g.y * 0.25, 0.0, 1.0));

  // Luminous path: golden under the sun, silver under the moon.
  float pathW = exp(-abs(p.x - uLumX) / (0.05 + depth * 0.55));
  float sparkle = pow(noise(vec2(p.x * 22.0 - t * 1.1, p.y * 22.0 + t * 2.0)), 4.0);
  vec3 lumCol = mix(vec3(0.72, 0.80, 1.0), vec3(1.0, 0.60, 0.26), uLumWarm);
  col += lumCol * pathW * (0.20 + sparkle * 1.5) * uLumStr
       * smoothstep(0.0, 0.05, depth);

  // Foam on crests + glowing wake highlights.
  col += vec3(0.80, 0.88, 0.92) * smoothstep(0.05, 0.10, hC) * 0.12;
  float rH = rippleH(p, t) + bowH(p, t);
  col += vec3(0.72, 0.82, 0.88) * max(rH, 0.0) * 1.35;

  // Horizon haze (warm at twilight, soft white in daylight).
  float hazeStr = max(uWarm, uDay * 0.5);
  col += mix(vec3(1.0, 0.62, 0.34), vec3(1.0, 0.95, 0.90), uDay)
       * exp(-depth * 32.0) * 0.35 * hazeStr;

  return col;
}

void main() {
  // World coords: origin at canvas center, y up, x scaled by aspect.
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;

  vec3 col;
  if (p.y > uHorizon) {
    col = skyColor(vec2(p.x, p.y - uHorizon));
  } else {
    float depth = uHorizon - p.y;
    col = seaColor(p, depth, t);
  }

  // Bright line along the horizon.
  col += vec3(1.0, 0.78, 0.5) * exp(-abs(p.y - uHorizon) * 150.0) * 0.30;

  // Vignette + grain (also dithers banding).
  vec2 q = gl_FragCoord.xy / uRes;
  float vig = 1.0 - 0.30 * pow(distance(q, vec2(0.5, 0.55)) * 1.35, 2.4);
  col *= clamp(vig, 0.0, 1.0);
  col += (hash(gl_FragCoord.xy + fract(t) * 61.7) - 0.5) * 0.022;

  gl_FragColor = vec4(col, 1.0);
}
`

/** Static CSS sunset used while loading and as a no-WebGL fallback. */
const FALLBACK_BG = [
  "radial-gradient(42% 26% at 70% 44%, rgba(255,220,150,0.95) 0%, rgba(255,160,90,0.40) 55%, rgba(255,160,90,0) 75%)",
  "linear-gradient(to bottom, #241a4a 0%, #5d2a63 30%, #c8506a 44%, #ff9a5c 50%, #2e6f7d 54%, #123c52 72%, #071e2c 100%)",
].join(", ")

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("SunsetSea shader error:", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const clampV = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

const sstepJs = (a: number, b: number, x: number) => {
  const t = clampV((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

function SunsetSeaBase({
  className,
  sky,
}: {
  className?: string
  sky: SkyState | null
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const t0Ref = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0, active: 0 })
  const trailRef = useRef(new Float32Array(TRAIL_POINTS * 4))
  const trailIdxRef = useRef(0)
  const lastInjRef = useRef<{ x: number; y: number } | null>(null)
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion() ?? false
  const skyRef = useRef<SkyState | null>(null)
  const aspectRef = useRef(2)

  useEffect(() => {
    skyRef.current = sky
  }, [sky])

  const pushTrail = useCallback((x: number, y: number, t: number, w: number) => {
    const trail = trailRef.current
    const idx = trailIdxRef.current
    trail[idx * 4] = x
    trail[idx * 4 + 1] = y
    trail[idx * 4 + 2] = t
    trail[idx * 4 + 3] = w
    trailIdxRef.current = (idx + 1) % TRAIL_POINTS
  }, [])

  const toWorld = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const h = rect.height || 1
    return {
      x: (e.clientX - rect.left - rect.width / 2) / h,
      y: (h / 2 - (e.clientY - rect.top)) / h,
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || failed) return
    const { x, y } = toWorld(e)
    pointerRef.current = { x, y, active: 1 }

    const last = lastInjRef.current
    if (!last) {
      lastInjRef.current = { x, y }
      return
    }
    const dx = x - last.x
    const dy = y - last.y
    const dist = Math.hypot(dx, dy)
    if (dist < 0.008) return

    const steps = Math.min(10, Math.max(1, Math.round(dist / 0.02)))
    const strength = Math.min(1.05, 0.3 + dist * 18)
    const t = (performance.now() - t0Ref.current) / 1000
    for (let k = 1; k <= steps; k++) {
      pushTrail(last.x + (dx * k) / steps, last.y + (dy * k) / steps, t, strength)
    }
    lastInjRef.current = { x, y }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || failed) return
    const { x, y } = toWorld(e)
    pointerRef.current = { x, y, active: 1 }
    lastInjRef.current = { x, y }
    const t = (performance.now() - t0Ref.current) / 1000
    pushTrail(x, y, t, 1.6)
  }

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || failed) return
    const { x, y } = toWorld(e)
    pointerRef.current = { x, y, active: 1 }
    lastInjRef.current = { x, y }
  }

  const handlePointerLeave = () => {
    pointerRef.current = { ...pointerRef.current, active: 0 }
    lastInjRef.current = null
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    })
    if (!gl) {
      setFailed(true)
      return
    }

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
    const prog = gl.createProgram()
    if (!vert || !frag || !prog) {
      setFailed(true)
      return
    }
    gl.attachShader(prog, vert)
    gl.attachShader(prog, frag)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("SunsetSea link error:", gl.getProgramInfoLog(prog))
      setFailed(true)
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const aPos = gl.getAttribLocation(prog, "aPos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "uRes")
    const uTime = gl.getUniformLocation(prog, "uTime")
    const uTrail = gl.getUniformLocation(prog, "uTrail[0]")
    const uPointer = gl.getUniformLocation(prog, "uPointer")
    const uHorizon = gl.getUniformLocation(prog, "uHorizon")
    const uSunX = gl.getUniformLocation(prog, "uSunX")
    const uSunY = gl.getUniformLocation(prog, "uSunY")
    const uDay = gl.getUniformLocation(prog, "uDay")
    const uWarm = gl.getUniformLocation(prog, "uWarm")
    const uRising = gl.getUniformLocation(prog, "uRising")
    const uMoon = gl.getUniformLocation(prog, "uMoon")
    const uMoonF = gl.getUniformLocation(prog, "uMoonF")
    const uMoonWax = gl.getUniformLocation(prog, "uMoonWax")
    const uLumX = gl.getUniformLocation(prog, "uLumX")
    const uLumWarm = gl.getUniformLocation(prog, "uLumWarm")
    const uLumStr = gl.getUniformLocation(prog, "uLumStr")

    gl.uniform1f(uHorizon, 0)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      const W = Math.round(w * dpr)
      const H = Math.round(h * dpr)
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W
        canvas.height = H
        gl.viewport(0, 0, W, H)
      }
      gl.uniform2f(uRes, W, H)
      aspectRef.current = w / h
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let inView = true
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.02 }
    )
    io.observe(canvas)

    let tabVisible = true
    const onVis = () => {
      tabVisible = !document.hidden
    }
    document.addEventListener("visibilitychange", onVis)

    const draw = (t: number) => {
      // Map the real sky state to scene uniforms; fall back to a classic
      // sunset for the first frames (before the sky hook reports).
      const aspect = aspectRef.current
      const halfW = aspect / 2
      const lim = Math.max(0.05, halfW - 0.25)

      let sunX = 0
      let sunY = 0.1
      let day = 0
      let warm = 1
      let rising = 0
      let moonX = 0
      let moonY = 0.3
      let moonOn = 0
      let moonF = 0.5
      let wax = 1
      let lumX = 0
      let lumWarm = 1
      let lumStr = 0.9

      const s = skyRef.current
      if (s) {
        sunX = clampV(s.sunX * halfW * 0.62, -lim, lim)
        sunY = clampV(s.sunAlt / 70, -0.35, 1.0) * 0.4
        day = s.dayFactor
        warm = s.warm
        rising = s.rising ? 1 : 0
        moonX = clampV(s.moonX * halfW * 0.62, -lim, lim)
        moonY = clampV(s.moonAlt / 70, -0.35, 1.0) * 0.4
        moonOn = s.moonUp ? 1 : 0
        moonF = s.moonIllum
        wax = s.waxing ? 1 : 0

        const sunStr = sstepJs(-6, -1, s.sunAlt) * 0.95
        const moonStr =
          sstepJs(-1, 4, s.moonAlt) *
          (0.35 + 0.65 * s.moonIllum) *
          (1 - s.dayFactor * 0.5)
        if (sunStr >= moonStr) {
          lumX = sunX
          lumWarm = 1
          lumStr = sunStr
        } else {
          lumX = moonX
          lumWarm = 0
          lumStr = moonStr
        }
      }

      gl.uniform1f(uTime, t)
      gl.uniform4fv(uTrail, trailRef.current)
      const p = pointerRef.current
      gl.uniform3f(uPointer, p.x, p.y, p.active)
      gl.uniform1f(uSunX, sunX)
      gl.uniform1f(uSunY, sunY)
      gl.uniform1f(uDay, day)
      gl.uniform1f(uWarm, warm)
      gl.uniform1f(uRising, rising)
      gl.uniform3f(uMoon, moonX, moonY, moonOn)
      gl.uniform1f(uMoonF, moonF)
      gl.uniform1f(uMoonWax, wax)
      gl.uniform1f(uLumX, lumX)
      gl.uniform1f(uLumWarm, lumWarm)
      gl.uniform1f(uLumStr, lumStr)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const t0 = performance.now()
    t0Ref.current = t0
    let raf = 0

    // Reduced motion: keep the sea alive but calm (0.45x), skip wake/tilt.
    const speed = reduced ? 0.45 : 1.0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!tabVisible || !inView) return
      draw(((performance.now() - t0) / 1000) * speed)
    }
    raf = requestAnimationFrame(loop)

    const onContextLost = (e: Event) => {
      e.preventDefault()
      setFailed(true)
    }
    canvas.addEventListener("webglcontextlost", onContextLost)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [reduced])

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ background: FALLBACK_BG }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ background: FALLBACK_BG }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

/**
 * Memoized: the hero re-renders every second (live clock) but the sea only
 * depends on `sky` (30 s cadence) and its own pointer/refs.
 */
export const SunsetSea = memo(SunsetSeaBase)
