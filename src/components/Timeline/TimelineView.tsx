import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

import TimelineRow from './TimelineRow';
import TaskDetailSidebar from './TaskDetailSidebar';
import RowDetailsSideBar from './RowDetailsSideBar';
import TimelineLabel from './TimelineLabel';
import Zoom from './Zoom';
import CurrentVerticalLine from './CurrentTimeLine';

import { useTimelineDataStore } from '../../store/useTimelineDataStore';

import { attachTasksToRows } from '../../utils/formatting.utils';
import type { TimelineTask, TimelineRowType } from '../../types/timeline.types';
import {
   getTimelineDateRange,
   generateTimeScale,
   generateMonthScale,
} from '../../utils/date.utils';

// import { pixelPerDay } from '../../constants/timeline.constants';
import { useTimelineZoom } from '../../store/useTimelineZoom';
import { useEffect, useState } from 'react';

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
   const { rowsWithTasks, setRowsWithTasks, updatedRowsWithTasks, deleteTask } =
      useTimelineDataStore();
   const { pixelPerDay, setPixelPerDay, increaseZoom, decreaseZoom } =
      useTimelineZoom();
   const [taskIdDetail, setTaskIdDetail] = useState<string | null>(null);
   const [taskDetails, setTaskDetails] = useState<TimelineTask | null>(null);
   const [sideBarOpen, setSideBarOpen] = useState(sidebarOpenDefault);

   // Rearranging tasks into their respective rows
   const temp = attachTasksToRows(rows, tasks);

   useEffect(() => {
      // find task details
      if (taskIdDetail) {
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

   useEffect(() => {
      setRowsWithTasks(temp);
   }, []);

   // Determine timeline date range
   const { minDate, maxDate } = getTimelineDateRange(tasks);

   // Determine offset for today line
   const today = new Date();
   const msPerDay = 1000 * 60 * 60 * 24;
   const daysFromStartToToday = Math.floor(
      (today.getTime() - minDate.getTime()) / msPerDay
   );

   // Create list of days
   const arr: Array<{ date: Date; label: string }> = generateTimeScale(
      minDate,
      maxDate
   );

   // Create list of months
   const monthArr = generateMonthScale(minDate, maxDate);

   const zoomIn = () => {
      if (pixelPerDay >= 70) return;
      increaseZoom();
      const newPixelPerDay = pixelPerDay;
      console.log('Zoomed In:', newPixelPerDay);
   };

   const zoomOut = () => {
      if (pixelPerDay <= 10) return;
      decreaseZoom();
   };

   const handleSetTaskDetails = (task: TimelineTask) => {
      setTaskDetails(task);
      updatedRowsWithTasks(task.id, taskDetails || {});
   };

   return (
      <div className={`${mobileView ? 'w-md' : 'w-full'}`}>
         <div
            className={`relative grid ${
               taskDetails ? 'grid-cols-[auto_300px]' : 'grid-cols-[auto]'
            } h-[500px] border border-gray-300 rounded overflow-scroll`}
         >
            <div className="grid grid-cols-[200px_auto] overflow-scroll">
               {rowsWithTasks && sideBarOpen && (
                  <RowDetailsSideBar rowsWithTasks={rowsWithTasks} />
               )}
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
               <div className="flex flex-col gap-2 relative w-fit h-fit rounded bg-white">
                  <div className="overflow-x-auto relative border-b border-gray-300">
                     {/* Current day red line */}
                     <CurrentVerticalLine
                        daysFromStartToToday={daysFromStartToToday}
                        pixelPerDay={pixelPerDay}
                     />

                     {/* Timeline labels */}
                     <TimelineLabel monthArr={monthArr} dateArr={arr} />

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
