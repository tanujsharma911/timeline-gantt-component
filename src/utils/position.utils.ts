// Calculate pixel position from date

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
