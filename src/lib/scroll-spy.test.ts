import { describe, expect, it } from "vitest"
import { getActiveSectionIndex } from "./scroll-spy"

describe("getActiveSectionIndex", () => {
  it("returns -1 above the first section", () => {
    expect(getActiveSectionIndex([700, 1500, 1900], 900, 2000)).toBe(-1)
  })

  it("picks the last section past the line mid-page", () => {
    expect(getActiveSectionIndex([-400, 300, 700], 900, 1000)).toBe(1)
  })

  it("always reaches a short last section at the end of the page", () => {
    expect(getActiveSectionIndex([-900, 80, 890], 900, 0)).toBe(2)
    expect(getActiveSectionIndex([-500, 580, 1390], 1400, 0)).toBe(2)
  })

  it("does not skip the middle section on a tall screen", () => {
    expect(getActiveSectionIndex([-500, 930, 1236], 1400, 350)).toBe(1)
  })
})
