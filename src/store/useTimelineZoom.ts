import { create } from 'zustand';

interface TimelineZoomState {
   pixelPerDay: number;
   setData: (data: number) => void;
   increaseZoom: () => void;
   decreaseZoom: () => void;
}

export const useTimelineZoom = create<TimelineZoomState>((set) => ({
   pixelPerDay: 40,

   setData: (data) => set({ pixelPerDay: data }),

   increaseZoom: () =>
      set((state) => ({
         pixelPerDay: Math.min(state.pixelPerDay + 10, 100),
      })),

   decreaseZoom: () =>
      set((state) => ({
         pixelPerDay: Math.max(state.pixelPerDay - 10, 0),
      })),
}));
