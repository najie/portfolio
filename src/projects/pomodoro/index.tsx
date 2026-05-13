/**
 * PomodoroApp
 *
 * A drag-to-set Pomodoro timer with a curved-arc lever UI.
 *
 * Features:
 * - Lever sits at the top-center (pivot point above the arc area).
 * - Drag the lever downward to set the timer; further down = longer duration.
 * - Left/right dragging is free; upward dragging has very high rubber tension
 *   to communicate that the lever shouldn't go back up once pulled.
 * - Small curved arcs visualize available notch values; notch dots sit at the
 *   bottom of each curve.
 * - Releasing the lever starts the countdown.
 *
 * Architecture notes:
 * - TIMERS_NOTCHES drives both arc sizes and snap targets.
 * - Timer value is mapped from the lever's downward Y displacement only.
 * - Asymmetric tension: RUBBER_STRENGTH_DOWN for downward/sideways,
 *   RUBBER_STRENGTH_UP for upward (much stronger resistance).
 */
import { Button } from "@/components/ui/button"
import { useCallback, useRef, useState } from "react"

const TIMERS_NOTCHES = [5, 15, 30, 60]
const LEVER_SIZE_MAX = 30
const LEVER_SIZE_MIN = 18
const ORBIT_PADDING_MIN = 44
const ORBIT_PADDING_MAX = 268
const SNAP_DISTANCE = 7
const CABLE_WIDTH_MAX = 3
const CABLE_WIDTH_MIN = 0.6
const RUBBER_STRENGTH_DOWN = 0.15
const RUBBER_STRENGTH_UP = 6.0

const getOrbitPadding = (value: number) => {
  const t =
    (value - TIMERS_NOTCHES[0]) /
    (TIMERS_NOTCHES[TIMERS_NOTCHES.length - 1] - TIMERS_NOTCHES[0])
  return ORBIT_PADDING_MIN + t * (ORBIT_PADDING_MAX - ORBIT_PADDING_MIN)
}
const getOrbitSize = (value: number) =>
  Math.round(LEVER_SIZE_MAX + 2 * getOrbitPadding(value))

const CONTAINER_WIDTH = getOrbitSize(TIMERS_NOTCHES[TIMERS_NOTCHES.length - 1])
const CONTAINER_HEIGHT = Math.round(CONTAINER_WIDTH / 2) + 20
const ORBIT_RADII = TIMERS_NOTCHES.map((notch) => (getOrbitSize(notch) - 1) / 2)

const MAX_ORBIT_RADIUS = ORBIT_RADII[ORBIT_RADII.length - 1]

// Anchor point where the lever arm attaches — top-center of the arc area
const PIVOT_X = CONTAINER_WIDTH / 2
const PIVOT_Y = 0

