// One clock for the home page's ambient motion. Every cycle opens with the wallpaper surge, the "Try it"
// card replays at the same moment, and the contact particles wait until "Try it" has finished.
// Change a timing here and all three stay in step.

export const CYCLE_MS = 20_000
export const SURGE_RISE_MS = 1_200
export const SURGE_SETTLE_MS = 12_000
export const SURGE_MS = SURGE_RISE_MS + SURGE_SETTLE_MS
/** The "Try it" reveal plus its BorderGlow sweep. */
export const TRY_IT_MS = 4_000
/** How long the particles take to fade out, so they are gone before the next surge. */
export const PARTICLES_FADE_MS = 700

/** Time into the current cycle. Cycles start at page load, so every island reads the same phase. */
export const cycleTime = (now = performance.now()) => now % CYCLE_MS

export const msToNextCycle = (now = performance.now()) =>
  CYCLE_MS - cycleTime(now)

/** The particles may run: the cycle's "Try it" play is over and there is time to fade before the next cycle. */
export const isQuiet = (now = performance.now()) => {
  const t = cycleTime(now)
  return t >= TRY_IT_MS && t < CYCLE_MS - PARTICLES_FADE_MS
}
