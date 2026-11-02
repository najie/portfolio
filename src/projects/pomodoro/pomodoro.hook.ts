import { useCallback, useEffect, useRef, useState } from "react"
import {
  computeLeverPosition,
  formatClock,
  getDisplayLabel,
  getRemainingSeconds,
  getRestRadius,
  invertRubber,
  MAX_ORBIT_RADIUS,
} from "./utils"
import { COMMIT_TRAVEL, RUBBER_STRENGTH_DOWN } from "./constant"
import type { Point } from "./utils"

type DragSession = {
  pointerId: number
  startPointer: Point
  rawOrigin: Point
  draftMinutes: number | null
}

/** Runs in a worker because browsers throttle timers in background tabs. */
const createTicker = (onTick: () => void) => {
  const url = URL.createObjectURL(
    new Blob(["setInterval(() => postMessage(0), 250)"])
  )
  const worker = new Worker(url)
  URL.revokeObjectURL(url)
  worker.onmessage = onTick
  return worker
}

const playChime = (audio: AudioContext) => {
  ;[659.25, 880].forEach((frequency, i) => {
    const at = audio.currentTime + i * 0.28
    const oscillator = new OscillatorNode(audio, { frequency })
    const gain = new GainNode(audio, { gain: 0 })
    gain.gain.linearRampToValueAtTime(0.18, at + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, at + 1.4)
    oscillator.connect(gain).connect(audio.destination)
    oscillator.start(at)
    oscillator.stop(at + 1.4)
  })
}

const usePomodoro = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [draftMinutes, setDraftMinutes] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState<Point>({ x: 0, y: 0 })
  const [announcement, setAnnouncement] = useState("")

  const dragRef = useRef<DragSession | null>(null)
  const deadlineRef = useRef(0)
  const tickerRef = useRef<Worker | null>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const baseTitleRef = useRef<string | null>(null)

  const stopTicker = useCallback(() => {
    tickerRef.current?.terminate()
    tickerRef.current = null
  }, [])

  useEffect(() => stopTicker, [stopTicker])

  const syncCountdown = useCallback(() => {
    const left = getRemainingSeconds(deadlineRef.current, Date.now())
    setRemainingSeconds(left)
    if (left > 0) return
    stopTicker()
    setIsRunning(false)
    setIsFinished(true)
    setAnnouncement("Time's up")
    if (audioRef.current) playChime(audioRef.current)
  }, [stopTicker])

  const runCountdown = useCallback(
    (totalSeconds: number) => {
      stopTicker()
      deadlineRef.current = Date.now() + totalSeconds * 1000
      setRemainingSeconds(totalSeconds)
      setIsRunning(true)
      setIsFinished(false)
      tickerRef.current = createTicker(syncCountdown)
    },
    [stopTicker, syncCountdown]
  )

  const startTimer = useCallback(
    (minutes: number) => {
      runCountdown(minutes * 60)
      setAnnouncement(`${minutes} minute timer started`)
    },
    [runCountdown]
  )

  // Audio may only be unlocked inside a user gesture, long before the chime plays.
  const unlockAudio = () => {
    audioRef.current ??= new AudioContext()
    void audioRef.current.resume()
  }

  const selectNotch = (minutes: number) => {
    unlockAudio()
    startTimer(minutes)
  }

  const resetTimer = useCallback(() => {
    stopTicker()
    setRemainingSeconds(0)
    setIsRunning(false)
    setIsFinished(false)
    setAnnouncement("Timer stopped")
  }, [stopTicker])

  useEffect(() => {
    baseTitleRef.current ??= document.title
    if (isRunning) document.title = `${formatClock(remainingSeconds)} | Oui`
    else if (isFinished) document.title = "Time's up | Oui"
    else document.title = baseTitleRef.current
  }, [isRunning, isFinished, remainingSeconds])

  // half-pixel steps: the lever crawls, so most ticks should not restyle it
  const restRadius = Math.round(getRestRadius(remainingSeconds) * 2) / 2
  const distance = isDragging ? dragPosition : { x: 0, y: restRadius }
  const tension = Math.hypot(distance.x, distance.y) / MAX_ORBIT_RADIUS
  const reachedMinutes = draftMinutes ?? remainingSeconds / 60
  const displayLabel = getDisplayLabel({
    isRunning,
    isFinished,
    remainingSeconds,
    draftMinutes,
  })

  const endDrag = (commit: boolean) => {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = null
    setIsDragging(false)
    setDraftMinutes(null)

    if (commit && drag.draftMinutes !== null) startTimer(drag.draftMinutes)
    else if (isRunning) runCountdown(remainingSeconds)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || dragRef.current) return
    event.preventDefault()
    unlockAudio()
    event.currentTarget.setPointerCapture(event.pointerId)

    if (isRunning) stopTicker()
    setIsFinished(false)
    setDragPosition(distance)
    setIsDragging(true)
    dragRef.current = {
      pointerId: event.pointerId,
      startPointer: { x: event.clientX, y: event.clientY },
      rawOrigin: {
        x: 0,
        y: invertRubber(distance.y, RUBBER_STRENGTH_DOWN, MAX_ORBIT_RADIUS),
      },
      draftMinutes: null,
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (drag?.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.startPointer.x
    const deltaY = event.clientY - drag.startPointer.y
    const {
      finalX,
      finalY,
      draftMinutes: nextDraft,
    } = computeLeverPosition(
      drag.rawOrigin.x + deltaX,
      drag.rawOrigin.y + deltaY
    )

    // once the lever has really moved, a return near its origin can still commit
    const moved =
      drag.draftMinutes !== null || Math.hypot(deltaX, deltaY) >= COMMIT_TRAVEL
    drag.draftMinutes = moved ? nextDraft : null
    setDraftMinutes(drag.draftMinutes)
    setDragPosition({ x: finalX, y: finalY })
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) endDrag(true)
  }

  // Interrupted gestures (pointercancel, stolen capture) never start a timer.
  const handleLostPointerCapture = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (dragRef.current?.pointerId === event.pointerId) endDrag(false)
  }

  return {
    isDragging,
    isRunning,
    isFinished,
    isIdle: !isDragging && !isRunning,
    distance,
    tension,
    reachedMinutes,
    displayLabel,
    showsClock: draftMinutes !== null || isRunning,
    announcement,
    resetTimer,
    selectNotch,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    handleLostPointerCapture,
  }
}

export { usePomodoro }
