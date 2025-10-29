import type { TimelineTask } from './TimelineView.types';

import { calculateMaxOverlaps } from '../../utils/position.utils';

interface RowDetailsSideBarProps {
   rows: {
      tasks: TimelineTask[];
      id: string;
      label: string;
      avatar?: string | undefined;
   }[];
}

const RowDetailsSideBar = ({
   data,
}: {
   data: RowDetailsSideBarProps['rows'];
}) => {
   return (
      <div className={` mt-[106px] sticky left-0 z-10 bg-white w-[200px]`}>
         {data.map((row) => {
            const maxOverlaps = calculateMaxOverlaps(row.tasks);
            return (
               <div
                  key={row.id}
                  style={{ height: `${maxOverlaps * 56}px` }}
                  className={`ring ring-gray-300 flex items-center`}
               >
                  <h4 className="mx-auto">{row.label}</h4>
               </div>
            );
         })}
         {data.length === 0 && (
            <div className="ring ring-gray-300 flex justify-center items-center h-full">
               <p className="my-auto text-center">No rows available</p>
            </div>
         )}
      </div>
   );
};

export default RowDetailsSideBar;
