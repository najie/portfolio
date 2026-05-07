import { useEffect, useRef, useState } from "react"

const BREAKPOINTS = {
  md: 768,
  lg: 1024,
} as const

const DEBOUNCE_MS = 150

function getDevice(width: number) {
  return {
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
  }
}

function useDevice() {
  const [device, setDevice] = useState(() =>
    typeof window !== "undefined"
      ? getDevice(window.innerWidth)
      : { isMobile: false, isTablet: false, isDesktop: true }
  )
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const update = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        setDevice(getDevice(window.innerWidth))
      }, DEBOUNCE_MS)
    }

    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("resize", update)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return device
}

export { useDevice }
