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
         if (targetRowIndex === -1) return state; // invalid target row

         // Get the task to move
         const taskToMove = updatedData[sourceRowIndex].tasks.find(
            (t) => t.id === taskId
         );
         if (!taskToMove) return state;

         // 5️⃣ Remove task from old row
         updatedData[sourceRowIndex].tasks = updatedData[
            sourceRowIndex
         ].tasks.filter((t) => t.id !== taskId);

         // 6️⃣ Update its rowId and add to new row
         const movedTask = { ...taskToMove, rowId: newRowId };
         updatedData[targetRowIndex].tasks = [
            ...updatedData[targetRowIndex].tasks,
            movedTask,
         ];

         // 7️⃣ Return updated state
         return { data: updatedData };
      }),
}));
