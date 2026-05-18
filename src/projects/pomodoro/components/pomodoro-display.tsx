import { Button } from "@/components/ui/button"

type PomodoroDisplayProps = {
  displayLabel: string
  isRunning: boolean
  onStop: () => void
}

const PomodoroDisplay = ({
  displayLabel,
  isRunning,
  onStop,
}: PomodoroDisplayProps) => (
  <div className="mb-16 text-center">
    <div
      className="mb-4 text-2xl font-bold transition-transform duration-300"
      style={{
        transform: isRunning ? "translateY(0px)" : "translateY(20px)",
      }}
    >
      {displayLabel}
    </div>
    <div>
      <Button
        onClick={onStop}
        className="cursor-pointer"
        style={
          isRunning
            ? {
                opacity: 1,
                transform: "translateY(0)",
                transition: "all 0.3s ease",
              }
            : {
                opacity: 0,
                transform: "translateY(-10px)",
              }
        }
      >
        Stop
      </Button>
    </div>
  </div>
)

export { PomodoroDisplay }
