import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

// Import components
import TimelineRow from './TimelineRow';
import TaskDetailSidebar from './TaskDetailSidebar';
import RowDetailsSideBar from './RowDetailsSideBar';
import TimelineLabel from './TimelineLabel';
import Zoom from './Zoom';
import CurrentVerticalLine from './CurrentTimeLine';

// Import custom hooks
import { useZoom } from '../../hooks/useZoom';

// Import zustand stores
import { useTimelineDataStore } from '../../store/useTimelineDataStore';
import { useTimelineZoom } from '../../store/useTimelineZoom';

// Import utils and types
import { attachTasksToRows } from '../../utils/formatting.utils';
import {
   getTimelineDateRange,
   generateTimeScale,
   generateMonthScale,
} from '../../utils/date.utils';
import { positionOfCurrentDate } from '../../utils/position.utils';

import type { TimelineTask, TimelineRowType } from '../../types/timeline.types';

interface props {
   rows: TimelineRowType[];
   tasks: Record<string, TimelineTask>;
   zoom?: boolean;
   sidebarOpenDefault?: boolean;
   mobileView?: boolean;
}

const TimelineView = ({
   rows,
   tasks,
   zoom,
   sidebarOpenDefault = true,
   mobileView,
}: props) => {
   const { pixelPerDay, setPixelPerDay } = useTimelineZoom();

   const { rowsWithTasks, setRowsWithTasks, updatedRowsWithTasks, deleteTask } =
      useTimelineDataStore();

   const { zoomIn, zoomOut } = useZoom();

   // for task details sidebar
   const [taskIdDetail, setTaskIdDetail] = useState<string | null>(null);
   const [taskDetails, setTaskDetails] = useState<TimelineTask | null>(null);
   const [sideBarOpen, setSideBarOpen] = useState(sidebarOpenDefault);

   const handleSetTaskDetails = (task: TimelineTask) => {
      setTaskDetails(task);
      updatedRowsWithTasks(task.id, taskDetails || {});
   };

   // Rearranging tasks into their respective rows
   const temp = attachTasksToRows(rows, tasks);

   useEffect(() => {
      // Setting task details when taskIdDetail changes
      if (taskIdDetail) {
         // Finding the task in rowsWithTasks
         for (const row of rowsWithTasks) {
            const foundTask = row.tasks.find(
               (task) => task.id === taskIdDetail
            );
            if (foundTask) {
               setTaskDetails(foundTask);
               break;
            }
         }
      } else {
         setTaskDetails(null);
      }
   }, [taskIdDetail]);

   // Setting rowsWithTasks in zustand on component mount
   useEffect(() => {
      setRowsWithTasks(temp);
      console.log('Setting rows with tasks:', JSON.stringify(temp));
   }, []);

   // Determine timeline date range
   const { minDate, maxDate } = getTimelineDateRange(tasks);

   // Determine offset for today line
   const daysFromStartToToday = positionOfCurrentDate(minDate);

   // Create list of days
   const dateArr: Array<{ date: Date; label: string }> = generateTimeScale(
      minDate,
      maxDate
   );

   // Create list of months
   const monthArr: Array<{ month: string; days: number; date: Date }> =
      generateMonthScale(minDate, maxDate);

   return (
      <div className={`${mobileView ? 'w-md' : 'w-full'}`}>
         <div
            className={`relative grid ${
               taskDetails ? 'grid-cols-[auto_300px]' : 'grid-cols-[auto]'
            } h-[500px] border border-gray-300 rounded overflow-scroll`}
         >
            <div className="grid grid-cols-[200px_auto] overflow-scroll">
               {/* Rows Details Side panel */}
               {rowsWithTasks && sideBarOpen && (
                  <RowDetailsSideBar rowsWithTasks={rowsWithTasks} />
               )}

               {/* Toggle Rows Details Side panel */}
               <button
                  aria-label={
                     !sideBarOpen
                        ? 'Open Rows Details Sidebar'
                        : 'Close Rows Details Sidebar'
                  }
                  className={`absolute z-11 bottom-8 bg-white rounded-full ring-1 ring-gray-300 p-2 ${
                     sideBarOpen ? 'left-45' : 'left-2'
                  }`}
                  onClick={(e) => {
                     setSideBarOpen(!sideBarOpen);
                     e.currentTarget.setAttribute(
                        'aria-label',
                        !sideBarOpen
                           ? 'Open Rows Details Sidebar'
                           : 'Close Rows Details Sidebar'
                     );
                  }}
               >
                  <ChevronRight
                     className={`transition-transform ${
                        sideBarOpen ? 'rotate-180' : ''
                     }`}
                  />
               </button>

               {/* Timeline chart */}
               <div className="flex flex-col gap-2 relative w-fit h-fit rounded bg-white">
                  <div className="overflow-x-auto relative border-b border-gray-300">
                     {/* Current day red line */}
                     <CurrentVerticalLine
                        daysFromStartToToday={daysFromStartToToday}
                        pixelPerDay={pixelPerDay}
                     />

                     {/* Timeline labels */}
                     <TimelineLabel monthArr={monthArr} dateArr={dateArr} />

                     {/* Timeline rows with tasks */}
                     {rowsWithTasks.map((row) => (
                        <TimelineRow
                           key={row.id}
                           row={row}
                           minDate={minDate}
                           setTaskIdDetail={setTaskIdDetail}
                           updatedRowsWithTasks={updatedRowsWithTasks}
                        />
                     ))}
                     {rowsWithTasks.length === 0 && (
                        <p className="text-center my-5">No rows available</p>
                     )}
                  </div>
               </div>
            </div>

            {/* Task details side panel */}
            {!!taskDetails && (
               <TaskDetailSidebar
                  taskDetails={taskDetails}
                  handleSetTaskDetails={handleSetTaskDetails}
                  setTaskIdDetail={setTaskIdDetail}
                  isOpen={!!taskDetails}
                  deleteTask={deleteTask}
               />
            )}
         </div>

         {zoom && (
            <Zoom
               pixelPerDay={pixelPerDay}
               setPixelPerDay={setPixelPerDay}
               zoomIn={zoomIn}
               zoomOut={zoomOut}
            />
         )}
      </div>
   );
};

TimelineView.propTypes = {
   rows: PropTypes.arrayOf(
      PropTypes.shape({
         id: PropTypes.string.isRequired,
         label: PropTypes.string.isRequired,
         avatar: PropTypes.string,
         tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
   ).isRequired,

   tasks: PropTypes.objectOf(
      PropTypes.shape({
         id: PropTypes.string.isRequired,
         title: PropTypes.string.isRequired,
         startDate: PropTypes.instanceOf(Date).isRequired,
         endDate: PropTypes.instanceOf(Date).isRequired,
         progress: PropTypes.number.isRequired,
         assignee: PropTypes.string,
         rowId: PropTypes.string.isRequired,
         dependencies: PropTypes.arrayOf(PropTypes.string),
         color: PropTypes.string,
         isMilestone: PropTypes.bool,
      })
   ).isRequired,
};

export default TimelineView;
