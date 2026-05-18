import { useCallback, useEffect, useRef, useState } from "react"
import { computeLeverPosition, getDisplayLabel, tickCountdown } from "./utils"

const usePomodoro = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [draftMinutes, setDraftMinutes] = useState<number | null>(null)
  const [distance, setDistance] = useState({ x: 0, y: 0 })
  const [tension, setTension] = useState(0)

  const dragRef = useRef<{
    startPointer: { x: number; y: number }
    startDistance: { x: number; y: number }
  } | null>(null)
  const secondsIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  )
  const pausedRef = useRef<{ minutes: number; seconds: number } | null>(null)
  const pastFirstNotchRef = useRef(false)
  const dragSurfaceRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef({ minutes: 0, seconds: 0 })

  const isIdle = !isDragging && !isRunning
  const displayLabel = getDisplayLabel({
    isRunning,
    isDragging,
    timer,
    seconds,
    draftMinutes,
  })

  const clearCountdownInterval = useCallback(() => {
    if (secondsIntervalRef.current !== undefined) {
      clearInterval(secondsIntervalRef.current)
      secondsIntervalRef.current = undefined
    }
  }, [])

  const finishCountdown = useCallback(() => {
    clearCountdownInterval()
    countdownRef.current = { minutes: 0, seconds: 0 }
    setTimer(0)
    setSeconds(0)
    setIsRunning(false)
  }, [clearCountdownInterval])

  const runCountdownInterval = useCallback(() => {
    clearCountdownInterval()
    secondsIntervalRef.current = setInterval(() => {
      const { minutes, seconds: secs } = countdownRef.current
      const next = tickCountdown(minutes, secs)
      if (next.completed) {
        finishCountdown()
        return
      }
      countdownRef.current = { minutes: next.minutes, seconds: next.seconds }
      setTimer(next.minutes)
      setSeconds(next.seconds)
    }, 1000)
  }, [clearCountdownInterval, finishCountdown])

  useEffect(() => () => clearCountdownInterval(), [clearCountdownInterval])

  const resetTimer = useCallback(() => {
    clearCountdownInterval()
    pausedRef.current = null
    pastFirstNotchRef.current = false
    countdownRef.current = { minutes: 0, seconds: 0 }
    setTimer(0)
    setSeconds(0)
    setDraftMinutes(null)
    setIsRunning(false)
    setDistance({ x: 0, y: 0 })
    setTension(0)
  }, [clearCountdownInterval])

  const startTimer = useCallback(
    (initialMinutes: number) => {
      clearCountdownInterval()
      pausedRef.current = null
      pastFirstNotchRef.current = false
      setDistance({ x: 0, y: 0 })
      setTension(0)
      setDraftMinutes(null)
      countdownRef.current = { minutes: initialMinutes, seconds: 0 }
      setTimer(initialMinutes)
      setSeconds(0)
      setIsRunning(true)
      runCountdownInterval()
    },
    [clearCountdownInterval, runCountdownInterval]
  )

  const resumeTimer = useCallback(
    (minutes: number, seconds: number) => {
      clearCountdownInterval()
      pausedRef.current = null
      pastFirstNotchRef.current = false
      setDraftMinutes(null)
      countdownRef.current = { minutes, seconds }
      setTimer(minutes)
      setSeconds(seconds)
      setIsRunning(true)
      runCountdownInterval()
    },
    [clearCountdownInterval, runCountdownInterval]
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragSurfaceRef.current?.setPointerCapture(event.pointerId)

    if (isRunning) {
      clearCountdownInterval()
      pausedRef.current = { minutes: timer, seconds }
    }
    pastFirstNotchRef.current = false
    setDraftMinutes(null)
    setIsDragging(true)
    dragRef.current = {
      startPointer: { x: event.clientX, y: event.clientY },
      startDistance: { ...distance },
    }
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const surface = dragSurfaceRef.current
    if (surface?.hasPointerCapture(event.pointerId)) {
      surface.releasePointerCapture(event.pointerId)
    }
    if (!dragRef.current) return

    const paused = pausedRef.current
    const committedDraft = pastFirstNotchRef.current ? draftMinutes : null

    setIsDragging(false)
    dragRef.current = null
    setDistance({ x: 0, y: 0 })
    setTension(0)
    setDraftMinutes(null)
    pastFirstNotchRef.current = false

    if (paused) {
      if (committedDraft !== null && committedDraft > 0) {
        startTimer(committedDraft)
      } else {
        resumeTimer(paused.minutes, paused.seconds)
      }
      pausedRef.current = null
      return
    }

    if (committedDraft !== null && committedDraft > 0) {
      startTimer(committedDraft)
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return

    const rawDx = event.clientX - dragRef.current.startPointer.x
    const rawDy = event.clientY - dragRef.current.startPointer.y

    const {
      finalX,
      finalY,
      leverY,
      tension: nextTension,
      draftMinutes: nextDraftMinutes,
      pastFirstNotch,
    } = computeLeverPosition(rawDx, rawDy)

    pastFirstNotchRef.current = pastFirstNotch
    setTension(nextTension)

    if (pastFirstNotch) {
      setDraftMinutes(nextDraftMinutes)
    } else {
      setDraftMinutes(null)
      if (leverY <= 0 && !isRunning && !pausedRef.current) {
        countdownRef.current = { minutes: 0, seconds: 0 }
        setTimer(0)
      }
    }

    setDistance({ x: finalX, y: finalY })
  }

  return {
    isDragging,
    isRunning,
    isIdle,
    timer,
    seconds,
    draftMinutes,
    distance,
    tension,
    displayLabel,
    resetTimer,
    dragSurfaceRef,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
  }
}

export { usePomodoro }
