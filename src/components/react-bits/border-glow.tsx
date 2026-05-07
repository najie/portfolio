import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

interface BorderGlowProps {
  children?: ReactNode
  className?: string
  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  animated?: boolean
  colors?: string[]
  fillOpacity?: number
  outerRange?: number
  isDarkMode?: boolean
  isMobile?: boolean
}

interface AnimateOpts {
  start?: number
  end?: number
  duration?: number
  delay?: number
  ease?: (t: number) => number
  onUpdate: (v: number) => void
  onEnd?: () => void
}

const SWEEP_ANGLE_START = 110
const SWEEP_ANGLE_END = 465
const SWEEP_FADE_IN_MS = 500
const SWEEP_ROTATE_FIRST_MS = 1500
const SWEEP_ROTATE_SECOND_DELAY_MS = 1500
const SWEEP_ROTATE_SECOND_MS = 2250
const SWEEP_FADE_OUT_DELAY_MS = 2500
const SWEEP_FADE_OUT_MS = 1500
const MOBILE_REPEAT_INTERVAL_MS = 10000
const TRANSITION_SHOW = "opacity 0.25s ease-out"
const TRANSITION_HIDE = "opacity 0.75s ease-in-out"

const GRADIENT_POSITIONS = [
  "80% 55%",
  "20% 34%",
  "8% 6%",
  "50% 50%",
  "86% 85%",
  "18% 18%",
  "51% 4%",
]
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)

  if (!match) return { h: 40, s: 80, l: 80 }

  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  }
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ]

  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100)

      return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`
    })
    .join(", ")
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3)
}

function easeInCubic(x: number) {
  return x * x * x
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: AnimateOpts) {
  const t0 = performance.now() + delay
  let frameId: number | undefined
  let cancelled = false

  function tick() {
    if (cancelled) return

    const elapsed = performance.now() - t0
    const t = Math.min(elapsed / duration, 1)

    onUpdate(start + (end - start) * ease(t))

    if (t < 1) frameId = requestAnimationFrame(tick)
    else onEnd?.()
  }

  const timeoutId = window.setTimeout(() => {
    frameId = requestAnimationFrame(tick)
  }, delay)

  return () => {
    cancelled = true
    window.clearTimeout(timeoutId)

    if (frameId) cancelAnimationFrame(frameId)
  }
}

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = []

  for (let i = 0; i < 7; i += 1) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    gradients.push(
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`
    )
  }

  gradients.push(`linear-gradient(${colors[0]} 0 100%)`)

  return gradients
}

