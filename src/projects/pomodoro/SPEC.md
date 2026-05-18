# Pomodoro Timer — Specification

## Purpose

A drag-to-set Pomodoro timer for the portfolio project page. The user pulls a lever downward along curved arcs to choose a duration, then releases to start a countdown. While a session is running, the lever can be dragged again to adjust the duration, with guardrails so accidental small movements do not change the active timer.

Implementation: [`index.tsx`](./index.tsx)

---

## Constants

| Constant | Value | Role |
|----------|-------|------|
| `TIMERS_NOTCHES` | `[5, 15, 30, 60]` | Preset durations (minutes) and arc sizes |
| `LEVER_SIZE_MAX` / `MIN` | 30 / 18 | Lever circle size at rest vs full tension |
| `ORBIT_PADDING_MIN` / `MAX` | 44 / 268 | Padding from lever to arc per notch value |
| `SNAP_DISTANCE` | 10 px | Max distance to snap lever onto a notch arc |
| `CABLE_WIDTH_MAX` / `MIN` | 3 / 0.6 | Cable thickness from pivot to lever |
| `RUBBER_STRENGTH_DOWN` | 0.15 | Rubber-band strength (down / sideways) |
| `RUBBER_STRENGTH_UP` | 6.0 | Rubber-band strength (upward — much stiffer) |

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

Snap points on the sides of an arc can lie closer to the pivot than `minRadius`; snapping to the first notch still counts as past the first-notch threshold.

---

## Interaction model

1. **Rubber band** — pointer delta is eased with `applyRubber`; max reach scales with `MAX_ORBIT_RADIUS`.
2. **Asymmetric Y tension** — pulling up uses `RUBBER_STRENGTH_UP` and a smaller max travel so the lever resists returning above the pivot.
3. **Snap** — when the lever is within `SNAP_DISTANCE` of a notch arc, it snaps to the closest point on that arc (closest notch wins).
4. **Interpolation** — between notches (and past the first-notch radius without snap), minutes are linearly mapped from `effectiveDist` between `TIMERS_NOTCHES[0]` and the maximum notch.

---

## States

| State | Condition | Description |
|-------|-----------|-------------|
| `idle` | `!isDragging && !isRunning` | Lever at rest; ping animation on hint lever |
| `setting` | `isDragging && !isRunning` | User is choosing a duration before first start |
| `running` | `isRunning && !isDragging` | Countdown active |
| `adjusting` | `isRunning && isDragging` | User is dragging during an active session |

---

## First-notch commit threshold

**Past first notch** (`isPastFirstNotch`) when all of:

- `leverY > 0` (lever pulled below pivot), and
- `snappedNotchIndex !== undefined` **or** `effectiveDist >= ORBIT_RADII[0]`

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

1. **On pointer down** — pause the countdown interval; snapshot `timer` and `seconds` into `pausedRef`; do not mutate committed time.
2. **While dragging below first notch** — show `"Drag to set timer"`; committed `timer` / `seconds` stay frozen.
3. **While dragging at or past first notch** — show preview only (`draftMinutes`, e.g. `"30 minutes"`); still do not write preview into committed state until release.
4. **On release below first notch** — restore snapshot; resume countdown from the same `M:SS` (e.g. resume 14:30, not 14:00).
5. **On release at or past first notch with `draftMinutes > 0`** — start a **new** session at `draftMinutes:00` (full reset + new interval).

### Example

1. User sets 15 minutes and starts; countdown reaches 14:30.
2. User drags slightly but does not reach the first notch arc.
3. UI shows **"Drag to set timer"** (not `14 minutes`).
4. User releases → countdown resumes at **14:30**.

If the user drags past the first notch to 30 minutes and releases → new session at **30:00**.

---

## Display rules

| State | Label |
|-------|--------|
| `running`, not dragging | `{timer} : {seconds}` (zero-padded seconds) |
| `adjusting`, below first notch | `Drag to set timer` |
| `adjusting`, past first notch | `{draftMinutes} minutes` |
| `setting`, below first notch | `Drag to set timer` |
| `setting`, past first notch | `{draftMinutes} minutes` |
| `idle`, `timer > 0` (not dragging) | `{timer} minutes` |
| `idle`, no timer | `Drag to set timer` |

---

## Stop control

The **Stop** button calls `resetTimer()`: clears minutes/seconds, stops the interval, resets lever position and tension, hides the running UI.

---

## Non-goals

- Debouncing or throttling `mousemove` events
- Sub–5-minute durations without using the first notch
- Persisting timer state across page reloads
