import { create } from 'zustand';

interface TimelineZoomState {
   pixelPerDay: number;
   setPixelPerDay: (data: number) => void;
   increaseZoom: () => void;
   decreaseZoom: () => void;
}

export const useTimelineZoom = create<TimelineZoomState>((set) => ({
   pixelPerDay: 40,

   setPixelPerDay: (data) => set({ pixelPerDay: data }),

   increaseZoom: () =>
      set((state) => ({
         pixelPerDay: Math.min(state.pixelPerDay + 10, 100),
      })),

   decreaseZoom: () =>
      set((state) => ({
         pixelPerDay: Math.max(state.pixelPerDay - 10, 0),
      })),
}));
