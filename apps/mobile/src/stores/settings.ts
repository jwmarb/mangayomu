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

export enum FetchAheadBehavior {
  IMMEDIATELY = 'Immediately',
  FROM_START = 'From start',
  FROM_END = 'From end',
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
    hideStatusBar: boolean;
    shouldFetchAhead: boolean;
    fetchAheadBehavior: FetchAheadBehavior;
    fetchAheadPageOffset: number;
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
        hideStatusBar: true,
        shouldFetchAhead: true,
        fetchAheadBehavior: FetchAheadBehavior.FROM_END,
        fetchAheadPageOffset: 3,
      },
      setReaderState: <T extends keyof SettingsState['reader']>(
        key: T,
        value: SettingsState['reader'][T],
      ) => set({ reader: { ...get().reader, [key]: value } }),
    }),
    createPersistConfig({
      name: 'settings',
      version: 2,
      migrations: {
        0: (oldState: SettingsState) =>
          ({
            ...oldState,
            reader: {
              ...oldState.reader,
              hideStatusBar: true,
            },
          }) as SettingsState,
        1: (oldState: SettingsState) => ({
          ...oldState,
          reader: {
            ...oldState.reader,
            shouldFetchAhead: true,
          },
        }),
        2: (oldState: SettingsState) => ({
          ...oldState,
          reader: {
            ...oldState.reader,
            fetchAheadBehavior: FetchAheadBehavior.FROM_END,
            fetchAheadPageOffset: 3,
          },
        }),
      } as any,
    }),
  ),
);
