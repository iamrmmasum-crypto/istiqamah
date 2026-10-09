"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

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
vec3 skyColor(vec2 sp) {
  float t = clamp(sp.y / 0.9, 0.0, 1.0);

  vec3 low = vec3(1.00, 0.55, 0.26);
  vec3 mid = vec3(0.72, 0.28, 0.48);
  vec3 top = vec3(0.12, 0.10, 0.27);
  vec3 col = mix(low, mid, smoothstep(0.03, 0.40, t));
  col = mix(col, top, smoothstep(0.36, 0.92, t));

  // faint early stars, twinkling
  vec2 cell = floor(sp * vec2(110.0, 60.0));
  float star = pow(hash(cell), 42.0);
  float tw = 0.55 + 0.45 * sin(uTime * 1.8 + hash(cell + 3.7) * 40.0);
  col += vec3(1.0, 0.95, 0.9) * star * tw * smoothstep(0.48, 0.85, t) * 0.9;

  // sun + glow
  vec2 sun = vec2(uSunX, 0.10);
  float d = length(sp - sun);
  col += vec3(1.0, 0.70, 0.36) * (exp(-d * 6.5) * 0.85 + exp(-d * 24.0) * 0.6);
  float disc = smoothstep(0.052, 0.040, d);
  col = mix(col, vec3(1.0, 0.94, 0.80), disc * 0.96);

  // warm drifting cloud band near the horizon
  float cl = fbm(vec2(sp.x * 1.6 + uTime * 0.015, sp.y * 3.4 - 0.6));
  float band = smoothstep(0.05, 0.22, sp.y) * smoothstep(0.95, 0.34, sp.y);
  col = mix(col, vec3(1.0, 0.68, 0.56), smoothstep(0.50, 0.78, cl) * band * 0.55);

  // violet high clouds
  float cl2 = fbm(vec2(sp.x * 0.7 - uTime * 0.010 + 9.2, sp.y * 1.7 + 4.0));
  col = mix(col, vec3(0.38, 0.24, 0.46),
    smoothstep(0.60, 0.84, cl2) * smoothstep(0.30, 0.85, sp.y) * 0.42);

  return col;
}

// Perspective-compressed wave field (world units).
// Swell crests run mostly horizontal (moving toward the viewer),
// with fine chop crossing them.
float waveH(vec2 p, float depth, float t) {
  float persp = 1.0 / (depth + 0.30);
  float wy = persp * 1.6;
  float wx = p.x * persp * 2.6;
  float h = 0.040 * sin(wy * 1.7 - t * 1.25 + wx * 0.30);
  h += 0.026 * sin(wy * 3.1 + t * 1.7 + wx * 0.55 + 1.7);
  h += 0.014 * sin(wx * 4.3 + wy * 5.3 - t * 2.2 + 4.0);
  h += 0.008 * sin(wx * 9.1 - wy * 9.7 + t * 3.1);
  h += (noise(vec2(wx * 2.0, wy * 2.6 + t * 0.25)) - 0.5) * 0.03;
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

  // Water body color (deep teal, hazier towards the horizon).
  vec3 deep = vec3(0.020, 0.070, 0.120);
  vec3 far = vec3(0.05, 0.14, 0.20);
  vec3 base = mix(deep, far, smoothstep(0.35, 0.0, depth));

  // Grazing angle: mirror-like near the horizon, translucent up close.
  float fres = mix(0.08, 0.98, exp(-depth * 5.5));
  vec3 col = mix(base, refl, clamp(fres + g.y * 0.25, 0.0, 1.0));

  // Sun glitter path.
  float sunPath = exp(-abs(p.x - uSunX) / (0.05 + depth * 0.55));
  float sparkle = pow(noise(vec2(p.x * 24.0, p.y * 24.0 + t * 1.4)), 4.0);
  col += vec3(1.0, 0.60, 0.26) * sunPath * (0.20 + sparkle * 1.5)
       * smoothstep(0.0, 0.05, depth);

  // Foam on crests + glowing wake highlights.
  col += vec3(0.80, 0.88, 0.92) * smoothstep(0.05, 0.10, hC) * 0.12;
  float rH = rippleH(p, t) + bowH(p, t);
  col += vec3(0.72, 0.82, 0.88) * max(rH, 0.0) * 1.35;

  // Horizon haze.
  col += vec3(1.0, 0.62, 0.34) * exp(-depth * 32.0) * 0.35;

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

export function SunsetSea({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const t0Ref = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0, active: 0 })
  const trailRef = useRef(new Float32Array(TRAIL_POINTS * 4))
  const trailIdxRef = useRef(0)
  const lastInjRef = useRef<{ x: number; y: number } | null>(null)
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion() ?? false

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
      // Keep the sun on-screen across aspect ratios.
      const sunX = 0.3 * (w / h)
      gl.uniform1f(uSunX, Math.max(-1.2, Math.min(1.2, sunX)))
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
      gl.uniform1f(uTime, t)
      gl.uniform4fv(uTrail, trailRef.current)
      const p = pointerRef.current
      gl.uniform3f(uPointer, p.x, p.y, p.active)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const t0 = performance.now()
    t0Ref.current = t0
    let raf = 0

    if (reduced) {
      // Static but fully rendered frame.
      draw(6.0)
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop)
        if (!tabVisible || !inView) return
        draw((performance.now() - t0) / 1000)
      }
      raf = requestAnimationFrame(loop)
    }

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
