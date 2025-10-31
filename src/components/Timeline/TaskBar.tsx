import { useRef } from 'react';

// Import custom hooks
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useTaskResize } from '../../hooks/useTaskResize';

// Import zustand store
import { useTimelineZoom } from '../../store/useTimelineZoom';

import { calculatePosition } from '../../utils/position.utils';
import type { TimelineTask } from '../../types/timeline.types';

type TaskWithLevel = TimelineTask & {
   level: number;
};

interface TaskBarProps {
   task: TaskWithLevel;
   minDate?: Date;
   setTaskIdDetail: (id: string | null) => void;
   updatedRowsWithTasks: (taskId: string, updatedTask: TimelineTask) => void;
}

const TaskBar = ({
   task,
   minDate,
   setTaskIdDetail,
   updatedRowsWithTasks,
}: TaskBarProps) => {
   const { pixelPerDay } = useTimelineZoom();
   const taskRef = useRef<HTMLDivElement>(null!);
   const refLeftHandle = useRef<HTMLDivElement>(null!);
   const refRightHandle = useRef<HTMLDivElement>(null!);

   // Calculate position & width
   const offset = calculatePosition(task.startDate, minDate, pixelPerDay);
   const width =
      calculatePosition(task.endDate, task.startDate, pixelPerDay) +
      pixelPerDay;

   const { onDragStart, onDragOver } = useDragAndDrop(task.id);

   // Handle focus to show task details
   const handleOnClick = () => {
      setTaskIdDetail(task.id);
   };
   const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
         handleOnClick();
      }
   };

   //  resizing behavior to timeline task bars
   useTaskResize({
      taskRef,
      refLeftHandle,
      refRightHandle,
      task,
      pixelPerDay,
      updatedRowsWithTasks,
      setTaskIdDetail,
   });

   return (
      <div
         tabIndex={0}
         aria-label={`${task.title}. From ${task.startDate.toDateString()} to
         ${task.endDate.toDateString()}. Progress: ${task.progress}%.`}
         onClick={handleOnClick}
         onKeyDown={handleKeyDown}
         ref={taskRef}
         className="absolute rounded shadow-sm cursor-move hover:shadow-lg transition-shadow tabIndex-0 focus:outline-2 focus:outline-blue-500"
         style={{
            left: `${offset}px`,
            width: `${width}px`,
            top:
               task.level === 0
                  ? '8px'
                  : `${task.level * 32 + task.level * 16}px`,
            height: task.isMilestone ? '24px' : '32px',
            backgroundColor:
               task.progress === 100 ? '#a6a6a6' : task.color || '#0ea5e9',
            opacity: task.progress === 100 ? 0.5 : 1,
         }}
         draggable={true}
         onDragStart={onDragStart}
         onDragOver={onDragOver}
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
               ref={refLeftHandle}
            />
            <div
               className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white
  opacity-0 hover:opacity-50"
               ref={refRightHandle}
            />
         </div>
      </div>
   );
};

export default TaskBar;
