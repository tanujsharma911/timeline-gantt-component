import { useEffect } from 'react';
import type { TimelineTask } from '../types/timeline.types';

interface UseTaskResizeProps {
   taskRef: React.RefObject<HTMLDivElement> | null;
   refLeftHandle: React.RefObject<HTMLDivElement> | null;
   refRightHandle: React.RefObject<HTMLDivElement> | null;
   task: TimelineTask;
   pixelPerDay: number;
   updatedRowsWithTasks: (taskId: string, updatedTask: TimelineTask) => void;
   setTaskIdDetail: (id: string | null) => void;
}

export const useTaskResize = ({
   taskRef,
   refLeftHandle,
   refRightHandle,
   task,
   pixelPerDay,
   updatedRowsWithTasks,
   setTaskIdDetail,
}: UseTaskResizeProps) => {
   useEffect(() => {
      if (!taskRef || !refLeftHandle || !refRightHandle) return;
      const taskElement = taskRef.current;
      const leftHandle = refLeftHandle.current;
      const rightHandle = refRightHandle.current;

      if (!taskElement || !leftHandle || !rightHandle) return;

      const dragState = {
         startWidth: 0, // initial width of task bar
         startLeft: 0, // initial left position
         startX: 0, // initial mouse X position
         activeHandle: null as 'left' | 'right' | null, // which handle is being dragged
      };

      const onMouseMove = (e: MouseEvent) => {
         // how far mouse has moved since the drag started
         const deltaX = e.clientX - dragState.startX; // current horizontal mouse pos - initial mouse pos = difference in pixels

         if (dragState.activeHandle === 'left') {
            // Left Handle Logic
            const newWidth = dragState.startWidth - deltaX;
            const newLeft = dragState.startLeft + deltaX; // or Offset

            if (newWidth >= pixelPerDay) {
               // minimum width should be 1 day
               taskElement.style.width = `${newWidth}px`;
               taskElement.style.left = `${newLeft}px`;
            }
         } else if (dragState.activeHandle === 'right') {
            // Right Handle Logic
            const newWidth = dragState.startWidth + deltaX;

            if (newWidth >= pixelPerDay) {
               taskElement.style.width = `${newWidth}px`;
            }
         }
      };

      // When resizing stops
      const onMouseUp = () => {
         // Only run if a drag was active
         if (!dragState.activeHandle) return;

         const msPerDay = 1000 * 60 * 60 * 24; // milliseconds in a day
         const finalStyles = getComputedStyle(taskElement); // get final styles after drag

         if (dragState.activeHandle === 'left') {
            // Left Handle Logic: Calculate new Start Date
            const finalLeft = parseFloat(finalStyles.left);
            const deltaPixels = finalLeft - dragState.startLeft; // how much left handle moved in pixels
            const deltaDays = Math.round(deltaPixels / pixelPerDay); // convert pixels to days

            // If dragState.startLeft > finalLeft, deltaDays will be negative (moving left), else positive (moving right)

            // Calculate new start time from the original start date
            const deltaDaysInMs = deltaDays * msPerDay; // convert days to milliseconds
            const newStartTime = task.startDate.getTime() + deltaDaysInMs;
            const newStartDate = new Date(newStartTime);

            updatedRowsWithTasks(task.id, {
               ...task,
               startDate: newStartDate,
            });
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

         // Initialize drag state for left handle
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

         // Initialize drag state for right handle
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
};
