import type {
  TimelineRowType,
  TimelineTask,
} from "../components/Timeline/TimelineView.types";

export function attachTasksToRows(
  rows: TimelineRowType[],
  tasks: Record<string, TimelineTask>
) {
  return rows.map((row) => ({
    ...row,
    tasks: row.tasks.map((taskId: string) => tasks[taskId]).filter(Boolean),
  }));
}
