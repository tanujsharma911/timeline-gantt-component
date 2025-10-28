import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useMemo } from 'react';

import TaskBar from './TaskBar';

import type { TimelineTask } from './TimelineView.types';
import { calculateMaxOverlaps } from '../../utils/position.utils';
import { calculateTaskLevels } from '../../utils/formatting.utils';

interface TimelineRowProps {
   row: {
      avatar?: string | undefined;
      label: string;
      id: string;
      tasks: TimelineTask[];
   };
   minDate?: Date;
   setTaskIdDetail: (id: string | null) => void;
   updatedData: (taskId: string, updatedTask: TimelineTask) => void;
}

const TimelineRow = ({
   row,
   minDate,
   setTaskIdDetail,
   updatedData,
}: TimelineRowProps) => {
   const { onDrop, onDragOver } = useDragAndDrop(undefined, row.id);
   const maxOverlaps = calculateMaxOverlaps(row.tasks);

   const tasksWithLevels = useMemo(
      () => calculateTaskLevels(row.tasks),
      [row.tasks]
   );

   return (
      <div
         className=" h-full w-full ring ring-gray-300 bg-transparent"
         onDrop={onDrop}
         onDragOver={onDragOver}
      >
         <div className="relative" style={{ height: `${maxOverlaps * 56}px` }}>
            {tasksWithLevels.map((task) => (
               <TaskBar
                  key={task.id}
                  task={task}
                  minDate={minDate}
                  setTaskIdDetail={setTaskIdDetail}
                  updatedData={updatedData}
               />
            ))}
         </div>
      </div>
   );
};

export default TimelineRow;
