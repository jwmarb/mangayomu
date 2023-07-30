import { ReadingDirection } from '@app/realm/Manga';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum BackgroundColor {
  WHITE = 'bg-white',
  BLACK = 'bg-black',
  GRAY = 'bg-gray-500',
}

export interface ReaderSettings {
  backgroundColor: BackgroundColor;
  readingDirection: ReadingDirection;
  setBackgroundColor: (bg: BackgroundColor) => void;
  setReadingDirection: (rd: ReadingDirection) => void;
}

export const useReaderSettings = create(
  persist<ReaderSettings>(
    (set) => ({
      backgroundColor: BackgroundColor.WHITE,
      readingDirection: ReadingDirection.RIGHT_TO_LEFT,
      setReadingDirection: (rd) => set({ readingDirection: rd }),
      setBackgroundColor: (bg) => set({ backgroundColor: bg }),
    }),
    {
      name: 'reader',
    },
  ),
);
