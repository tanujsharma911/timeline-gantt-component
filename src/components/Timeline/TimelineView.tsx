import PropTypes from 'prop-types';
import { ZoomIn, ZoomOut } from 'lucide-react';

import TimelineRow from './TimelineRow';
import TaskDetailSidebar from './TaskDetailSidebar';
import RowDetailsSideBar from './RowDetailsSideBar';
import TimelineLabel from './TimelineLabel';

import { useTimelineDataStore } from '../../store/useTimelineDataStore';

import { attachTasksToRows } from '../../utils/formatting.utils';
import type { TimelineTask, TimelineRowType } from './TimelineView.types';
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
}

const TimelineView = ({ rows, tasks }: props) => {
   const { data, setData, updatedData } = useTimelineDataStore();
   const { pixelPerDay, increaseZoom, decreaseZoom } = useTimelineZoom();
   const [taskIdDetail, setTaskIdDetail] = useState<string | null>(null);
   const [taskDetails, setTaskDetails] = useState<TimelineTask | null>(null);

   // Rearranging tasks into their respective rows
   const temp = attachTasksToRows(rows, tasks);

   useEffect(() => {
      // find task details
      if (taskIdDetail) {
         for (const row of data) {
            const foundTask = row.tasks.find(
               (task) => task.id === taskIdDetail
            );
            if (foundTask) {
               setTaskDetails(foundTask);
               console.log('Found Task Details:', foundTask);

               break;
            }
         }
      }

      // console.log(data);
   }, [taskIdDetail]);

   useEffect(() => {
      setData(temp);
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
      const newPixelPerDay = pixelPerDay;
      console.log('Zoomed Out:', newPixelPerDay);
   };

   const handleSetTaskDetails = (task: TimelineTask) => {
      setTaskDetails(task);
      updatedData(task.id, taskDetails || {});
   };

   return (
      <div>
         <div
            className={`relative grid ${
               taskDetails ? 'grid-cols-[auto_300px]' : 'grid-cols-[auto]'
            } h-[500px] border border-gray-300 rounded overflow-scroll`}
         >
            <div className="grid grid-cols-[200px_auto] overflow-scroll">
               {data && <RowDetailsSideBar data={data} />}
               <div className="flex flex-col gap-2 relative w-fit h-fit rounded bg-white">
                  <div className="overflow-x-auto relative border-b border-gray-300">
                     {/* Current day red line */}
                     <div
                        className="h-full w-[2px] bottom-0 bg-rose-200 z-0 absolute"
                        style={{
                           left: `${
                              daysFromStartToToday * pixelPerDay +
                              pixelPerDay / 2
                           }px`,
                        }}
                     />
                     {/* Timeline labels */}
                     <TimelineLabel monthArr={monthArr} dateArr={arr} />
                     {/* Timeline rows with tasks */}
                     {data.map((row) => (
                        <TimelineRow
                           key={row.id}
                           row={row}
                           minDate={minDate}
                           setTaskIdDetail={setTaskIdDetail}
                           updatedData={updatedData}
                        />
                     ))}
                     {data.length === 0 && (
                        <p className="text-center my-5">No rows available</p>
                     )}
                  </div>
               </div>
            </div>

            {!!taskDetails && (
               <TaskDetailSidebar
                  taskDetails={taskDetails}
                  handleSetTaskDetails={handleSetTaskDetails}
               />
            )}
         </div>
         <div className="">
            <button
               className={`p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 border border-gray-300 ${
                  pixelPerDay <= 10 ? 'cursor-not-allowed' : 'cursor-pointer'
               }`}
               onClick={zoomOut}
               disabled={pixelPerDay <= 10}
            >
               <ZoomOut />
            </button>
            <button
               className={`p-2 mx-5 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 ${
                  pixelPerDay >= 70 ? 'cursor-not-allowed' : 'cursor-pointer'
               }`}
               onClick={zoomIn}
               disabled={pixelPerDay >= 70}
            >
               <ZoomIn />
            </button>
         </div>
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
