import { create } from 'zustand';
interface SafeAreaStore {
  mobile: boolean;
  drawerWidth: number;
  headerHeight: number;
  setDrawerWidth: (w: number) => void;
  setHeaderHeight: (h: number) => void;
  setMobile: (val: boolean) => void;
}

export const useSafeArea = create<SafeAreaStore>((set) => ({
  mobile: false,
  drawerWidth: 0,
  headerHeight: 0,
  setDrawerWidth: (w) => set({ drawerWidth: w }),
  setHeaderHeight: (h) => set({ headerHeight: h }),
  setMobile: (v) => set({ mobile: v }),
}));
