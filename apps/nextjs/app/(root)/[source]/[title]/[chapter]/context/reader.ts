import { create } from 'zustand';

interface ReaderStore {
  overlayActive: boolean;
  toggleOverlay: (val?: boolean) => void;
}

export const useReader = create<ReaderStore>((set) => ({
  overlayActive: false,
  toggleOverlay: (val) =>
    set((get) => ({ overlayActive: val ?? !get.overlayActive })),
}));
