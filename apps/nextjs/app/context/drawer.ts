import { create } from 'zustand';

interface DrawerStore {
  active: boolean;
  toggle: (val: boolean) => void;
}

export const useDrawer = create<DrawerStore>((set) => ({
  active: localStorage.getItem('drawer') === 'active',
  toggle: (val) => {
    localStorage.setItem('drawer', val ? 'active' : 'hidden');
    set({ active: val });
  },
}));
