import { MangaSchema } from '@database/schemas/Manga';
import {
  ImageScaling,
  ReaderScreenOrientation,
  ReadingDirection,
  SettingsState,
  ZoomStartPosition,
} from '@redux/slices/settings';
import React from 'react';
import Orientation from 'react-native-orientation-locker';

type ReaderProps = Omit<
  {
    [K in keyof SettingsState['reader'] as Extract<
      SettingsState['reader'][K],
      boolean | Record<string, unknown>
    > extends never
      ? K
      : never]: SettingsState['reader'][K];
  },
  'backgroundColor'
>;

/**
 * A hook to automatically inject the global setting into a manga setting if the user has the manga setting set to "Use global setting"
 * @param manga Manga user is reading
 * @param readerProps The props provided by redux
 * @returns Returns manga settings with proper user configuration
 */
export default function useReaderProps(
  manga: MangaSchema,
  readerProps: ReaderProps,
) {
  const readingDirection = React.useMemo(
    () =>
      manga.readerDirection != null
        ? manga.readerDirection === 'Use global setting'
          ? readerProps.readingDirection
          : manga.readerDirection
        : ReadingDirection.RIGHT_TO_LEFT,
    [manga.readerDirection, readerProps.readingDirection],
  );
  const imageScaling = React.useMemo(
    () =>
      manga.readerImageScaling != null
        ? manga.readerImageScaling === 'Use global setting'
          ? readerProps.imageScaling
          : manga.readerImageScaling
        : ImageScaling.SMART_FIT,
    [readerProps.imageScaling, manga.readerDirection],
  );
  const zoomStartPosition = React.useMemo(
    () =>
      manga.readerZoomStartPosition != null
        ? manga.readerZoomStartPosition === 'Use global setting'
          ? readerProps.zoomStartPosition
          : manga.readerZoomStartPosition
        : ZoomStartPosition.AUTOMATIC,
    [readerProps.zoomStartPosition, manga.readerZoomStartPosition],
  );
  const lockOrientation = React.useMemo(
    () =>
      manga.readerLockOrientation != null
        ? manga.readerLockOrientation === 'Use global setting'
          ? readerProps.lockOrientation
          : manga.readerLockOrientation
        : ReaderScreenOrientation.FREE,
    [manga.readerLockOrientation, readerProps.lockOrientation],
  );
  React.useEffect(() => {
    switch (lockOrientation) {
      case ReaderScreenOrientation.FREE:
        break;
      case ReaderScreenOrientation.LANDSCAPE:
        Orientation.lockToLandscape();
        break;
      case ReaderScreenOrientation.PORTRAIT:
        Orientation.lockToPortrait();
        break;
    }
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [lockOrientation]);

  return React.useMemo(
    () => ({
      readingDirection,
      imageScaling,
      zoomStartPosition,
      lockOrientation,
    }),
    [readingDirection, imageScaling, zoomStartPosition, lockOrientation],
  );
}
