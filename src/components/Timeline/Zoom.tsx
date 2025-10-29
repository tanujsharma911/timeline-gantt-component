import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomProps {
   pixelPerDay: number;
   setPixelPerDay: (value: number) => void;
   zoomIn: () => void;
   zoomOut: () => void;
}

const Zoom = ({ pixelPerDay, setPixelPerDay, zoomIn, zoomOut }: ZoomProps) => {
   return (
      <div>
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
            <button
               className={`p-2 mx-5 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 ${
                  pixelPerDay >= 70 ? 'cursor-not-allowed' : 'cursor-pointer'
               }`}
               onClick={() => setPixelPerDay(40)}
            >
               Day
            </button>
            <button
               className={`p-2 mx-5 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 ${
                  pixelPerDay >= 70 ? 'cursor-not-allowed' : 'cursor-pointer'
               }`}
               onClick={() => setPixelPerDay(30)}
            >
               Week
            </button>
            <button
               className={`p-2 mx-5 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 ${
                  pixelPerDay >= 70 ? 'cursor-not-allowed' : 'cursor-pointer'
               }`}
               onClick={() => setPixelPerDay(20)}
            >
               Month
            </button>
         </div>
      </div>
   );
};

export default Zoom;
