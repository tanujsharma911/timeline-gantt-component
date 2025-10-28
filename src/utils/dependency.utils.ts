import type { TimelineTask } from "../components/Timeline/TimelineView.types";

// dependency.utils.ts
interface DependencyLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fromTaskId: string;
  toTaskId: string;
}
/**
 * Calculate dependency line coordinates
 */
export const calculateDependencyLine = (
  fromTask: TimelineTask,
  toTask: TimelineTask,
  fromPosition: { left: number; width: number; top: number },
  toPosition: { left: number; width: number; top: number }
): DependencyLine => {
  // Start from end of predecessor task
  const x1 = fromPosition.left + fromPosition.width;
  const y1 = fromPosition.top + 16; // middle of task bar
  // End at start of dependent task
  const x2 = toPosition.left;
  const y2 = toPosition.top + 16;
  return {
    x1,
    y1,
    x2,
    y2,
    fromTaskId: fromTask.id,
    toTaskId: toTask.id,
  };
};
/**
 * Get all dependencies for a task
 */
export const getTaskDependencies = (
  taskId: string,
  tasks: Record<string, TimelineTask>
): string[] => {
  const task = tasks[taskId];
  return task?.dependencies || [];
};
/**
 * Get all tasks that depend on this task
 */
export const getDependentTasks = (
  taskId: string,
  tasks: Record<string, TimelineTask>
): string[] => {
  return Object.values(tasks)
    .filter((task) => task.dependencies?.includes(taskId))
    .map((task) => task.id);
};
