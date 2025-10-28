import type {
   TimelineRowType,
   TimelineTask,
} from '../components/Timeline/TimelineView.types';

export function attachTasksToRows(
   rows: TimelineRowType[],
   tasks: Record<string, TimelineTask>
) {
   console.log(
      'rows',
      rows,
      'tasks',
      tasks,
      'Task size:',
      Object.keys(tasks).length
   );
   const ans = rows.map((row) => ({
      ...row,
      tasks: row.tasks.map((taskId: string) => tasks[taskId]).filter(Boolean),
   }));

   console.log('Formatted Data:', ans);

   return ans;
}


export const calculateTaskLevels = (tasks: TimelineTask[]) => {
   if (!tasks || tasks.length === 0) {
      return [];
   }

   // 1. Sort tasks by their start date (most important step)
   const sortedTasks = [...tasks].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
   );

   const tasksWithLevels = [];

   // This array will track the 'endDate' of the last task in each lane
   const laneEndDates = [];

   for (const task of sortedTasks) {
      let foundLane = false;

      // 2. Find the first available lane
      for (let i = 0; i < laneEndDates.length; i++) {
         // Check if the current task can fit in this lane.
         // We check if the task's start is *after* the lane's last end date.
         // This assumes end dates are inclusive (e.g., a task ending on the 15th
         // overlaps with a task starting on the 15th).
         if (task.startDate.getTime() > laneEndDates[i].getTime()) {
            // This lane is free. Place the task here.
            laneEndDates[i] = task.endDate; // Update the lane's new end time
            tasksWithLevels.push({ ...task, level: i });
            foundLane = true;
            break; // Move to the next task
         }
      }

      // 3. If no available lane was found, create a new one
      if (!foundLane) {
         const newLevel = laneEndDates.length;
         laneEndDates.push(task.endDate); // Add a new lane with this task's end date
         tasksWithLevels.push({ ...task, level: newLevel });
      }
   }

   return tasksWithLevels;
};