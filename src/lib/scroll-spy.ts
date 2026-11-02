const SPY_LINE = 0.4
const TAIL_RATIO = 0.5

/**
 * Index of the last section whose top has crossed the spy line, or -1 above them all.
 * Over the final half viewport of scroll the line slides to the bottom edge, because
 * a short last section can never scroll up to a fixed line.
 */
const getActiveSectionIndex = (
  sectionTops: number[],
  viewportHeight: number,
  scrollRemaining: number
) => {
  const tail = viewportHeight * TAIL_RATIO
  const tailProgress = Math.max(0, 1 - scrollRemaining / tail)
  const line = viewportHeight * (SPY_LINE + (1 - SPY_LINE) * tailProgress)
  return sectionTops.findLastIndex((top) => top <= line)
}

export { getActiveSectionIndex }
