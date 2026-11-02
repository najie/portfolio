import { describe, expect, it } from "vitest"
import { RUBBER_STRENGTH_DOWN, TIMERS_NOTCHES } from "./constant"
import {
  applyRubber,
  computeLeverPosition,
  getArcRadius,
  getDisplayLabel,
  getRemainingSeconds,
  getRestRadius,
  invertRubber,
  isPastFirstNotch,
  MAX_ORBIT_RADIUS,
  MIN_RADIUS,
  ORBIT_RADII,
} from "./utils"

describe("getRemainingSeconds", () => {
  const start = 1_000_000

  it("shows the full duration until the first second has elapsed", () => {
    expect(getRemainingSeconds(start + 300_000, start)).toBe(300)
    expect(getRemainingSeconds(start + 300_000, start + 999)).toBe(300)
    expect(getRemainingSeconds(start + 300_000, start + 1000)).toBe(299)
  })

  it("reaches zero exactly at the deadline, not a second later", () => {
    expect(getRemainingSeconds(start, start - 1)).toBe(1)
    expect(getRemainingSeconds(start, start)).toBe(0)
  })

  it("stays correct after a long gap between ticks", () => {
    expect(getRemainingSeconds(start + 300_000, start + 120_000)).toBe(180)
    expect(getRemainingSeconds(start + 300_000, start + 900_000)).toBe(0)
  })
})

describe("getDisplayLabel", () => {
  const base = {
    isRunning: false,
    isFinished: false,
    remainingSeconds: 0,
    draftMinutes: null,
  }

  it("shows the hint when nothing is set", () => {
    expect(getDisplayLabel(base)).toBe("Drag to set timer")
  })

  it("shows countdown while running", () => {
    expect(
      getDisplayLabel({ ...base, isRunning: true, remainingSeconds: 845 })
    ).toBe("14:05")
  })

  it("keeps the frozen countdown while adjusting below the first notch", () => {
    expect(
      getDisplayLabel({ ...base, isRunning: true, remainingSeconds: 870 })
    ).toBe("14:30")
  })

  it("previews draft minutes, even over a running countdown", () => {
    expect(
      getDisplayLabel({
        ...base,
        isRunning: true,
        remainingSeconds: 870,
        draftMinutes: 30,
      })
    ).toBe("30 minutes")
  })

  it("announces the end of a session", () => {
    expect(getDisplayLabel({ ...base, isFinished: true })).toBe("Time's up")
  })
})

describe("getArcRadius", () => {
  it("equals depth straight below the pivot", () => {
    expect(getArcRadius({ x: 0, y: 120 })).toBe(120)
  })

  it("reads a point on a side of an arc as that arc", () => {
    const r = ORBIT_RADII[2]
    expect(getArcRadius({ x: r / 2, y: r / 2 })).toBeCloseTo(r)
  })

  it("ignores sideways travel past the arc ends", () => {
    expect(getArcRadius({ x: 200, y: 10 })).toBe(20)
  })

  it("is zero above the pivot", () => {
    expect(getArcRadius({ x: 50, y: -10 })).toBe(0)
  })
})

describe("getRestRadius", () => {
  it("sits on the arc of each preset", () => {
    TIMERS_NOTCHES.forEach((notch, i) => {
      expect(Math.abs(getRestRadius(notch * 60) - ORBIT_RADII[i])).toBeLessThan(
        1
      )
    })
  })

  it("retracts to the pivot at zero", () => {
    expect(getRestRadius(0)).toBe(0)
    expect(getRestRadius(150)).toBeCloseTo(MIN_RADIUS / 2)
  })
})

describe("invertRubber", () => {
  it("round-trips through applyRubber", () => {
    for (const value of [0, 40, 150, MAX_ORBIT_RADIUS]) {
      const raw = invertRubber(value, RUBBER_STRENGTH_DOWN, MAX_ORBIT_RADIUS)
      expect(
        applyRubber(raw, RUBBER_STRENGTH_DOWN, MAX_ORBIT_RADIUS)
      ).toBeCloseTo(value)
    }
  })
})

describe("isPastFirstNotch", () => {
  it("is false when lever is above the pivot", () => {
    expect(isPastFirstNotch(-10, MIN_RADIUS + 100, undefined)).toBe(false)
  })

  it("is true when the arc radius reaches the first notch radius", () => {
    expect(isPastFirstNotch(50, MIN_RADIUS, undefined)).toBe(true)
  })

  it("is true when snapped to any notch", () => {
    expect(isPastFirstNotch(5, 0, 0)).toBe(true)
  })
})

describe("computeLeverPosition", () => {
  it("returns no draft below the first-notch threshold", () => {
    const result = computeLeverPosition(0, -20)
    expect(result.pastFirstNotch).toBe(false)
    expect(result.draftMinutes).toBeNull()
  })

  it("snaps to preset notch values", () => {
    const farDown = computeLeverPosition(0, 600)
    expect(farDown.snappedNotchIndex).toBe(TIMERS_NOTCHES.length - 1)
    expect(farDown.draftMinutes).toBe(60)
  })
})
