import { describe, expect, it } from "vitest"
import { TIMERS_NOTCHES } from "./constant"
import {
  computeLeverPosition,
  getDisplayLabel,
  isPastFirstNotch,
  MIN_RADIUS,
  tickCountdown,
} from "./utils"

describe("tickCountdown", () => {
  it("decrements seconds when above zero", () => {
    expect(tickCountdown(5, 30)).toEqual({
      minutes: 5,
      seconds: 29,
      completed: false,
    })
  })

  it("rolls minutes down and resets seconds to 59", () => {
    expect(tickCountdown(5, 0)).toEqual({
      minutes: 4,
      seconds: 59,
      completed: false,
    })
  })

  it("completes at 0:00 without going negative", () => {
    expect(tickCountdown(0, 0)).toEqual({
      minutes: 0,
      seconds: 0,
      completed: true,
    })
  })

  it("steps 15:00 through 14:59 and 14:58", () => {
    let minutes = 15
    let seconds = 0

    ;({ minutes, seconds } = tickCountdown(minutes, seconds))
    expect({ minutes, seconds }).toEqual({ minutes: 14, seconds: 59 })

    ;({ minutes, seconds } = tickCountdown(minutes, seconds))
    expect({ minutes, seconds }).toEqual({ minutes: 14, seconds: 58 })
  })
})

describe("getDisplayLabel", () => {
  it("shows countdown while running", () => {
    expect(
      getDisplayLabel({
        isRunning: true,
        isDragging: false,
        timer: 14,
        seconds: 5,
        draftMinutes: null,
      })
    ).toBe("14 : 05")
  })

  it("shows drag hint below first notch while adjusting", () => {
    expect(
      getDisplayLabel({
        isRunning: true,
        isDragging: true,
        timer: 14,
        seconds: 30,
        draftMinutes: null,
      })
    ).toBe("Drag to set timer")
  })

  it("shows draft minutes past first notch while dragging", () => {
    expect(
      getDisplayLabel({
        isRunning: false,
        isDragging: true,
        timer: 0,
        seconds: 0,
        draftMinutes: 30,
      })
    ).toBe("30 minutes")
  })

  it("shows idle preset when timer is set but not running", () => {
    expect(
      getDisplayLabel({
        isRunning: false,
        isDragging: false,
        timer: 15,
        seconds: 0,
        draftMinutes: null,
      })
    ).toBe("15 minutes")
  })
})

describe("isPastFirstNotch", () => {
  it("is false when lever is above the pivot", () => {
    expect(isPastFirstNotch(-10, MIN_RADIUS + 100, undefined)).toBe(false)
  })

  it("is true when effective distance reaches the first notch radius", () => {
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
