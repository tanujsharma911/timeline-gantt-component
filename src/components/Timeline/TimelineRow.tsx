import TaskBar from "./TaskBar";

import type { TimelineTask } from "./TimelineView.types";

interface TimelineRowProps {
  row: {
    avatar?: string | undefined;
    label: string;
    id: string;
    tasks: TimelineTask[];
  };
  minDate?: Date;
}

const TimelineRow = ({ row, minDate }: TimelineRowProps) => {
  return (
    <div className="flex items-center w-full border-b border-gray-200 rounded">
      <div className="relative h-14">
        {row.tasks.map((task) => (
          <TaskBar key={task.id} task={task} minDate={minDate} />
        ))}
      </div>
    </div>
  );
};

export default TimelineRow;
