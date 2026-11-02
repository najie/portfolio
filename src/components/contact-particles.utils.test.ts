import { describe, expect, it } from "vitest"
import {
  getParticleOpacity,
  pointOnRoundedRect,
} from "./contact-particles.utils"

describe("pointOnRoundedRect", () => {
  const width = 300
  const height = 200
  const radius = 24

  it("stays on the outline, with a unit normal, all the way round", () => {
    for (let t = 0; t < 1; t += 0.001) {
      const { x, y, nx, ny } = pointOnRoundedRect(t, width, height, radius)
      expect(Math.hypot(nx, ny)).toBeCloseTo(1)

      const insideX = Math.max(radius - x, x - (width - radius), 0)
      const insideY = Math.max(radius - y, y - (height - radius), 0)
      if (insideX > 0 && insideY > 0) {
        expect(Math.hypot(insideX, insideY)).toBeCloseTo(radius)
      } else {
        expect(Math.min(x, y, width - x, height - y)).toBeCloseTo(0)
      }
    }
  })

  it("has no jump in position along the outline", () => {
    let previous = pointOnRoundedRect(0, width, height, radius)
    for (let t = 0.0005; t < 1; t += 0.0005) {
      const point = pointOnRoundedRect(t, width, height, radius)
      expect(
        Math.hypot(point.x - previous.x, point.y - previous.y)
      ).toBeLessThan(1)
      previous = point
    }
  })

  it("points outward on every side", () => {
    const perimeterShare = (s: number) =>
      s / (2 * (width + height - 4 * radius) + 2 * Math.PI * radius)
    const top = pointOnRoundedRect(perimeterShare(10), width, height, radius)
    expect([top.nx, top.ny]).toEqual([0, -1])
    const last = pointOnRoundedRect(0.999, width, height, radius)
    expect(last.nx).toBeLessThan(0)
  })
})

describe("getParticleOpacity", () => {
  it("eases in from nothing under the card", () => {
    expect(getParticleOpacity(-30, 30, 120)).toBe(0)
    expect(getParticleOpacity(-15, 30, 120)).toBe(0.5)
    expect(getParticleOpacity(0, 30, 120)).toBe(1)
  })

  it("decays with distance, reaching zero at the limit", () => {
    const near = getParticleOpacity(30, 30, 120)
    const mid = getParticleOpacity(60, 30, 120)
    const far = getParticleOpacity(100, 30, 120)
    expect(near).toBeGreaterThan(mid)
    expect(mid).toBeGreaterThan(far)
    expect(getParticleOpacity(120, 30, 120)).toBe(0)
  })

  it("fades slower the further out it gets", () => {
    const first = 1 - getParticleOpacity(20, 30, 120)
    const last = getParticleOpacity(100, 30, 120)
    expect(last).toBeLessThan(first)
  })
})