const PomodoroApp = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [distance, setDistance] = useState({ x: 0, y: 0 })
  const [tension, setTension] = useState(0)
  const dragRef = useRef<{
    startMouse: { x: number; y: number }
    startDistance: { x: number; y: number }
  } | null>(null)
  const secondsIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const resetTimer = () => {
    setTimer(0)
    setSeconds(0)
    setIsRunning(false)
    setDistance({ x: 0, y: 0 })
    setTension(0)
    if (secondsIntervalRef.current) {
      clearInterval(secondsIntervalRef.current)
    }
  }

  const startTimer = useCallback(() => {
    resetTimer()

    // Init timer with start value
    setTimer(timer)
    setIsRunning(true)

    secondsIntervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 0) {
          setTimer((t) => t - 1)
          return 59
        }
        return s - 1
      })
    }, 1000)
  }, [timer])

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
    dragRef.current = {
      startMouse: { x: event.clientX, y: event.clientY },
      startDistance: { ...distance },
    }
  }

  const handleMouseUp = () => {
    if (!dragRef.current) return
    setIsDragging(false)
    dragRef.current = null

    setDistance({ x: 0, y: 0 })
    setTension(0)
    if (timer > 0) {
      startTimer()
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current) return

    const rawDx = event.clientX - dragRef.current.startMouse.x
    const rawDy = event.clientY - dragRef.current.startMouse.y

    // Apply rubber band per-axis with asymmetric tension on Y
    const applyRubber = (raw: number, strength: number, max: number) => {
      const absRaw = Math.abs(raw)
      if (absRaw === 0) return 0
      const reach = max * (1 + strength)
      const t = Math.min(1, absRaw / reach)
      return Math.sign(raw) * max * (1 - Math.pow(1 - t, 1 + strength))
    }

    const leverX = applyRubber(rawDx, RUBBER_STRENGTH_DOWN, MAX_ORBIT_RADIUS)

    let leverY: number
    if (rawDy >= 0) {
      leverY = applyRubber(rawDy, RUBBER_STRENGTH_DOWN, MAX_ORBIT_RADIUS)
    } else {
      leverY = applyRubber(rawDy, RUBBER_STRENGTH_UP, MAX_ORBIT_RADIUS * 0.15)
    }

    const distFromPivot = Math.sqrt(leverX ** 2 + leverY ** 2)
    const newTension = distFromPivot / MAX_ORBIT_RADIUS
    setTension(newTension)

    const snappedOrbit =
      leverY > 0
        ? ORBIT_RADII.find((r) => Math.abs(distFromPivot - r) <= SNAP_DISTANCE)
        : undefined

    let finalX = leverX
    let finalY = leverY

    if (snappedOrbit !== undefined && distFromPivot > 0) {
      const scale = snappedOrbit / distFromPivot
      finalX = leverX * scale
      finalY = leverY * scale
    }

    const effectiveDist = snappedOrbit ?? distFromPivot
    const minRadius = ORBIT_RADII[0]

    if (leverY > 0 && effectiveDist > 0) {
      const t = Math.min(
        1,
        Math.max(
          0,
          (effectiveDist - minRadius) / (MAX_ORBIT_RADIUS - minRadius)
        )
      )
      const newTimer = Math.round(
        TIMERS_NOTCHES[0] +
          t * (TIMERS_NOTCHES[TIMERS_NOTCHES.length - 1] - TIMERS_NOTCHES[0])
      )
      setTimer(effectiveDist < minRadius - SNAP_DISTANCE ? 0 : newTimer)
    } else {
      setTimer(0)
    }

    setDistance({ x: finalX, y: finalY })
  }

  return (
    <>
      <div
        className="flex h-full w-full flex-col items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="mb-16 text-center">
          <div
            className="mb-4 text-2xl font-bold transition-transform duration-300"
            style={{
              transform: isRunning ? "translateY(0px)" : "translateY(20px)",
            }}
          >
            {isRunning && !isDragging
              ? `${timer} : ${String(seconds).padStart(2, "0")}`
              : timer
                ? `${timer} minutes`
                : "Drag it"}
          </div>
          <div>
            <Button
              onClick={() => resetTimer()}
              className="cursor-pointer"
              style={
                isRunning
                  ? {
                      opacity: 1,
                      transform: "translateY(0)",
                      transition: "all 0.3s ease",
                    }
                  : {
                      opacity: 0,
                      transform: "translateY(-10px)",
                    }
              }
            >
              Stop
            </Button>
          </div>
        </div>

        <div
          className="relative"
          style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
        >
          {TIMERS_NOTCHES.map((notch, i) => {
            const r = ORBIT_RADII[i]
            const curveW = r
            const curveH = r / 2
            return (
              <div
                key={notch}
                className="pointer-events-none absolute rounded-b-full"
                style={{
                  width: curveW,
                  height: curveH,
                  left: PIVOT_X - curveW / 2,
                  top: PIVOT_Y + r - curveH,
                  borderWidth: "0 3px 3px 3px",
                  borderStyle: "dotted",
                  borderColor: "transparent",
                  borderBottomColor: "var(--color-border)",
                }}
              >
                <p className="absolute bottom-0 w-full text-center text-xs text-mist-300">
                  {notch}
                </p>
              </div>
            )
          })}
          {isDragging && (
            <div
              className="pointer-events-none absolute bg-mist-600 transition-[height] duration-50"
              style={{
                width: Math.sqrt(distance.x ** 2 + distance.y ** 2),
                height:
                  CABLE_WIDTH_MAX -
                  tension * (CABLE_WIDTH_MAX - CABLE_WIDTH_MIN),
                left: PIVOT_X,
                top: PIVOT_Y,
                transform: `rotate(${Math.atan2(distance.y, distance.x) * (180 / Math.PI)}deg)`,
                transformOrigin: "0 50%",
              }}
            />
          )}
          <div
            className="absolute cursor-grab rounded-full border-2 border-mist-600 bg-white shadow-sm shadow-mist-600 transition-[width,height] duration-50 active:cursor-grabbing"
            style={{
              width:
                LEVER_SIZE_MAX - tension * (LEVER_SIZE_MAX - LEVER_SIZE_MIN),
              height:
                LEVER_SIZE_MAX - tension * (LEVER_SIZE_MAX - LEVER_SIZE_MIN),
              left: PIVOT_X,
              top: PIVOT_Y,
              transform: `translate(calc(-50% + ${distance.x}px), calc(-50% + ${distance.y}px))`,
            }}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
    </>
  )
}

export { PomodoroApp }
