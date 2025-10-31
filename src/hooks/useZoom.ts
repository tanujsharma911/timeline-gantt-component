import { useTimelineZoom } from '../store/useTimelineZoom';

export const useZoom = () => {
   const { pixelPerDay, increaseZoom, decreaseZoom } = useTimelineZoom();

   const zoomIn = () => {
      if (pixelPerDay >= 70) return;
      increaseZoom();
   };

   const zoomOut = () => {
      if (pixelPerDay <= 10) return;
      decreaseZoom();
   };

   return { zoomIn, zoomOut };
};
