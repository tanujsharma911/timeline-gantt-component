import type {
   TimelineRowType,
   TimelineTask,
} from '../components/Timeline/TimelineView.types';

export function attachTasksToRows(
   rows: TimelineRowType[],
   tasks: Record<string, TimelineTask>
) {
   const ans = rows.map((row) => ({
      ...row,
      tasks: row.tasks.map((taskId: string) => tasks[taskId]).filter(Boolean),
   }));

   return ans;
}

export const calculateTaskLevels = (tasks: TimelineTask[]) => {
   if (!tasks || tasks.length === 0) {
      return [];
   }

   const sortedTasks = [...tasks].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
   );

   const tasksWithLevels = [];

   const laneEndDates = [];

   for (const task of sortedTasks) {
      let foundLane = false;

      for (let i = 0; i < laneEndDates.length; i++) {
         if (task.startDate.getTime() > laneEndDates[i].getTime()) {
            laneEndDates[i] = task.endDate; 
            tasksWithLevels.push({ ...task, level: i });
            foundLane = true;
            break; 
         }
      }

      if (!foundLane) {
         const newLevel = laneEndDates.length;
         laneEndDates.push(task.endDate); 
         tasksWithLevels.push({ ...task, level: newLevel });
      }
   }

   return tasksWithLevels;
};
