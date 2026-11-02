import { PIVOT_X, PIVOT_Y } from "../utils"

type PointerHandler = (event: React.PointerEvent<HTMLDivElement>) => void

type PomodoroLeverProps = {
  isIdle: boolean
  isFinished: boolean
  onPointerDown: PointerHandler
  onPointerMove: PointerHandler
  onPointerUp: PointerHandler
  onLostPointerCapture: PointerHandler
}

const PomodoroLever = ({
  isIdle,
  isFinished,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onLostPointerCapture,
}: PomodoroLeverProps) => (
  <div aria-hidden>
    <span
      className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
      style={{ left: PIVOT_X, top: PIVOT_Y }}
    />
    <div
      className="pomodoro-cable pointer-events-none absolute bg-foreground"
      style={{ left: PIVOT_X, top: PIVOT_Y }}
    />
    <div
      className="pomodoro-knob absolute z-10 cursor-grab rounded-full bg-white shadow-[inset_0_0_0_1.5px_var(--foreground),0_8px_16px_-6px_oklch(0.2_0.02_300/0.45)] active:cursor-grabbing"
      style={{ left: PIVOT_X, top: PIVOT_Y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onLostPointerCapture={onLostPointerCapture}
    >
      {isIdle && (
        <span
          data-finished={isFinished}
          className="pomodoro-ring pointer-events-none absolute inset-0 rounded-full border-2 border-foreground opacity-50 motion-safe:animate-ping motion-reduce:hidden"
          style={{ animationDuration: "3s" }}
        />
      )}
    </div>
  </div>
)

export { PomodoroLever }
