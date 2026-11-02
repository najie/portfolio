import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { BorderGlow } from "./react-bits"
import { cn } from "@/lib/utils"
import "./test-it-callout.css"

const TEXT = "Test it"
const VISIBLE_ENOUGH = 0.6
const REPLAY_MS = 10_000
const DESKTOP = "(min-width: 80rem)"
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

// Droplets shed as the letters clear, kept short so they stay on the glass: start spot in the word box, drift, colour, size, delay.
const SPECKS = [
  {
    x: "8%",
    y: "30%",
    dx: "-9px",
    dy: "-17px",
    c: "--pool-pink",
    s: 3,
    d: 250,
  },
  {
    x: "18%",
    y: "78%",
    dx: "-5px",
    dy: "13px",
    c: "--pool-lavender",
    s: 2,
    d: 380,
  },
  { x: "30%", y: "12%", dx: "3px", dy: "-20px", c: "--pool-sky", s: 4, d: 420 },
  {
    x: "42%",
    y: "64%",
    dx: "-2px",
    dy: "17px",
    c: "--pool-pink",
    s: 2,
    d: 560,
  },
  {
    x: "60%",
    y: "20%",
    dx: "6px",
    dy: "-15px",
    c: "--pool-lavender",
    s: 3,
    d: 640,
  },
  { x: "70%", y: "86%", dx: "8px", dy: "11px", c: "--pool-sky", s: 2, d: 720 },
  {
    x: "82%",
    y: "8%",
    dx: "11px",
    dy: "-13px",
    c: "--pool-pink",
    s: 3,
    d: 800,
  },
  { x: "94%", y: "52%", dx: "15px", dy: "-4px", c: "--pool-sky", s: 2, d: 880 },
]

// Desktop-only pointer to the project widgets: plays when the projects come into view, then replays every 10s while they stay in view.
const TestItCallout = ({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>
}) => {
  const [revealed, setRevealed] = useState(false)
  // bumping the key remounts the card, which restarts the CSS reveal and BorderGlow's mount sweep
  const [cycle, setCycle] = useState(0)
  const inView = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        // below xl the callout is hidden, so it never starts there
        inView.current =
          entry.intersectionRatio >= VISIBLE_ENOUGH &&
          matchMedia(DESKTOP).matches
        if (inView.current) setRevealed(true)
      },
      { threshold: [0, VISIBLE_ENOUGH] }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [sectionRef])

  useEffect(() => {
    if (!revealed || matchMedia(REDUCED_MOTION).matches) return
    const id = setInterval(() => {
      if (inView.current && !document.hidden) setCycle((c) => c + 1)
    }, REPLAY_MS)
    return () => clearInterval(id)
  }, [revealed])

  return (
    <div
      aria-hidden
      data-revealed={revealed || undefined}
      className="test-it pointer-events-none absolute top-1/2 left-full ml-8 hidden w-[min(26rem,calc((100vw-600px)/2-4rem))] -translate-y-1/2 xl:block"
    >
      {revealed && (
        <BorderGlow
          key={cycle}
          // only the first appearance slides the card in; replays keep it in place
          className={cn(
            "test-it-card glass w-fit",
            cycle === 0 && "test-it-card-in"
          )}
          backgroundColor="oklch(1 0 0 / 0.46)"
          fillOpacity={0.2}
          isDarkMode={false}
          borderRadius={30.8}
          edgeSensitivity={0}
          glowRadius={32}
          glowIntensity={0.5}
          coneSpread={10}
          animated={!matchMedia(REDUCED_MOTION).matches}
          colors={["#c084fc", "#f472b6", "#38bdf8"]}
        >
          {/* padded inside BorderGlow's clipping wrapper so the blur and droplets have room */}
          <div className="flex items-center gap-4 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-white shadow-xs">
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                className="test-it-arrow size-5"
              />
            </span>
            <span className="test-it-word" data-text={TEXT}>
              {[...TEXT].map((char, i) => (
                <span
                  key={i}
                  className="test-it-letter"
                  style={{ "--i": i } as CSSProperties}
                >
                  {char}
                </span>
              ))}
              {SPECKS.map((speck, i) => (
                <span
                  key={i}
                  className="test-it-speck"
                  style={
                    {
                      "--x": speck.x,
                      "--y": speck.y,
                      "--dx": speck.dx,
                      "--dy": speck.dy,
                      "--c": `var(${speck.c})`,
                      "--s": `${speck.s}px`,
                      "--d": `${speck.d}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </span>
          </div>
        </BorderGlow>
      )}
    </div>
  )
}

export { TestItCallout }
