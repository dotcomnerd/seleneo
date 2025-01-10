import { create } from "zustand";

interface LastSavedTimeState {
    lastSavedTime: Date | null;
    setLastSavedTime: (time: Date | null) => void;
}

export const useLastSavedTime = create<LastSavedTimeState>((set) => ({
    lastSavedTime: null,
    setLastSavedTime: (time: Date | null) => set({ lastSavedTime: time }),
}));