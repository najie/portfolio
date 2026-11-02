# Pomodoro Timer — Specification

## Purpose

A drag-to-set Pomodoro timer for the portfolio project page. The user pulls a lever downward along curved arcs to choose a duration, then releases to start a countdown. The lever then behaves like a wind-up timer: it swings to the centre line and retracts to the pivot as time runs out, so its depth always shows the time left. While a session is running, the lever can be dragged again to adjust the duration, with guardrails so accidental small movements do not change the active timer. Each notch label is also a button that starts that preset, which is the keyboard and assistive-technology path.

Implementation: [`index.tsx`](./index.tsx)

---

## Constants

| Constant                    | Value             | Role                                         |
| --------------------------- | ----------------- | -------------------------------------------- |
| `TIMERS_NOTCHES`            | `[5, 15, 30, 60]` | Preset durations (minutes) and arc sizes     |
| `LEVER_SIZE_MAX` / `MIN`    | 30 / 18           | Lever circle size at rest vs full tension    |
| `ORBIT_PADDING_MIN` / `MAX` | 44 / 268          | Padding from lever to arc per notch value    |
| `SNAP_DISTANCE`             | 10 px             | Max distance to snap lever onto a notch arc  |
| `CABLE_WIDTH_MAX` / `MIN`   | 3 / 0.6           | Cable thickness from pivot to lever          |
| `RUBBER_STRENGTH_DOWN`      | 0.15              | Rubber-band strength (down / sideways)       |
| `RUBBER_STRENGTH_UP`        | 6.0               | Rubber-band strength (upward — much stiffer) |

Derived:

- `ORBIT_RADII` — semicircle radius per notch (from `getOrbitSize`)
- `MAX_ORBIT_RADIUS` — outermost arc radius
- `ORBIT_RADII[0]` — **first-notch radius** (`minRadius`), used for the commit threshold

---

## Geometry

- **Pivot** — top-center of the arc area (`PIVOT_X`, `PIVOT_Y`).
- **Notch arcs** — bottom semicircles; size scales with notch minutes via `getOrbitPadding` / `getOrbitSize`.
- **`getNotchArc(r)`** — width, height, center, and semicircle radius for rendering and snap math.
- **`getClosestPointOnNotchArc(lever, r)`** — closest point on a notch’s bottom semicircle; used for snap targets and snap distance.
- **`getArcRadius(lever)`** — radius of the notch arc through the lever, `(x² + y²) / y`, so the reading matches the drawn arcs on their sides as well as at the bottom. Past the arc ends (`|x| > y`) it is `2y`: only depth counts.
- **`getRestRadius(seconds)`** — lever depth for a remaining time, on the same scale as the arcs.

Snap points on the sides of an arc can lie closer to the pivot than `minRadius`; snapping to the first notch still counts as past the first-notch threshold.

---

## Interaction model

1. **Rubber band** — pointer delta is eased with `applyRubber`; max reach scales with `MAX_ORBIT_RADIUS`.
2. **Asymmetric Y tension** — pulling up uses `RUBBER_STRENGTH_UP` and a smaller max travel so the lever resists returning above the pivot.
3. **Snap** — when the lever is within `SNAP_DISTANCE` of a notch arc, it snaps to the closest point on that arc (closest notch wins).
4. **Interpolation** — between notches (and past the first-notch radius without snap), minutes are linearly mapped from the arc radius between `TIMERS_NOTCHES[0]` and the maximum notch.
5. **Release** — the lever swings to its rest position on a damped curve; the knob and cable share registered CSS properties (`pomodoro.css`) so they move as one object. Reduced motion skips the swing.

---

## States

| State       | Condition                   | Description                                    |
| ----------- | --------------------------- | ---------------------------------------------- |
| `idle`      | `!isDragging && !isRunning` | Lever at rest; ping animation on hint lever    |
| `setting`   | `isDragging && !isRunning`  | User is choosing a duration before first start |
| `running`   | `isRunning && !isDragging`  | Countdown active                               |
| `adjusting` | `isRunning && isDragging`   | User is dragging during an active session      |

---

## First-notch commit threshold

**Past first notch** (`isPastFirstNotch`) when all of:

- `leverY > 0` (lever pulled below pivot), and
- `snappedNotchIndex !== undefined` **or** `getArcRadius(lever) >= ORBIT_RADII[0]`

**Below first notch:**

- The lever may still move (visual feedback only).
- No preview minutes and no change to the committed countdown.
- Display shows `"Drag to set timer"` while dragging.

**Rules:**

- No timer value below 5 minutes except by snapping to notch 0 (5 min).
- Interpolation only applies when past the first-notch radius and not snapped.

---

## Running adjustment

When the user drags the lever during a running session:

1. **On pointer down** — pause the countdown. The lever picks up from its current depth; `invertRubber` converts that depth back to pointer travel.
2. **While dragging below first notch, or before `COMMIT_TRAVEL`** — the frozen countdown stays on screen.
3. **While dragging at or past first notch** — show preview only (`draftMinutes`, e.g. `"30 minutes"`).
4. **On release without a draft** — resume from the same `M:SS` (e.g. resume 14:30, not 14:00).
5. **On release with a draft** — start a **new** session at `draftMinutes:00`.
6. **On an interrupted gesture** (lost pointer capture, `pointercancel`) — no draft is ever committed; a running session resumes.

### Example

1. User sets 15 minutes and starts; countdown reaches 14:30.
2. User grabs the lever and lets go without moving it.
3. The clock stays on **14:30** and the countdown resumes.

If the user drags to 30 minutes and releases → new session at **30:00**.

---

## Timekeeping

- The countdown stores a deadline and derives remaining seconds from `Date.now()` (`getRemainingSeconds`), so missed ticks cannot make it drift.
- Ticks come from a small Web Worker because browsers throttle timers in background tabs.
- At the deadline: the label shows `Time's up`, a two-note chime plays through Web Audio (unlocked on the gesture that started the timer), the knob rings, and the state is announced to screen readers.
- While running, the tab title shows the countdown.

---

## Display rules

| State | Label |
|-------|--------|
| Any drag with a draft | `{draftMinutes} minutes` |
| `running` or `adjusting` without a draft | `M:SS` |
| Finished | `Time's up` |
| Otherwise | `Drag to set timer` |

---

## Stop control

The **Stop** button calls `resetTimer()`: clears the countdown, stops the ticker, returns the lever to the pivot and hides itself.

---

## Non-goals

- Debouncing or throttling pointer events
- Sub–5-minute durations without using the first notch
- Persisting timer state across page reloads
