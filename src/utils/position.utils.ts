
export const positionOfCurrentDate = (
  minDate: Date
): number => {
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysFromStartToToday = Math.floor(
     (today.getTime() - minDate.getTime()) / msPerDay
  );

  return daysFromStartToToday;
};

// Calculate pixel offset position from start date
export const calculatePosition = (
   date: Date,
   startDate: Date | undefined,
   pixelsPerDay: number
): number => {
   if (!startDate) return 0;
   const msPerDay = 1000 * 60 * 60 * 24;
   const daysSinceStart = (date.getTime() - startDate.getTime()) / msPerDay;
   return Math.round(daysSinceStart * pixelsPerDay);
};

// Calculate duration in pixels
export const calculateDuration = (
   startDate: Date,
   endDate: Date,
   pixelPerDay: number
): number => {
   const msPerDay = 1000 * 60 * 60 * 24;
   const workOfDays = (endDate.getTime() - startDate.getTime()) / msPerDay + 1;
   return workOfDays * pixelPerDay;
};

// calculate maximum number of days overlaping in row
export const calculateMaxOverlaps = (
   tasks: { startDate: Date; endDate: Date }[]
): number => {
   const events: { date: Date; type: 'start' | 'end' }[] = [];

   // flatten timeline into array of object {date, type: 'start' | 'end'}[]
   tasks.forEach((task) => {
      events.push({ date: task.startDate, type: 'start' });
      events.push({ date: task.endDate, type: 'end' });
   });

   // Sort events by date, with 'end' events before 'start' events on the same date
   events.sort((a, b) => {
      if (a.date.getTime() === b.date.getTime()) {
         return a.type === 'end' ? -1 : 1;
      }
      return a.date.getTime() - b.date.getTime();
   });

   let currentOverlaps = 0;
   let maxOverlaps = 0;

   events.forEach((event) => {
      if (event.type === 'start') {
         currentOverlaps++;
         maxOverlaps = Math.max(maxOverlaps, currentOverlaps);
      } else {
         currentOverlaps--;
      }
   });

   return maxOverlaps;
};
