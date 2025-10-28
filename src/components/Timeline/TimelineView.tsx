import TimelineRow from "./TimelineRow";
import TaskDetailSidebar from "./TaskDetailSidebar";
import TimelineLabel from "./TimelineLabel";

import type { TimelineRowType, TimelineTask } from "./TimelineView.types";

import { attachTasksToRows } from "../../utils/formatting.utils";
import {
  getTimelineDateRange,
  generateTimeScale,
  generateMonthScale,
} from "../../utils/date.utils";

import { pixelPerDay } from "../../constants/timeline.constants";

const TimelineView = () => {
  const sampleRows: TimelineRowType[] = [
    {
      id: "row-1",
      label: "Frontend Team",
      avatar: "/avatars/frontend.png",
      tasks: ["task-1", "task-2"],
    },
    {
      id: "row-2",
      label: "Backend Team",
      avatar: "/avatars/backend.png",
      tasks: ["task-3"],
    },
    {
      id: "row-3",
      label: "Design Team",
      avatar: "/avatars/design.png",
      tasks: ["task-4"],
    },
  ];
  const sampleTasks: Record<string, TimelineTask> = {
    "task-1": {
      id: "task-1",
      title: "UI Component Development",
      startDate: new Date(2025, 9, 1),
      endDate: new Date(2025, 9, 15),
      progress: 60,
      assignee: "Frontend Team",
      rowId: "row-1",
      dependencies: [],
      color: "#3b82f6",
      isMilestone: false,
    },
    // "task-2": {
    //   id: "task-2",
    //   title: "Integration Testing",
    //   startDate: new Date(2024, 0, 16),
    //   endDate: new Date(2024, 0, 25),
    //   progress: 0,
    //   assignee: "Frontend Team",
    //   rowId: "row-1",
    //   dependencies: ["task-1", "task-3"],
    //   color: "#3b82f6",
    //   isMilestone: false,
    // },
    "task-3": {
      id: "task-3",
      title: "API Development",
      startDate: new Date(2025, 9, 1),
      endDate: new Date(2025, 9, 14),
      progress: 80,
      assignee: "Backend Team",
      rowId: "row-2",
      dependencies: [],
      color: "#10b981",
      isMilestone: false,
    },
    "task-4": {
      id: "task-4",
      title: "Design System Update",
      startDate: new Date(2025, 9, 5),
      endDate: new Date(2025, 9, 20),
      progress: 100,
      assignee: "Design Team",
      rowId: "row-3",
      dependencies: [],
      color: "#f59e0b",
      isMilestone: false,
    },
  };

  // Rearranging tasks into their respective rows
  const rowsWithFullTasks = attachTasksToRows(sampleRows, sampleTasks);
  console.log(rowsWithFullTasks);

  // Determine timeline date range
  const { minDate, maxDate } = getTimelineDateRange(sampleTasks);

  // Determine offset for today line
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysFromStartToToday = Math.floor(
    (today.getTime() - minDate.getTime()) / msPerDay
  );
  console.log("Days from start to today:", daysFromStartToToday);

  // Create list of days
  const arr: Array<{ date: Date; label: string }> = generateTimeScale(
    minDate,
    maxDate
  );
  console.log(arr);

  // Create list of months
  const monthArr = generateMonthScale(minDate, maxDate);
  console.log(monthArr);

  return (
    <div className="flex h-[500px] border border-gray-300 rounded overflow-hidden">
      <TaskDetailSidebar />

      <div className="w-full overflow-scroll">
        <div className="flex flex-col gap-2 w-fit rounded bg-white">
          <div className="overflow-x-auto relative border-b border-gray-300">
            <div
              className="h-full w-[2px] bottom-0 bg-rose-200 z-0 absolute"
              style={{
                left: `${
                  daysFromStartToToday * pixelPerDay + pixelPerDay / 2
                }px`,
              }}
            />

            <TimelineLabel monthArr={monthArr} dateArr={arr} />

            {rowsWithFullTasks.map((row) => (
              <TimelineRow key={row.id} row={row} minDate={minDate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
