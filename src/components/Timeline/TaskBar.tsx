import type { TimelineTask } from '../../types/timeline.types';

import { calculatePosition } from '../../utils/position.utils';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

// import { pixelPerDay } from '../../constants/timeline.constants';
import { useTimelineZoom } from '../../store/useTimelineZoom';

import { useEffect, useRef } from 'react';

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
   const taskRef = useRef<HTMLDivElement | null>(null);
   const refLeftHandle = useRef<HTMLDivElement | null>(null);
   const refRightHandle = useRef<HTMLDivElement | null>(null);

   // Calculate duration of task in days
   const msPerDay = 1000 * 60 * 60 * 24;
   const workOfDays =
      (task.endDate.getTime() - task.startDate.getTime()) / msPerDay + 1;

   // Calculate position
   const offset = calculatePosition(task.startDate, minDate, pixelPerDay);

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

   //  Edit task resizing logic
   useEffect(() => {
      const taskElement = taskRef.current;
      const leftHandle = refLeftHandle.current;
      const rightHandle = refRightHandle.current;

      if (!taskElement || !leftHandle || !rightHandle) return;

      const dragState = {
         startWidth: 0,
         startLeft: 0,
         startX: 0,
         activeHandle: null as 'left' | 'right' | null,
      };

      const onMouseMove = (e: MouseEvent) => {
         const deltaX = e.clientX - dragState.startX;

         if (dragState.activeHandle === 'left') {
            const newWidth = dragState.startWidth - deltaX;
            const newLeft = dragState.startLeft + deltaX;

            if (newWidth >= pixelPerDay) {
               taskElement.style.width = `${newWidth}px`;
               taskElement.style.left = `${newLeft}px`;
            }
         } else if (dragState.activeHandle === 'right') {
            const newWidth = dragState.startWidth + deltaX;
            if (newWidth >= pixelPerDay) {
               taskElement.style.width = `${newWidth}px`;
            }
         }
      };

      const onMouseUp = () => {
         // Only run if a drag was active
         if (!dragState.activeHandle) return;

         const msPerDay = 1000 * 60 * 60 * 24;
         const finalStyles = getComputedStyle(taskElement);

         if (dragState.activeHandle === 'left') {
            // Left Handle Logic: Calculate new Start Date
            const finalLeft = parseFloat(finalStyles.left);
            const deltaPixels = finalLeft - dragState.startLeft;
            const deltaDays = Math.round(deltaPixels / pixelPerDay);

            // Calculate new start time from the original start date
            const newStartTime =
               task.startDate.getTime() + deltaDays * msPerDay;
            const newStartDate = new Date(newStartTime);

            updatedRowsWithTasks(task.id, { ...task, startDate: newStartDate });
         } else if (dragState.activeHandle === 'right') {
            // Right Handle Logic: Calculate new End Date
            const finalWidth = parseFloat(finalStyles.width);
            const deltaPixels = finalWidth - dragState.startWidth;
            const deltaDays = Math.round(deltaPixels / pixelPerDay);

            // Calculate new end time from the original end date
            const newEndTime = task.endDate.getTime() + deltaDays * msPerDay;
            const newEndDate = new Date(newEndTime);

            updatedRowsWithTasks(task.id, { ...task, endDate: newEndDate });
         }

         dragState.activeHandle = null;
         window.removeEventListener('mousemove', onMouseMove);
         window.removeEventListener('mouseup', onMouseUp);
         setTimeout(() => setTaskIdDetail(null), 50);
      };

      const onMouseDownLeft = (e: MouseEvent) => {
         e.preventDefault();
         e.stopPropagation();

         const styles = getComputedStyle(taskElement);
         dragState.startWidth = parseFloat(styles.width);
         dragState.startLeft = parseFloat(styles.left);
         dragState.startX = e.clientX;
         dragState.activeHandle = 'left';

         window.addEventListener('mousemove', onMouseMove);
         window.addEventListener('mouseup', onMouseUp);
      };

      const onMouseDownRight = (e: MouseEvent) => {
         e.preventDefault();
         e.stopPropagation();

         const styles = getComputedStyle(taskElement);
         dragState.startWidth = parseFloat(styles.width);
         dragState.startLeft = parseFloat(styles.left);
         dragState.startX = e.clientX;
         dragState.activeHandle = 'right';

         window.addEventListener('mousemove', onMouseMove);
         window.addEventListener('mouseup', onMouseUp);
      };

      leftHandle.addEventListener('mousedown', onMouseDownLeft);
      rightHandle.addEventListener('mousedown', onMouseDownRight);

      return () => {
         leftHandle.removeEventListener('mousedown', onMouseDownLeft);
         rightHandle.removeEventListener('mousedown', onMouseDownRight);

         window.removeEventListener('mousemove', onMouseMove);
         window.removeEventListener('mouseup', onMouseUp);
      };
   }, [
      taskRef,
      refLeftHandle,
      refRightHandle,
      task.startDate,
      task.endDate,
      pixelPerDay,
   ]);

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
            width: `${workOfDays * pixelPerDay}px`,
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
