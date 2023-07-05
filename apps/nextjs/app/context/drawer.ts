import { create } from 'zustand';

interface DrawerStore {
  active: boolean;
  visible: boolean;
  toggle: (val: boolean) => void;
  setVisible: (val: boolean) => void;
}

export const useDrawer = create<DrawerStore>((set) => ({
  active: localStorage.getItem('drawer') === 'active',
  visible: false,
  toggle: (val) => {
    localStorage.setItem('drawer', val ? 'active' : 'hidden');
    set({ active: val });
  },
  setVisible: (val) => set({ visible: val }),
}));
