/** Pomodoro drag-to-set timer — see ./SPEC.md */
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PomodoroDisplay } from "./components/pomodoro-display"
import { PomodoroLever } from "./components/pomodoro-lever"
import { PomodoroNotchArcs } from "./components/pomodoro-notch-arcs"
import {
  CABLE_WIDTH_MAX,
  CABLE_WIDTH_MIN,
  LEVER_SIZE_MAX,
  LEVER_SIZE_MIN,
} from "./constant"
import { usePomodoro } from "./pomodoro.hook"
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from "./utils"
import "./pomodoro.css"

// iOS Safari only routes touch drags to the page where a native non-passive listener sits on a real box (React listens on the display:contents astro-island)
const blockTouchScroll = (dial: HTMLDivElement | null) => {
  const block = (event: TouchEvent) => event.preventDefault()
  dial?.addEventListener("touchmove", block, { passive: false })
  return () => dial?.removeEventListener("touchmove", block)
}

const PomodoroApp = () => {
  const pomodoro = usePomodoro()
  const { distance, tension } = pomodoro

  return (
    <div
      lang="en"
      className="flex h-full w-full flex-col items-center justify-center gap-8 px-2 pt-20 select-none min-[360px]:px-4 [@media(max-height:560px)]:flex-row [@media(max-height:560px)]:pt-4"
    >
      <h1 className="sr-only">Pomodoro Timer</h1>
      <PomodoroDisplay
        displayLabel={pomodoro.displayLabel}
        showsClock={pomodoro.showsClock}
        isFinished={pomodoro.isFinished}
        announcement={pomodoro.announcement}
      />

      <div className="glass flex w-full max-w-150 min-w-0 justify-center rounded-3xl pt-10 pb-3 [@media(max-height:560px)]:pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={pomodoro.resetTimer}
          className={cn(
            "absolute top-2.5 right-2.5 z-20 h-11 cursor-pointer px-4 font-display text-lg tracking-wider transition-opacity duration-200",
            !pomodoro.isRunning && "invisible opacity-0"
          )}
        >
          Stop
        </Button>
        <div
          ref={blockTouchScroll}
          data-dragging={pomodoro.isDragging}
          className="pomodoro-dial relative shrink-0 touch-none [-webkit-touch-callout:none]"
          style={
            {
              width: CONTAINER_WIDTH,
              height: CONTAINER_HEIGHT,
              "--lever-x": `${distance.x}px`,
              "--lever-y": `${distance.y}px`,
              "--lever-size": `${LEVER_SIZE_MAX - tension * (LEVER_SIZE_MAX - LEVER_SIZE_MIN)}px`,
              "--cable-width": `${CABLE_WIDTH_MAX - tension * (CABLE_WIDTH_MAX - CABLE_WIDTH_MIN)}px`,
            } as React.CSSProperties
          }
        >
          <PomodoroNotchArcs
            reachedMinutes={pomodoro.reachedMinutes}
            onSelect={pomodoro.selectNotch}
          />
          <PomodoroLever
            isIdle={pomodoro.isIdle}
            isFinished={pomodoro.isFinished}
            onPointerDown={pomodoro.handlePointerDown}
            onPointerMove={pomodoro.handlePointerMove}
            onPointerUp={pomodoro.handlePointerUp}
            onLostPointerCapture={pomodoro.handleLostPointerCapture}
          />
        </div>
      </div>
    </div>
  )
}

export { PomodoroApp }
