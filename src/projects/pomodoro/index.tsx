/** Pomodoro drag-to-set timer — see ./SPEC.md */
import { PomodoroDisplay } from "./components/pomodoro-display"
import { PomodoroLever } from "./components/pomodoro-lever"
import { PomodoroNotchArcs } from "./components/pomodoro-notch-arcs"
import { usePomodoro } from "./pomodoro.hook"
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from "./utils"

const PomodoroApp = () => {
  const pomodoro = usePomodoro()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <PomodoroDisplay
        displayLabel={pomodoro.displayLabel}
        isRunning={pomodoro.isRunning}
        onStop={pomodoro.resetTimer}
      />

      <div
        ref={pomodoro.dragSurfaceRef}
        className="relative touch-none"
        style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
        onPointerMove={pomodoro.handlePointerMove}
        onPointerUp={pomodoro.handlePointerUp}
        onPointerCancel={pomodoro.handlePointerUp}
      >
        <PomodoroNotchArcs />
        <PomodoroLever
          isDragging={pomodoro.isDragging}
          isIdle={pomodoro.isIdle}
          distance={pomodoro.distance}
          tension={pomodoro.tension}
          onPointerDown={pomodoro.handlePointerDown}
        />
      </div>
    </div>
  )
}

export { PomodoroApp }
