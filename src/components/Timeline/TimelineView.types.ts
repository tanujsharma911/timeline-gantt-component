interface TimelineTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  assignee?: string;
  rowId: string; // which row/resource this belongs to
  dependencies?: string[]; // IDs of tasks this depends on
  color?: string;
  isMilestone?: boolean;
}
interface TimelineRowType {
  id: string;
  label: string;
  avatar?: string;
  tasks: string[]; // task IDs assigned to this row
}
interface TimelineViewProps {
  rows: TimelineRowType[];
  tasks: Record<string, TimelineTask>;
  startDate: Date;
  endDate: Date;
  viewMode: "day" | "week" | "month";
  onTaskUpdate: (taskId: string, updates: Partial<TimelineTask>) => void;
  onTaskMove: (taskId: string, newRowId: string, newStartDate: Date) => void;
}

export type { TimelineTask, TimelineRowType, TimelineViewProps };
