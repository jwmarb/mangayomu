import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ReadingDirection,
  ImageScaling,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@mangayomu/schemas';
import { createPersistConfig } from '@/utils/persist';

export type SettingsState = {
  reader: {
    readingDirection: ReadingDirection;
    imageScaling: ImageScaling;
    screenOrientation: ReaderScreenOrientation;
    zoomStartPosition: ZoomStartPosition;
  };
};

export const useSettingsStore = create(
  persist<SettingsState>(
    () => ({
      reader: {
        readingDirection: ReadingDirection.LEFT_TO_RIGHT,
        imageScaling: ImageScaling.SMART_FIT,
        screenOrientation: ReaderScreenOrientation.FREE,
        zoomStartPosition: ZoomStartPosition.AUTOMATIC,
      },
    }),
    createPersistConfig({
      name: 'settings',
      version: 0,
    }),
  ),
);
