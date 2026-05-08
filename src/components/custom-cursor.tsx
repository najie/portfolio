import { useEffect, useRef, useState } from "react"

import "@/styles/cursor.css"

const pointerTargetSelector = [
  "a",
  "button",
  '[role="button"]',
  'input[type="submit"]',
  "select",
  "label",
  '[data-cursor="pointer"]',
].join(", ")

const textTargetSelector = [
  'input[type="text"]',
  'input[type="email"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="url"]',
  'input[type="tel"]',
  'input[type="number"]',
  "input:not([type])",
  "textarea",
  '[contenteditable="true"]',
].join(", ")

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const positionRef = useRef({ x: -100, y: -100 })

  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [isTextTarget, setIsTextTarget] = useState(false)
  const [isFinePointer, setIsFinePointer] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)")
    const updateFinePointer = () => setIsFinePointer(mediaQuery.matches)
    updateFinePointer()
    mediaQuery.addEventListener("change", updateFinePointer)
    return () => mediaQuery.removeEventListener("change", updateFinePointer)
  }, [])

  useEffect(() => {
    if (!isFinePointer) return

    const updatePosition = () => {
      if (!cursorRef.current) return
      const { x, y } = positionRef.current
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frameRef.current = null
    }

    const queuePositionUpdate = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(updatePosition)
    }

    const handleMouseMove = (event: MouseEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY }
      setIsVisible(true)
      queuePositionUpdate()
    }

    const updateHoverState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        setIsPointer(false)
        setIsTextTarget(false)
        return
      }

      const textMatch = target.closest(textTargetSelector)
      const pointerMatch = target.closest(pointerTargetSelector)

      setIsTextTarget(Boolean(textMatch))
      setIsPointer(Boolean(pointerMatch) && !textMatch)
    }

    const handleMouseOver = (event: MouseEvent) => {
      updateHoverState(event.target)
    }

    const handleMouseOut = (event: MouseEvent) => {
      const nextTarget = event.relatedTarget
      updateHoverState(nextTarget)
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)
    const handleMouseLeaveWindow = () => setIsVisible(false)
    const handleMouseEnterWindow = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    document.documentElement.addEventListener(
      "mouseleave",
      handleMouseLeaveWindow
    )
    document.documentElement.addEventListener(
      "mouseenter",
      handleMouseEnterWindow
    )

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeaveWindow
      )
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnterWindow
      )
    }
  }, [isFinePointer])

  if (!isFinePointer) return null

  const hidden = !isVisible || isTextTarget
  const dotScale = isPressed ? 0.68 : 1
  const ringScale = isPointer ? 1 : 0.15
  const ringOpacity = isPointer ? 0.7 : 0

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`custom-cursor ${hidden ? "is-hidden" : ""}`}
    >
      <span
        className="custom-cursor-ring"
        style={{
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <span
        className="custom-cursor-dot"
        style={{ transform: `translate(-50%, -50%) scale(${dotScale})` }}
      />
    </div>
  )
}

export { CustomCursor }
