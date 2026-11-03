import { useEffect, useRef } from "react"
import {
  getParticleOpacity,
  pointOnRoundedRect,
} from "./contact-particles.utils"
import { PARTICLES_FADE_MS, isQuiet } from "@/lib/motion-clock"

const COLORS = ["#f9d3e4", "#dfd5fa", "#cbe8f8"] // pastels of the wallpaper pools
const CARD_RADIUS = 30.8 // rounded-3xl
const REACH_PX = 140 // stays inside the page's bottom padding, so scroll height holds
const PARTICLE_SPACING = 12
const MAX_OPACITY = 0.8
const START_SCALE = 0.3
const QUIET_CHECK_MS = 250

type Particle = {
  directionX: number
  directionY: number
  edgeDistance: number
  travelled: number
  reach: number
  speed: number
  radius: number
  color: string
}

const ContactParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const card = canvas?.parentElement
    const context = canvas?.getContext("2d")
    if (!canvas || !card || !context) return

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) canvas.style.opacity = "1"
    let particles: Particle[] = []
    let frame = 0
    let lastTime = 0
    let onScreen = false
    let pauseTimer: ReturnType<typeof setTimeout> | undefined

    const spawn = (width: number, height: number): Particle => {
      // aiming at an even point on the outline keeps all sides equally busy
      const edge = pointOnRoundedRect(Math.random(), width, height, CARD_RADIUS)
      const offsetX = edge.x - width / 2
      const offsetY = edge.y - height / 2
      const edgeDistance = Math.hypot(offsetX, offsetY)
      return {
        directionX: offsetX / edgeDistance,
        directionY: offsetY / edgeDistance,
        edgeDistance,
        travelled: 0,
        reach: REACH_PX * (0.55 + Math.random() * 0.45),
        speed: 35 + Math.random() * 35,
        radius: 5 + Math.random() ** 2 * 11,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
    }

    const draw = () => {
      const centreX = canvas.clientWidth / 2
      const centreY = REACH_PX + card.clientHeight / 2
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      for (const p of particles) {
        const progress = p.travelled / (p.edgeDistance + p.reach)
        context.globalAlpha =
          MAX_OPACITY *
          getParticleOpacity(
            p.travelled - p.edgeDistance,
            p.edgeDistance,
            p.reach
          )
        context.fillStyle = p.color
        context.beginPath()
        context.arc(
          centreX + p.directionX * p.travelled,
          centreY + p.directionY * p.travelled,
          p.radius * (START_SCALE + (1 - START_SCALE) * progress),
          0,
          Math.PI * 2
        )
        context.fill()
      }
    }

    const step = (time: number) => {
      // clamped so a stalled frame does not teleport the field
      const delta = Math.min(0.05, (time - lastTime) / 1000)
      lastTime = time

      particles = particles.map((p) => {
        const outside = p.travelled - p.edgeDistance
        if (outside >= p.reach) {
          return spawn(card.clientWidth, card.clientHeight)
        }
        // eases to a crawl past the edge, so the last stretch of the fade takes longest
        const drag = 1 - (0.8 * Math.max(0, outside)) / p.reach
        return { ...p, travelled: p.travelled + p.speed * drag * delta }
      })

      draw()
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      clearTimeout(pauseTimer)
      canvas.style.opacity = "1"
      if (frame || reducedMotion) return
      lastTime = performance.now()
      frame = requestAnimationFrame(step)
    }

    const stop = () => {
      clearTimeout(pauseTimer)
      cancelAnimationFrame(frame)
      frame = 0
    }

    // the field fades out and freezes while the page's bigger motion plays, then picks up where it was
    const pause = () => {
      if (canvas.style.opacity === "0") return
      canvas.style.opacity = "0"
      if (frame) pauseTimer = setTimeout(stop, PARTICLES_FADE_MS)
    }

    const sync = () => {
      if (reducedMotion) return
      if (onScreen && isQuiet()) start()
      else if (onScreen) pause()
      else stop()
    }

    const layout = () => {
      const scale = Math.min(devicePixelRatio, 2)
      canvas.width = canvas.clientWidth * scale
      canvas.height = canvas.clientHeight * scale
      context.setTransform(scale, 0, 0, scale, 0, 0)

      const { clientWidth: width, clientHeight: height } = card
      const count = Math.round((2 * (width + height)) / PARTICLE_SPACING)
      // seeded mid-flight so the card is already surrounded on arrival
      particles = Array.from({ length: count }, () => {
        const p = spawn(width, height)
        const route = p.edgeDistance + p.reach
        return { ...p, travelled: Math.random() * route }
      })
      draw()
    }

    const resizeObserver = new ResizeObserver(layout)
    resizeObserver.observe(card)

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    visibilityObserver.observe(canvas)
    const quietCheck = setInterval(sync, QUIET_CHECK_MS)

    return () => {
      stop()
      clearInterval(quietCheck)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // hidden until the motion clock first allows the particles (shown at once, still, with reduced motion)
      style={{ transitionDuration: `${PARTICLES_FADE_MS}ms`, opacity: 0 }}
      className="pointer-events-none absolute -inset-y-35 left-1/2 -z-1 h-[calc(100%+17.5rem)] w-[min(100vw,calc(100%+17.5rem))] -translate-x-1/2 transition-opacity"
    />
  )
}

export { ContactParticles }
