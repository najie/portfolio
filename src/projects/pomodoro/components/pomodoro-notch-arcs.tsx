import { TIMERS_NOTCHES } from "../constant"
import { getNotchArc, ORBIT_RADII, PIVOT_X, PIVOT_Y } from "../utils"

const PomodoroNotchArcs = () => (
  <>
    {TIMERS_NOTCHES.map((notch, i) => {
      const arc = getNotchArc(ORBIT_RADII[i])
      return (
        <div
          key={notch}
          className="pointer-events-none absolute rounded-b-full"
          style={{
            width: arc.width,
            height: arc.height,
            left: PIVOT_X - arc.width / 2,
            top: PIVOT_Y + arc.top,
            borderWidth: "0 3px 3px 3px",
            borderStyle: "dotted",
            borderColor: "transparent",
            borderBottomColor: "var(--color-border)",
          }}
        >
          <p className="absolute bottom-0 w-full text-center text-xs text-mist-300">
            {notch}
          </p>
        </div>
      )
    })}
  </>
)

export { PomodoroNotchArcs }
