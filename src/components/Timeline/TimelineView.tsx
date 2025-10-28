import PropTypes from 'prop-types';

import TimelineRow from './TimelineRow';
import TaskDetailSidebar from './TaskDetailSidebar';
import TimelineLabel from './TimelineLabel';
// import DependencyLine from './DependencyLine';

import { useTimelineDataStore } from '../../store/useTimelineDataStore';

import { attachTasksToRows } from '../../utils/formatting.utils';
import type { TimelineTask, TimelineRowType } from './TimelineView.types';
import {
   getTimelineDateRange,
   generateTimeScale,
   generateMonthScale,
} from '../../utils/date.utils';

import { pixelPerDay } from '../../constants/timeline.constants';
import { useEffect } from 'react';

interface props {
   rows: TimelineRowType[];
   tasks: Record<string, TimelineTask>;
}

const TimelineView = ({ rows, tasks }: props) => {
   const { data, setData } = useTimelineDataStore();

   // Rearranging tasks into their respective rows
   const temp = attachTasksToRows(rows, tasks);

   useEffect(() => {
      setData(temp);
   }, []);

   if (!rows.length && !Object.keys(tasks).length) {
      return <div>no tasks</div>;
   }

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

   return (
      <div className="flex h-[500px] border border-gray-300 rounded overflow-hidden">
         <TaskDetailSidebar />

         <div className="w-full overflow-scroll">
            <div className="flex flex-col gap-2 w-fit rounded bg-white">
               <div className="overflow-x-auto relative border-b border-gray-300">
                  {/* Current day red line */}
                  <div
                     className="h-full w-[2px] bottom-0 bg-rose-200 z-0 absolute"
                     style={{
                        left: `${
                           daysFromStartToToday * pixelPerDay + pixelPerDay / 2
                        }px`,
                     }}
                  />

                  {/* Timeline labels */}
                  <TimelineLabel monthArr={monthArr} dateArr={arr} />

                  {/* Timeline rows with tasks */}
                  {data.map((row) => (
                     <TimelineRow key={row.id} row={row} minDate={minDate} />
                  ))}

                  {/* <DependencyLine x1={100} y1={50} x2={100} y2={300} /> */}
               </div>
            </div>
         </div>
      </div>
   );
};

TimelineView.propTypes = {
   sampleRows: PropTypes.arrayOf(
      PropTypes.shape({
         id: PropTypes.string.isRequired,
         label: PropTypes.string.isRequired,
         avatar: PropTypes.string,
         tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
   ).isRequired,

   sampleTasks: PropTypes.objectOf(
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
