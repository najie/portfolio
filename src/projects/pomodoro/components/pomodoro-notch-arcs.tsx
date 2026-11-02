import { TIMERS_NOTCHES } from "../constant"
import { getNotchArc, ORBIT_RADII, PIVOT_X, PIVOT_Y } from "../utils"
import { cn } from "@/lib/utils"

type PomodoroNotchArcsProps = {
  reachedMinutes: number
  onSelect: (minutes: number) => void
}

const PomodoroNotchArcs = ({
  reachedMinutes,
  onSelect,
}: PomodoroNotchArcsProps) => (
  <>
    <svg
      aria-hidden
      width="1"
      height="1"
      className="pointer-events-none absolute overflow-visible"
      style={{ left: PIVOT_X, top: PIVOT_Y }}
    >
      {TIMERS_NOTCHES.map((notch, i) => {
        const { semicircleRadius: sr, centerY } = getNotchArc(ORBIT_RADII[i])
        return (
          <path
            key={notch}
            d={`M ${-sr} ${centerY} A ${sr} ${sr} 0 0 0 ${sr} ${centerY}`}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="0 8"
            className={cn(
              "transition-[stroke] duration-200",
              notch <= reachedMinutes
                ? "stroke-foreground"
                : "stroke-muted-foreground/60"
            )}
          />
        )
      })}
    </svg>
    {TIMERS_NOTCHES.map((notch, i) => (
      <button
        key={notch}
        type="button"
        aria-label={`Start a ${notch} minute timer`}
        onClick={() => onSelect(notch)}
        className={cn(
          "absolute z-[5] h-7 min-w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/85 px-2 font-display text-base tracking-wider tabular-nums shadow-xs transition-colors duration-200 hover:bg-white hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          notch <= reachedMinutes ? "text-foreground" : "text-muted-foreground"
        )}
        style={{ left: PIVOT_X, top: PIVOT_Y + ORBIT_RADII[i] }}
      >
        {notch}
      </button>
    ))}
  </>
)

export { PomodoroNotchArcs }
