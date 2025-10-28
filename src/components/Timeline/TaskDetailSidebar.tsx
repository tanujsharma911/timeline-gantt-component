import { useEffect, useState } from 'react';
import type { TimelineTask } from './TimelineView.types';

import Button from '../primitives/Button';

const TaskDetailSidebar = ({
   taskDetails,
   handleSetTaskDetails,
}: {
   taskDetails: TimelineTask | null;
   handleSetTaskDetails?: (task: TimelineTask) => void;
}) => {
   const [taskTitle, setTaskTitle] = useState<string | null>(null);
   const [taskProgress, setTaskProgress] = useState<number | null>(null);

   useEffect(() => {
      console.log('Task details updated 2:', taskDetails);
      if (taskDetails) {
         setTaskTitle(taskDetails.title);
         setTaskProgress(taskDetails.progress);
      }
   }, [taskDetails]);

   const handleEdit = () => {
      if (taskDetails && handleSetTaskDetails) {
         // Here you can handle the edit action, e.g., save the new title
         console.log('Editing task:', taskDetails.id, 'New title:', taskTitle);

         // For now, just updating the title locally
         taskDetails.title = taskTitle || taskDetails.title;
         taskDetails.progress = taskProgress || taskDetails.progress;
         handleSetTaskDetails({ ...taskDetails });
      }
   };

   return (
      <div className=" border border-gray-200 p-4">
         <h3 className="font-bold text-lg text-gray-500">Task Details</h3>
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

               {/* <input type="button" value="Edit" onClick={handleEdit} /> */}
               <Button
                  classNames="mt-4"
                  onClick={handleEdit}
                  label="Edit"
                  color="#3b82f6"
               />
            </div>
         ) : (
            <p>No task selected</p>
         )}
      </div>
   );
};

export default TaskDetailSidebar;
