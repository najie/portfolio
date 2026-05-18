import {
  CABLE_WIDTH_MAX,
  CABLE_WIDTH_MIN,
  LEVER_SIZE_MAX,
  LEVER_SIZE_MIN,
} from "../constant"
import { PIVOT_X, PIVOT_Y } from "../utils"

type PomodoroLeverProps = {
  isDragging: boolean
  isIdle: boolean
  distance: { x: number; y: number }
  tension: number
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
}

const PomodoroLever = ({
  isDragging,
  isIdle,
  distance,
  tension,
  onMouseDown,
}: PomodoroLeverProps) => (
  <>
    {isDragging && (
      <div
        className="pointer-events-none absolute bg-mist-600 transition-[height] duration-50"
        style={{
          width: Math.sqrt(distance.x ** 2 + distance.y ** 2),
          height:
            CABLE_WIDTH_MAX - tension * (CABLE_WIDTH_MAX - CABLE_WIDTH_MIN),
          left: PIVOT_X,
          top: PIVOT_Y,
          transform: `rotate(${Math.atan2(distance.y, distance.x) * (180 / Math.PI)}deg)`,
          transformOrigin: "0 50%",
        }}
      />
    )}
    {isIdle && (
      <div
        className="pointer-events-none absolute"
        style={{
          width: LEVER_SIZE_MAX,
          height: LEVER_SIZE_MAX,
          left: PIVOT_X,
          top: PIVOT_Y,
          transform: `translate(calc(-50% + ${distance.x}px), calc(-50% + ${distance.y}px))`,
        }}
      >
        <span
          className="absolute inset-0 rounded-full border-2 border-mist-600 opacity-75 motion-safe:animate-ping motion-reduce:animate-none"
          style={{ animationDuration: "3s" }}
        />
      </div>
    )}
    <div
      className="absolute cursor-grab rounded-full border-2 border-mist-600 bg-white shadow-sm shadow-mist-600 transition-[width,height] duration-50 active:cursor-grabbing"
      style={{
        width: LEVER_SIZE_MAX - tension * (LEVER_SIZE_MAX - LEVER_SIZE_MIN),
        height: LEVER_SIZE_MAX - tension * (LEVER_SIZE_MAX - LEVER_SIZE_MIN),
        left: PIVOT_X,
        top: PIVOT_Y,
        transform: `translate(calc(-50% + ${distance.x}px), calc(-50% + ${distance.y}px))`,
      }}
      onMouseDown={onMouseDown}
    />
  </>
)

export { PomodoroLever }
