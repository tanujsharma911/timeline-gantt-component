import { create } from 'zustand';
import type { TimelineTask } from '../components/Timeline/TimelineView.types';

interface TimelineDataState {
   data: {
      tasks: TimelineTask[];
      id: string;
      label: string;
      avatar?: string | undefined;
   }[];
   setData: (
      data: {
         tasks: TimelineTask[];
         id: string;
         label: string;
         avatar?: string | undefined;
      }[]
   ) => void;
   moveTask: (taskId: string, newRowId: string) => void;
   updatedData: (taskId: string, task: Partial<TimelineTask>) => void;
   deleteTask: (taskId: string) => void;
}

export const useTimelineDataStore = create<TimelineDataState>((set) => ({
   data: [],

   setData: (data) => set({ data }),

   moveTask: (taskId, newRowId) =>
      set((state) => {
         // Create copy
         const updatedData = [...state.data];

         //  Find the source row containing the task
         const sourceRowIndex = updatedData.findIndex((row) =>
            row.tasks.some((t) => t.id === taskId)
         );
         if (sourceRowIndex === -1) return state;

         // Find the target row
         const targetRowIndex = updatedData.findIndex(
            (row) => row.id === newRowId
         );
         if (targetRowIndex === -1) return state;

         // Get the task to move
         const taskToMove = updatedData[sourceRowIndex].tasks.find(
            (t) => t.id === taskId
         );
         if (!taskToMove) return state;

         updatedData[sourceRowIndex].tasks = updatedData[
            sourceRowIndex
         ].tasks.filter((t) => t.id !== taskId);

         const movedTask = { ...taskToMove, rowId: newRowId };
         updatedData[targetRowIndex].tasks = [
            ...updatedData[targetRowIndex].tasks,
            movedTask,
         ];

         return { data: updatedData };
      }),
   updatedData: (taskId, taskUpdate) => {
      set((state) => {
         // 1. Create a new `data` (rows) array
         const newData = state.data.map((row) => {
            // 2. Find the index of the task in this row
            const taskIndex = row.tasks.findIndex((t) => t.id === taskId);

            // 3. If the task isn't in this row, return the original row
            if (taskIndex === -1) {
               return row;
            }

            // 4. If the task IS in this row, we must create a new row

            // 5. First, create a new `tasks` array
            const newTasks = row.tasks.map((oldTask, index) => {
               // If this isn't the task we're updating, return the old task
               if (index !== taskIndex) {
                  return oldTask;
               }

               // 6. This is the one! Return a new task object
               return {
                  ...oldTask,
                  ...taskUpdate, // Apply the partial updates
               };
            });

            // 7. Return the new row object with the new tasks array
            return {
               ...row,
               tasks: newTasks,
            };
         });

         // 8. Return the new state
         return { data: newData };
      });
   },
   deleteTask: (taskId) => {
      set((state) => {
         const newData = state.data.map((row) => {
            return {
               ...row,
               tasks: row.tasks.filter((task) => task.id !== taskId),
            };
         });
         return { data: newData };
      });
   },
}));
