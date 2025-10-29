interface CurrentVerticalLineProps {
   daysFromStartToToday: number;
   pixelPerDay: number;
}

const CurrentVerticalLine = ({
   daysFromStartToToday,
   pixelPerDay,
}: CurrentVerticalLineProps) => {
   return (
      <div>
         <div
            className="h-full w-[2px] bottom-0 bg-rose-200 z-0 absolute"
            style={{
               left: `${
                  daysFromStartToToday * pixelPerDay + pixelPerDay / 2
               }px`,
            }}
         />
      </div>
   );
};

export default CurrentVerticalLine;
