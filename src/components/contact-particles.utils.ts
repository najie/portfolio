type EdgePoint = { x: number; y: number; nx: number; ny: number }

/** Point at `t` in [0, 1) clockwise around a rounded rect, with its outward normal. */
const pointOnRoundedRect = (
  t: number,
  width: number,
  height: number,
  radius: number
): EdgePoint => {
  const r = radius
  const straightX = width - 2 * r
  const straightY = height - 2 * r
  const arc = (Math.PI * r) / 2
  let s = t * (2 * (straightX + straightY) + 4 * arc)

  const sides = [
    { length: straightX, x: r, y: 0, dx: 1, dy: 0, nx: 0, ny: -1 },
    { length: straightY, x: width, y: r, dx: 0, dy: 1, nx: 1, ny: 0 },
    { length: straightX, x: width - r, y: height, dx: -1, dy: 0, nx: 0, ny: 1 },
    { length: straightY, x: 0, y: height - r, dx: 0, dy: -1, nx: -1, ny: 0 },
  ]

  for (const side of sides) {
    if (s < side.length) {
      const { x, y, dx, dy, nx, ny } = side
      return { x: x + dx * s, y: y + dy * s, nx, ny }
    }
    s -= side.length

    if (s < arc) {
      const angle = Math.atan2(side.ny, side.nx) + s / r
      const nx = Math.cos(angle)
      const ny = Math.sin(angle)
      // the arc's centre sits one radius inward from the end of this side
      const cx = side.x + side.dx * side.length - side.nx * r
      const cy = side.y + side.dy * side.length - side.ny * r
      return { x: cx + nx * r, y: cy + ny * r, nx, ny }
    }
    s -= arc
  }

  return { x: r, y: 0, nx: 0, ny: -1 }
}

/**
 * Opacity at `distance` from the card edge: eases in from the card centre, under
 * the glass (negative distance), then decays on a curve that slows down towards `reach`.
 */
const getParticleOpacity = (distance: number, inset: number, reach: number) => {
  if (distance >= reach) return 0
  if (distance <= 0) return Math.max(0, 1 + distance / inset)
  return (1 - distance / reach) ** 2
}

export { getParticleOpacity, pointOnRoundedRect }
