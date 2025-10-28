import { useTimelineDataStore } from '../store/useTimelineDataStore';

export const useDragAndDrop = (
   taskId: string | undefined = undefined,
   rowId: string | undefined = undefined
) => {
   const { moveTask } = useTimelineDataStore();

   const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      if (!taskId) return;
      e.dataTransfer.setData('task', taskId);
      e.dataTransfer.effectAllowed = 'move';

      console.log('Drag started for task:', taskId);
   };

   const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); // important to allow dropping
   };

   const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      if (!rowId || !moveTask) return;
      const taskId = e.dataTransfer.getData('task');
      console.log('Dropped task:', taskId, 'on row:', rowId);

      moveTask(taskId, rowId);
   };

   return {
      onDragStart,
      onDragOver,
      onDrop,
   };
};
