const DependencyLine = ({
   x1,
   y1,
   x2,
   y2,
}: {
   x1: number;
   y1: number;
   x2: number;
   y2: number;
}) => {
   return (
      <>
         <svg
            className="absolute inset-0 pointer-events-none overflow-visible"
            style={{ zIndex: 1 }}
         >
            <defs>
               <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
               >
                  <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
               </marker>
            </defs>

            <path
               d={`M ${x1} ${y1} L ${x2} ${y2}`}
               stroke="#94a3b8"
               strokeWidth="2"
               fill="none"
               markerEnd="url(#arrowhead)"
            />
         </svg>
      </>
   );
};

export default DependencyLine;
