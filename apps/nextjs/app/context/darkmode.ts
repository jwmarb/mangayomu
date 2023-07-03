import { create } from 'zustand';

interface DarkModeStore {
  isDarkMode: boolean;
  toggleDarkMode: (val?: boolean) => void;
}

export const useDarkMode = create<DarkModeStore>((set) => ({
  isDarkMode: (() => {
    const theme = localStorage.getItem('theme');
    const dark =
      theme === 'dark' ||
      (theme == null &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.add(dark ? 'dark' : 'light');
    return dark;
  })(),
  toggleDarkMode: (val) => {
    if (val == null)
      set((prev) => {
        if (prev.isDarkMode) {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
        return { isDarkMode: !prev.isDarkMode };
      });
    else {
      localStorage.setItem('theme', val ? 'dark' : 'light');
      set({ isDarkMode: val });
    }
  },
}));
