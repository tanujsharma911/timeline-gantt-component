import { useEffect, useState, useRef } from 'react';
import { CircleX } from 'lucide-react';
import type { TimelineTask } from '../../types/timeline.types';

import Button from '../primitives/Button';

interface TaskDetailSidebarProps {
   taskDetails: TimelineTask | null;
   handleSetTaskDetails?: (task: TimelineTask) => void;
   setTaskIdDetail: (id: string | null) => void;
   isOpen: boolean;
   deleteTask: (taskId: string) => void;
}

const TaskDetailSidebar = ({
   taskDetails,
   handleSetTaskDetails,
   setTaskIdDetail,
   isOpen,
   deleteTask,
}: TaskDetailSidebarProps) => {
   const [taskTitle, setTaskTitle] = useState<string | null>(null);
   const [taskProgress, setTaskProgress] = useState<number | null>(null);
   const closeBtnRef = useRef<HTMLButtonElement | null>(null);

   useEffect(() => {
      if (taskDetails) {
         setTaskTitle(taskDetails.title);
         setTaskProgress(taskDetails.progress);
      }
   }, [taskDetails]);

   const handleEdit = () => {
      if (taskDetails && handleSetTaskDetails) {
         taskDetails.title = taskTitle || taskDetails.title;
         taskDetails.progress = taskProgress || taskDetails.progress;
         handleSetTaskDetails({ ...taskDetails });
         setTaskIdDetail(null);
      }
   };
   const handleDelete = () => {
      if (taskDetails && deleteTask) {
         deleteTask(taskDetails.id);
         setTaskIdDetail(null);
      }
   };

   useEffect(() => {
      const timer = setTimeout(() => {
         closeBtnRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
   }, [isOpen, setTaskIdDetail]);

   return (
      <div
         role="dialog"
         aria-labelledby="title"
         className=" border border-gray-200 p-4"
         aria-hidden={taskDetails ? 'false' : 'true'}
      >
         <div className="flex justify-between items-center mb-4 relative">
            <h3 id="title" className="font-bold text-lg text-gray-500">
               Task Details
            </h3>
            <div>
               <button
                  className="p-2 hover:bg-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                  onClick={() => setTaskIdDetail(null)}
                  aria-label="Close Task Details Sidebar"
                  ref={closeBtnRef}
               >
                  <CircleX color="gray" />
               </button>
            </div>
         </div>
         {taskDetails ? (
            <div>
               <label htmlFor="task-title">Edit Task Title</label>
               <input
                  id="task-title"
                  type="text"
                  onChange={(e) => setTaskTitle(e.target.value)}
                  value={taskTitle || ''}
                  placeholder="Edit"
                  className="w-full bg-gray-100 py-1 px-4 mr-2 border border-gray-300 rounded"
               />
               <div className="flex gap-2 my-5 items-center">
                  <p className="bg-gray-100 px-2 py-1 border border-gray-300 rounded">
                     {taskDetails.startDate.toLocaleDateString()}
                  </p>
                  {' - '}
                  <p className="bg-gray-100 px-2 py-1 border border-gray-300 rounded">
                     {taskDetails.endDate.toLocaleDateString()}
                  </p>
               </div>
               <div>
                  <p>Progress: {taskProgress}%</p>
                  <input
                     type="range"
                     name="progress"
                     id="progress"
                     min="0"
                     max="100"
                     value={taskProgress || 0}
                     onChange={(e) => setTaskProgress(e.target.valueAsNumber)}
                  />
               </div>

               <Button
                  classNames="mt-4"
                  onClick={handleEdit}
                  label="Edit"
                  color="#3b82f6"
               />
               <Button
                  classNames="mt-4 ml-5"
                  onClick={handleDelete}
                  label="Delete"
                  color="#f64b3b"
               />
            </div>
         ) : (
            <p>No task selected</p>
         )}
      </div>
   );
};

export default TaskDetailSidebar;
