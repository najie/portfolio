import { useCallback, useRef, useState } from "react"
import { computeLeverPosition, getDisplayLabel } from "./utils"

const usePomodoro = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [draftMinutes, setDraftMinutes] = useState<number | null>(null)
  const [distance, setDistance] = useState({ x: 0, y: 0 })
  const [tension, setTension] = useState(0)

  const dragRef = useRef<{
    startMouse: { x: number; y: number }
    startDistance: { x: number; y: number }
  } | null>(null)
  const secondsIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const pausedRef = useRef<{ minutes: number; seconds: number } | null>(null)
  const pastFirstNotchRef = useRef(false)

  const isIdle = !isDragging && !isRunning
  const displayLabel = getDisplayLabel({
    isRunning,
    isDragging,
    timer,
    seconds,
    draftMinutes,
  })

  const clearCountdownInterval = () => {
    if (secondsIntervalRef.current) {
      clearInterval(secondsIntervalRef.current)
      secondsIntervalRef.current = undefined
    }
  }

  const runCountdownInterval = useCallback(() => {
    clearCountdownInterval()
    secondsIntervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 0) {
          setTimer((t) => t - 1)
          return 59
        }
        return s - 1
      })
    }, 1000)
  }, [])

  const resetTimer = () => {
    clearCountdownInterval()
    pausedRef.current = null
    pastFirstNotchRef.current = false
    setTimer(0)
    setSeconds(0)
    setDraftMinutes(null)
    setIsRunning(false)
    setDistance({ x: 0, y: 0 })
    setTension(0)
  }

  const startTimer = useCallback(
    (initialMinutes: number) => {
      clearCountdownInterval()
      pausedRef.current = null
      pastFirstNotchRef.current = false
      setDistance({ x: 0, y: 0 })
      setTension(0)
      setDraftMinutes(null)
      setTimer(initialMinutes)
      setSeconds(0)
      setIsRunning(true)
      runCountdownInterval()
    },
    [runCountdownInterval]
  )

  const resumeTimer = useCallback(
    (minutes: number, seconds: number) => {
      clearCountdownInterval()
      pausedRef.current = null
      pastFirstNotchRef.current = false
      setDraftMinutes(null)
      setTimer(minutes)
      setSeconds(seconds)
      setIsRunning(true)
      runCountdownInterval()
    },
    [runCountdownInterval]
  )

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (isRunning) {
      clearCountdownInterval()
      pausedRef.current = { minutes: timer, seconds }
    }
    pastFirstNotchRef.current = false
    setDraftMinutes(null)
    setIsDragging(true)
    dragRef.current = {
      startMouse: { x: event.clientX, y: event.clientY },
      startDistance: { ...distance },
    }
  }

  const handleMouseUp = () => {
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

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current) return

    const rawDx = event.clientX - dragRef.current.startMouse.x
    const rawDy = event.clientY - dragRef.current.startMouse.y

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
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  }
}

export { usePomodoro }
