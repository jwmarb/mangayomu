import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistConfig } from '@/utils/persist';
import {
  ImageScaling,
  ReadingDirection,
  ReadingOrientation,
  ZoomStartPosition,
} from '@/models/schema';

export type SettingsState = {
  reader: {
    readingDirection: ReadingDirection;
    imageScaling: ImageScaling;
    readingOrientation: ReadingOrientation;
    zoomStartPosition: ZoomStartPosition;
  };
  setReaderState: <T extends keyof SettingsState['reader']>(
    key: T,
    value: SettingsState['reader'][T],
  ) => void;
};

export const useSettingsStore = create(
  persist<SettingsState>(
    (set, get) => ({
      reader: {
        readingDirection: ReadingDirection.DEFAULT,
        imageScaling: ImageScaling.DEFAULT,
        readingOrientation: ReadingOrientation.DEFAULT,
        zoomStartPosition: ZoomStartPosition.DEFAULT,
      },
      setReaderState: <T extends keyof SettingsState['reader']>(
        key: T,
        value: SettingsState['reader'][T],
      ) => set({ reader: { ...get().reader, [key]: value } }),
    }),
    createPersistConfig({
      name: 'settings',
      version: 0,
    }),
  ),
);
