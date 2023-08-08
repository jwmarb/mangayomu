'use client';
import { create } from 'zustand';
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null;
interface SafeAreaStore {
  mobile: boolean;
  breakpoint: Set<Breakpoint>;
  drawerWidth: number;
  headerHeight: number;
  setDrawerWidth: (w: number) => void;
  setHeaderHeight: (h: number) => void;
  setMobile: (val: boolean) => void;
  setBreakpoint: (w: number) => void;
}

function getBreakpoint(width: number) {
  if (width < 640) return new Set<Breakpoint>();
  else if (width >= 640 && width < 768) return new Set<Breakpoint>(['sm']);
  else if (width >= 768 && width < 1024)
    return new Set<Breakpoint>(['sm', 'md']);
  else if (width >= 1024 && width < 1280)
    return new Set<Breakpoint>(['sm', 'md', 'lg']);
  else if (width >= 1280 && width < 1536)
    return new Set<Breakpoint>(['sm', 'md', 'lg', 'xl']);
  else if (width >= 1536)
    return new Set<Breakpoint>(['sm', 'md', 'lg', 'xl', '2xl']);

  return new Set<Breakpoint>();
}

export const useSafeArea = create<SafeAreaStore>((set) => ({
  mobile: window.innerWidth < 1024,
  breakpoint: getBreakpoint(window.innerWidth),
  drawerWidth: 0,
  headerHeight: 0,
  setDrawerWidth: (w) => set({ drawerWidth: w }),
  setHeaderHeight: (h) => set({ headerHeight: h }),
  setMobile: (v) => set({ mobile: v }),
  setBreakpoint: (w) => set({ breakpoint: getBreakpoint(w) }),
}));
