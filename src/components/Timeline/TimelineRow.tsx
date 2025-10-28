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
}

const TimelineRow = ({ row, minDate }: TimelineRowProps) => {
   const { onDrop, onDragOver } = useDragAndDrop(undefined, row.id);
   const maxOverlaps = calculateMaxOverlaps(row.tasks);
   console.log('Max overlaps for row', row.id, ':', maxOverlaps);

   const tasksWithLevels = useMemo(
      () => calculateTaskLevels(row.tasks),
      [row.tasks]
   );

   console.log('Tasks with levels for row', tasksWithLevels);

   return (
      <div
         className=" h-full w-full border-b border-gray-200 rounded bg-transparent"
         onDrop={onDrop}
         onDragOver={onDragOver}
      >
         <div className="relative h-14">
            {tasksWithLevels.map((task) => (
               <TaskBar key={task.id} task={task} minDate={minDate} />
            ))}
         </div>
         <div style={{ height: `${(maxOverlaps - 1) * 56}px` }} />
      </div>
   );
};

export default TimelineRow;
