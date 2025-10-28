import { useEffect } from 'react';
import type { TimelineTask } from './TimelineView.types';

const TaskDetailSidebar = ({
   taskDetails,
}: {
   taskDetails: TimelineTask | null;
}) => {
   useEffect(() => {
      console.log('Task details updated 2:', taskDetails);
   }, [taskDetails]);
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
            </div>
         ) : (
            <p>No task selected</p>
         )}
      </div>
   );
};

export default TaskDetailSidebar;
