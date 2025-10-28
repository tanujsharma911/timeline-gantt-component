import { format, isToday } from 'date-fns';
import { useEffect, useRef } from 'react';

import { pixelPerDay } from '../../constants/timeline.constants';

interface TimelineLabelProps {
   monthArr: { month: string; days: number }[];
   dateArr: { date: Date }[];
}

const TimelineLabel = ({ monthArr, dateArr }: TimelineLabelProps) => {
   const targetRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      // When component mounts, scroll the target div into view
      targetRef.current?.scrollIntoView({
         behavior: 'smooth', // or "auto" for instant
         inline: 'center', // horizontally center
         block: 'nearest', // for vertical alignment
      });
   }, []);

   return (
      <>
         <div className="overflow-x-auto border-b border-gray-300 z-10 bg-white relative">
            <div className="flex w-fit text-xs text-gray-700 select-none">
               {monthArr.map((month, i) => (
                  <div
                     key={i}
                     className="flex items-center justify-center border-r border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                     style={{
                        width: `${month.days * pixelPerDay}px`,
                        height: '40px',
                        minWidth: '60px', // keeps smaller months visible
                     }}
                  >
                     <p className="text-center font-semibold">{month.month}</p>
                  </div>
               ))}
            </div>
         </div>

         <div
            className={`grid w-full grid-flow-col text-xs text-gray-700 select-none relative`}
            style={{ gridAutoColumns: `${pixelPerDay}px` }}
         >
            {dateArr.map((day, i: number) => (
               <div
                  key={i}
                  className={`py-4 
                    border-b border-r border-gray-300 
                    transition-colors
                    ${
                       isToday(day.date)
                          ? 'bg-rose-500 text-white hover:bg-rose-600'
                          : 'bg-white hover:bg-gray-100'
                    }
                  `}
                  ref={isToday(day.date) ? targetRef : null}
               >
                  <p className="text-center font-semibold">
                     {day.date.getDate()}
                  </p>
                  <p
                     className={`text-center ${
                        isToday(day.date) ? 'text-white/80' : 'text-gray-500'
                     } `}
                  >
                     {format(day.date, 'EEE')}
                  </p>
               </div>
            ))}
         </div>
      </>
   );
};

export default TimelineLabel;
