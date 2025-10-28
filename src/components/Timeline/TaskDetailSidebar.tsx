import { useEffect, useState } from 'react';
import type { TimelineTask } from './TimelineView.types';

const TaskDetailSidebar = ({
   taskDetails,
   handleSetTaskDetails,
}: {
   taskDetails: TimelineTask | null;
   handleSetTaskDetails?: (task: TimelineTask) => void;
}) => {
   const [taskTitle, setTaskTitle] = useState<string | null>(null);
   useEffect(() => {
      console.log('Task details updated 2:', taskDetails);
      if (taskDetails) {
         setTaskTitle(taskDetails.title);
      }
   }, [taskDetails]);

   const handleEdit = () => {
      if (taskDetails && handleSetTaskDetails) {
         // Here you can handle the edit action, e.g., save the new title
         console.log('Editing task:', taskDetails.id, 'New title:', taskTitle);

         // For now, just updating the title locally
         taskDetails.title = taskTitle || taskDetails.title;
         handleSetTaskDetails({ ...taskDetails });
      }
   };

   return (
      <div className=" border border-gray-200 p-4">
         <h3 className="font-bold text-lg text-gray-500">Task Details</h3>
         {taskDetails ? (
            <div>
               <h2 className="font-bold text-lg">{taskDetails.title}</h2>
               <p>
                  {taskDetails.startDate.toDateString()} -{' '}
                  {taskDetails.endDate.toDateString()}
               </p>
               <p>Progress: {taskDetails.progress}%</p>
               <p>Assignee: {taskDetails.assignee}</p>

               <div className="flex">
                  <input
                     type="text"
                     onChange={(e) => setTaskTitle(e.target.value)}
                     value={taskTitle || ''}
                     placeholder="Edit"
                     className="w-30 "
                  />
                  <input type="button" value="Edit" onClick={handleEdit} />
               </div>
            </div>
         ) : (
            <p>No task selected</p>
         )}
      </div>
   );
};

export default TaskDetailSidebar;
