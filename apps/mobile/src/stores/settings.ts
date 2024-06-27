import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistConfig } from '@/utils/persist';
import {
  ImageScaling,
  ReadingDirection,
  ReadingOrientation,
  ZoomStartPosition,
} from '@/models/schema';

export enum BackgroundColor {
  WHITE,
  BLACK,
  GRAY,
  DEFAULT = BackgroundColor.BLACK,
}

export const BackgroundColorMap = {
  [BackgroundColor.BLACK]: 'black',
  [BackgroundColor.WHITE]: 'white',
  [BackgroundColor.GRAY]: 'gray',
};

export type SettingsState = {
  reader: {
    readingDirection: ReadingDirection;
    imageScaling: ImageScaling;
    readingOrientation: ReadingOrientation;
    zoomStartPosition: ZoomStartPosition;
    backgroundColor: BackgroundColor;
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
        backgroundColor: BackgroundColor.DEFAULT,
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
