import {
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@mangayomu/schemas';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum BackgroundColor {
  WHITE = 'bg-white',
  BLACK = 'bg-black',
  GRAY = 'bg-gray-500',
}

export interface ReaderSettings {
  zoomStartPosition: ZoomStartPosition;
  imageScaling: ImageScaling;
  backgroundColor: BackgroundColor;
  readingDirection: ReadingDirection;
  setBackgroundColor: (bg: BackgroundColor) => void;
  setReadingDirection: (rd: ReadingDirection) => void;
  setImageScaling: (scale: ImageScaling) => void;
  setZoomStartPosition: (zsp: ZoomStartPosition) => void;
}

export const useReaderSettings = create(
  persist<ReaderSettings>(
    (set) => ({
      zoomStartPosition: ZoomStartPosition.AUTOMATIC,
      imageScaling: ImageScaling.SMART_FIT,
      backgroundColor: BackgroundColor.WHITE,
      readingDirection: ReadingDirection.RIGHT_TO_LEFT,
      setReadingDirection: (rd) => set({ readingDirection: rd }),
      setBackgroundColor: (bg) => set({ backgroundColor: bg }),
      setZoomStartPosition: (zsp) => set({ zoomStartPosition: zsp }),
      setImageScaling: (scale) => set({ imageScaling: scale }),
    }),
    {
      name: 'reader',
    },
  ),
);
