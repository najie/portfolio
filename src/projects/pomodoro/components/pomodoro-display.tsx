import { cn } from "@/lib/utils"

type PomodoroDisplayProps = {
  displayLabel: string
  showsClock: boolean
  isFinished: boolean
  announcement: string
}

const PomodoroDisplay = ({
  displayLabel,
  showsClock,
  isFinished,
  announcement,
}: PomodoroDisplayProps) => (
  <div className="flex h-[min(24vw,10rem)] min-h-20 shrink-0 items-end justify-center text-center [@media(max-height:560px)]:h-auto [@media(max-height:560px)]:w-[45%]">
    <p
      role="timer"
      className={cn(
        "font-display leading-[0.85] tracking-wide whitespace-nowrap tabular-nums",
        showsClock
          ? "text-[min(23vw,10rem)] [@media(max-height:560px)]:text-[24vh]"
          : "text-5xl sm:text-6xl",
        isFinished && "text-accent-ink"
      )}
    >
      {displayLabel}
    </p>
    <p aria-live="polite" className="sr-only">
      {announcement}
    </p>
  </div>
)

export { PomodoroDisplay }
