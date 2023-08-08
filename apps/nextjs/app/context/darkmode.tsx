'use client';

import React from 'react';
import { create } from 'zustand';

interface DarkModeStore {
  isDarkMode: boolean;
  theme: 'light' | 'dark' | null;
  toggleDarkMode: (val?: boolean) => void;
  toSystemDefault: () => void;
}

export const useDarkMode = create<DarkModeStore>((set) => ({
  isDarkMode:
    typeof window !== 'undefined'
      ? (() => {
          const theme = window.localStorage.getItem('theme');
          const dark =
            theme === 'dark' ||
            (theme == null &&
              window.matchMedia('(prefers-color-scheme: dark)').matches);
          // document.documentElement.classList.add(dark ? 'dark' : 'light');
          return dark;
        })()
      : false,
  theme:
    typeof window !== 'undefined'
      ? (window.localStorage.getItem('theme') as 'light' | 'dark' | null)
      : null,
  toggleDarkMode: (val) => {
    if (typeof localStorage === 'undefined') return;
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
        return {
          isDarkMode: !prev.isDarkMode,
          theme: !prev.isDarkMode ? 'light' : 'dark',
        };
      });
    else {
      localStorage.setItem('theme', val ? 'dark' : 'light');
      set({ isDarkMode: val, theme: val ? 'dark' : 'light' });
    }
  },
  toSystemDefault: () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined')
      return;
    localStorage.removeItem('theme');
    const defaultIsDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    set({ isDarkMode: defaultIsDarkMode, theme: null });
  },
}));

export const DarkModeInitializer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isDarkMode = useDarkMode((store) => store.isDarkMode);
  React.useInsertionEffect(() => {
    document.documentElement.classList.value = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  return <>{children}</>;
};
