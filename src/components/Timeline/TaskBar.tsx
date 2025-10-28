import type { TimelineTask } from "./TimelineView.types";
import { calculatePosition } from "../../utils/position.utils";

// const
import { pixelPerDay } from "../../constants/timeline.constants";

const TaskBar = ({ task, minDate }: { task: TimelineTask; minDate?: Date }) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const workOfDays =
    (task.endDate.getTime() - task.startDate.getTime()) / msPerDay + 1;

  const offset = calculatePosition(task.startDate, minDate, pixelPerDay);
  console.log(
    "TaskBar",
    task.title,
    "days:",
    workOfDays,
    "widthPx:",
    workOfDays * pixelPerDay,
    "offset:",
    offset
  );
  return (
    <div
      className="absolute rounded shadow-sm hover:shadow-lg transition-shadow"
      style={{
        left: `${offset}px`,
        width: `${workOfDays * pixelPerDay}px`,
        top: "8px",
        height: task.isMilestone ? "24px" : "32px",
        backgroundColor: task.color || "#0ea5e9",
      }}
    >
      <div className="flex items-center justify-between h-full px-2">
        <span className="text-xs font-medium text-white truncate">
          {task.title}
        </span>
        {!task.isMilestone && (
          <span className="text-xs text-white opacity-75">
            {task.progress}%
          </span>
        )}
        {/* Progress bar overlay */}
        {!task.isMilestone && task.progress > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-white opacity-40 rounded-b"
            style={{ width: `${task.progress}%` }}
          />
        )}
        {/* Resize handles */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white
    opacity-0 hover:opacity-50"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white
    opacity-0 hover:opacity-50"
        />
      </div>
    </div>
  );
};

export default TaskBar;
