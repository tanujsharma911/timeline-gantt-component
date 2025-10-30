import type { TimelineTask } from '../types/timeline.types';

// Generate date scale array
export const generateTimeScale = (
   startDate: Date = new Date(2025, 0, 1),
   endDate: Date = new Date(2025, 0, 31)
): Array<{ date: Date; label: string }> => {
   const scale: Array<{ date: Date; label: string }> = [];
   const msPerDay = 1000 * 60 * 60 * 24;

   // normalize start and end to midnight
   let currentTime = new Date(startDate).setHours(0, 0, 0, 0);
   const endTime = new Date(endDate).setHours(0, 0, 0, 0);

   while (currentTime <= endTime) {
      const currentDate = new Date(currentTime);

      scale.push({
         date: currentDate,
         label: currentDate.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
         }),
      });

      // add 1 full day safely using timestamp arithmetic
      currentTime += msPerDay;
   }

   return scale;
};

// Generate month array
export const generateMonthScale = (
   startDate: Date,
   endDate: Date
): Array<{ month: string; days: number; date: Date }> => {
   const scale: Array<{ month: string; days: number; date: Date }> = [];

   let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
   const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

   while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth();
      // const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      const monthName = current.toLocaleString('en-US', { month: 'short' });

      let daysInRange = new Date(monthEnd).getDate();

      // ✅ Adjust for first month (partial start)
      if (year === startDate.getFullYear() && month === startDate.getMonth()) {
         daysInRange = monthEnd.getDate() - startDate.getDate() + 1;
      }

      // ✅ Adjust for last month (partial end)
      if (year === endDate.getFullYear() && month === endDate.getMonth()) {
         daysInRange = endDate.getDate();
      }

      scale.push({
         month: monthName,
         days: daysInRange,
         date: new Date(year, month, 1),
      });

      // Move to next month
      current = new Date(year, month + 1, 1);
   }

   return scale;
};

// Takes all tasks and returns the overall min and max date range
export const getTimelineDateRange = (
   tasks: Record<string, TimelineTask>
): { minDate: Date; maxDate: Date } => {
   const allTasks = Object.values(tasks);

   if (allTasks.length === 0) {
      const today = new Date(2025, 0, 1);
      const maxDate = new Date(2025, 0, 31);
      return { minDate: today, maxDate: maxDate };
   }

   const msPerDay = 1000 * 60 * 60 * 24;

   const minTime = Math.min(...allTasks.map((t) => t.startDate.getTime()));
   const maxTime = Math.max(...allTasks.map((t) => t.endDate.getTime()));

   const extendedMaxDate = new Date(maxTime + 20 * msPerDay);

   return {
      minDate: new Date(minTime),
      maxDate: extendedMaxDate,
   };
};