const BorderGlow = ({
  children,
  className,
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0.5,
  outerRange = 100,
  isDarkMode = true,
  isMobile = false,
}: BorderGlowProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const sweepActiveRef = useRef(false)
  const [isNearby, setIsNearby] = useState(false)
  const [cursorAngle, setCursorAngle] = useState(45)
  const [edgeProximity, setEdgeProximity] = useState(0)
  const [sweepActive, setSweepActive] = useState(false)

  const startSweep = () => {
    const angleRange = SWEEP_ANGLE_END - SWEEP_ANGLE_START
    const cancelAnimations: Array<() => void> = []

    sweepActiveRef.current = true
    setSweepActive(true)
    setCursorAngle(SWEEP_ANGLE_START)

    cancelAnimations.push(
      animateValue({
        duration: SWEEP_FADE_IN_MS,
        onUpdate: (v) => setEdgeProximity(v / 100),
      }),
      animateValue({
        ease: easeInCubic,
        duration: SWEEP_ROTATE_FIRST_MS,
        end: 50,
        onUpdate: (v) => {
          setCursorAngle(angleRange * (v / 100) + SWEEP_ANGLE_START)
        },
      }),
      animateValue({
        ease: easeOutCubic,
        delay: SWEEP_ROTATE_SECOND_DELAY_MS,
        duration: SWEEP_ROTATE_SECOND_MS,
        start: 50,
        end: 100,
        onUpdate: (v) => {
          setCursorAngle(angleRange * (v / 100) + SWEEP_ANGLE_START)
        },
      }),
      animateValue({
        ease: easeInCubic,
        delay: SWEEP_FADE_OUT_DELAY_MS,
        duration: SWEEP_FADE_OUT_MS,
        start: 100,
        end: 0,
        onUpdate: (v) => setEdgeProximity(v / 100),
        onEnd: () => {
          sweepActiveRef.current = false
          setSweepActive(false)
        },
      })
    )

    return () => {
      sweepActiveRef.current = false
      cancelAnimations.forEach((cancel) => cancel())
    }
  }

  useEffect(() => {
    if (isMobile) return

    function handlePointerMove(e: globalThis.PointerEvent) {
      if (sweepActiveRef.current) return

      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const { width, height } = rect
      const inside = x >= 0 && x <= width && y >= 0 && y <= height

      let proximity: number
      if (inside) {
        const cx = width / 2
        const cy = height / 2
        const dx = x - cx
        const dy = y - cy
        let kx = Infinity
        let ky = Infinity
        if (dx !== 0) kx = cx / Math.abs(dx)
        if (dy !== 0) ky = cy / Math.abs(dy)
        proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
      } else {
        const nearestX = Math.max(0, Math.min(x, width))
        const nearestY = Math.max(0, Math.min(y, height))
        const dist = Math.sqrt((x - nearestX) ** 2 + (y - nearestY) ** 2)
        proximity = Math.max(0, 1 - dist / outerRange)
      }

      const nearby = inside || proximity > 0
      setIsNearby(nearby)

      if (nearby) {
        setEdgeProximity(proximity)
        const cx = width / 2
        const cy = height / 2
        const dx = x - cx
        const dy = y - cy
        if (dx !== 0 || dy !== 0) {
          const radians = Math.atan2(dy, dx)
          const degrees = radians * (180 / Math.PI) + 90
          setCursorAngle(degrees < 0 ? degrees + 360 : degrees)
        }
      } else {
        setEdgeProximity(0)
      }
    }

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    })
    return () => document.removeEventListener("pointermove", handlePointerMove)
  }, [outerRange, isMobile])

  useEffect(() => {
    if (!animated || isMobile) return

    let cancelSweep: (() => void) | undefined
    const frameId = requestAnimationFrame(() => {
      cancelSweep = startSweep()
    })

    return () => {
      cancelAnimationFrame(frameId)
      cancelSweep?.()
    }
  }, [animated, isMobile])

  useEffect(() => {
    if (!isMobile) return

    let cancelSweep: (() => void) | undefined
    const frameId = requestAnimationFrame(() => {
      cancelSweep = startSweep()
    })

    const intervalId = setInterval(() => {
      cancelSweep?.()
      cancelSweep = startSweep()
    }, MOBILE_REPEAT_INTERVAL_MS)

    return () => {
      cancelAnimationFrame(frameId)
      cancelSweep?.()
      clearInterval(intervalId)
    }
  }, [isMobile])

  const colorSensitivity = edgeSensitivity + 20
  const isVisible = isNearby || sweepActive
  const borderOpacity = isVisible
    ? Math.max(
        0,
        (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity)
      )
    : 0
  const glowOpacity = isVisible
    ? Math.max(
        0,
        (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity)
      )
    : 0

  const meshGradients = buildMeshGradients(colors)
  const borderBg = meshGradients.map((g) => `${g} border-box`)
  const fillBg = meshGradients.map((g) => `${g} padding-box`)
  const angleDeg = `${cursorAngle.toFixed(3)}deg`
  const visibleTransition = isVisible ? TRANSITION_SHOW : TRANSITION_HIDE
  const coneMask = `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`
  const edgeFillMask = [
    "linear-gradient(to bottom, black, black)",
    "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
    "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
    "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
    "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
    "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
    `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
  ].join(", ")

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative isolate grid border border-white/15 shadow-md",
        className
      )}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: "translate3d(0, 0, 0.01px)",
      }}
    >
      <div
        className="absolute inset-0 -z-1 rounded-[inherit]"
        style={{
          border: "1px solid transparent",
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
            ...borderBg,
          ].join(", "),
          opacity: borderOpacity,
          maskImage: coneMask,
          WebkitMaskImage: coneMask,
          transition: visibleTransition,
        }}
      />

      <div
        className="absolute inset-0 -z-1 rounded-[inherit]"
        style={
          {
            border: "1px solid transparent",
            background: fillBg.join(", "),
            maskImage: edgeFillMask,
            WebkitMaskImage: edgeFillMask,
            maskComposite: "subtract, add, add, add, add, add",
            WebkitMaskComposite:
              "source-out, source-over, source-over, source-over, source-over, source-over",
            opacity: borderOpacity * fillOpacity,
            mixBlendMode: isDarkMode ? "soft-light" : "normal",
            transition: visibleTransition,
          } as CSSProperties
        }
      />

      <span
        className="pointer-events-none absolute z-1 rounded-[inherit]"
        style={
          {
            inset: `${-glowRadius}px`,
            maskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
            WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
            opacity: glowOpacity,
            mixBlendMode: "plus-lighter",
            transition: visibleTransition,
          } as CSSProperties
        }
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="relative z-1 flex flex-col overflow-auto">{children}</div>
    </div>
  )
}

export { BorderGlow }
