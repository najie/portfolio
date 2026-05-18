import {
  LEVER_SIZE_MAX,
  ORBIT_PADDING_MAX,
  ORBIT_PADDING_MIN,
  RUBBER_STRENGTH_DOWN,
  RUBBER_STRENGTH_UP,
  SNAP_DISTANCE,
  TIMERS_NOTCHES,
} from "./constant"

type Point = { x: number; y: number }

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
const MIN_RADIUS = ORBIT_RADII[0]
const PIVOT_X = CONTAINER_WIDTH / 2
const PIVOT_Y = 0

/** Semicircle geometry for a notch arc — shared by rendering and snap targets. */
const getNotchArc = (r: number) => ({
  width: r,
  height: r / 2,
  top: r / 2,
  bottom: r,
  centerY: r / 2,
  semicircleRadius: r / 2,
})

/** Closest point on the bottom semicircle of a notch arc to the lever position. */
const getClosestPointOnNotchArc = (
  lever: Point,
  r: number
): { point: Point; distance: number } | null => {
  if (lever.y <= 0) return null

  const { centerY, semicircleRadius: sr } = getNotchArc(r)
  const dx = lever.x
  const dy = lever.y - centerY
  const distToCenter = Math.sqrt(dx * dx + dy * dy)

  let point: Point
  if (distToCenter === 0) {
    point = { x: 0, y: r }
  } else {
    point = {
      x: (sr * dx) / distToCenter,
      y: centerY + (sr * dy) / distToCenter,
    }

    if (point.y < centerY) {
      const leftEnd = { x: -sr, y: centerY }
      const rightEnd = { x: sr, y: centerY }
      const leftDist = (lever.x - leftEnd.x) ** 2 + (lever.y - leftEnd.y) ** 2
      const rightDist =
        (lever.x - rightEnd.x) ** 2 + (lever.y - rightEnd.y) ** 2
      point = leftDist < rightDist ? leftEnd : rightEnd
    }
  }

  const distance = Math.sqrt(
    (lever.x - point.x) ** 2 + (lever.y - point.y) ** 2
  )
  return { point, distance }
}

const isPastFirstNotch = (
  leverY: number,
  effectiveDist: number,
  snappedNotchIndex: number | undefined
) =>
  leverY > 0 &&
  (snappedNotchIndex !== undefined || effectiveDist >= MIN_RADIUS)

const computeDraftMinutes = (
  leverY: number,
  effectiveDist: number,
  snappedNotchIndex: number | undefined
): number | null => {
  if (!isPastFirstNotch(leverY, effectiveDist, snappedNotchIndex)) {
    return null
  }
  if (snappedNotchIndex !== undefined) {
    return TIMERS_NOTCHES[snappedNotchIndex]
  }
  const t = Math.min(
    1,
    Math.max(0, (effectiveDist - MIN_RADIUS) / (MAX_ORBIT_RADIUS - MIN_RADIUS))
  )
  return Math.round(
    TIMERS_NOTCHES[0] +
      t * (TIMERS_NOTCHES[TIMERS_NOTCHES.length - 1] - TIMERS_NOTCHES[0])
  )
}

const applyRubber = (raw: number, strength: number, max: number) => {
  const absRaw = Math.abs(raw)
  if (absRaw === 0) return 0
  const reach = max * (1 + strength)
  const t = Math.min(1, absRaw / reach)
  return Math.sign(raw) * max * (1 - Math.pow(1 - t, 1 + strength))
}

type LeverPositionResult = {
  finalX: number
  finalY: number
  leverY: number
  snappedNotchIndex: number | undefined
  tension: number
  draftMinutes: number | null
  pastFirstNotch: boolean
}

const computeLeverPosition = (
  rawDx: number,
  rawDy: number
): LeverPositionResult => {
  const leverX = applyRubber(rawDx, RUBBER_STRENGTH_DOWN, MAX_ORBIT_RADIUS)

  let leverY: number
  if (rawDy >= 0) {
    leverY = applyRubber(rawDy, RUBBER_STRENGTH_DOWN, MAX_ORBIT_RADIUS)
  } else {
    leverY = applyRubber(rawDy, RUBBER_STRENGTH_UP, MAX_ORBIT_RADIUS * 0.15)
  }

  const distFromPivot = Math.sqrt(leverX ** 2 + leverY ** 2)
  const tension = distFromPivot / MAX_ORBIT_RADIUS

  let finalX = leverX
  let finalY = leverY
  let snappedNotchIndex: number | undefined

  if (leverY > 0) {
    let closestSnapDistance = SNAP_DISTANCE + 1

    ORBIT_RADII.forEach((r, i) => {
      const snap = getClosestPointOnNotchArc({ x: leverX, y: leverY }, r)
      if (
        snap &&
        snap.distance <= SNAP_DISTANCE &&
        snap.distance < closestSnapDistance
      ) {
        closestSnapDistance = snap.distance
        snappedNotchIndex = i
        finalX = snap.point.x
        finalY = snap.point.y
      }
    })
  }

  const effectiveDist = Math.sqrt(finalX ** 2 + finalY ** 2)
  const pastFirstNotch = isPastFirstNotch(
    leverY,
    effectiveDist,
    snappedNotchIndex
  )
  const draftMinutes = pastFirstNotch
    ? computeDraftMinutes(leverY, effectiveDist, snappedNotchIndex)
    : null

  return {
    finalX,
    finalY,
    leverY,
    snappedNotchIndex,
    tension,
    draftMinutes,
    pastFirstNotch,
  }
}

type DisplayLabelParams = {
  isRunning: boolean
  isDragging: boolean
  timer: number
  seconds: number
  draftMinutes: number | null
}

const getDisplayLabel = ({
  isRunning,
  isDragging,
  timer,
  seconds,
  draftMinutes,
}: DisplayLabelParams) => {
  if (isRunning && !isDragging) {
    return `${timer} : ${String(seconds).padStart(2, "0")}`
  }
  if (isDragging) {
    return draftMinutes !== null
      ? `${draftMinutes} minutes`
      : "Drag to set timer"
  }
  return timer > 0 ? `${timer} minutes` : "Drag to set timer"
}

export {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  MAX_ORBIT_RADIUS,
  MIN_RADIUS,
  ORBIT_RADII,
  PIVOT_X,
  PIVOT_Y,
  applyRubber,
  computeDraftMinutes,
  computeLeverPosition,
  getClosestPointOnNotchArc,
  getDisplayLabel,
  getNotchArc,
  getOrbitPadding,
  getOrbitSize,
  isPastFirstNotch,
}
export type { DisplayLabelParams, LeverPositionResult, Point }
