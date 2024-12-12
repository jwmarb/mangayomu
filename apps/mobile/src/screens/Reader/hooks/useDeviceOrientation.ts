import orientation from 'react-native-orientation-locker';
import useReaderSetting from '@/hooks/useReaderSetting';
import { ReadingOrientation } from '@/models/schema';
import React from 'react';
import { Manga } from '@mangayomu/mangascraper';

/**
 * Hook to manage the device orientation based on the reading setting.
 *
 * This hook reads the 'readingOrientation' setting for the provided manga and
 * locks or unlocks the device orientation accordingly. The possible orientations
 * are FREE, LANDSCAPE, and PORTRAIT. When the component unmounts, it ensures that
 * all orientations are unlocked.
 *
 * @post   The device orientation is set according to the 'readingOrientation' setting.
 *         On component unmount, all orientations are unlocked.
 * @param manga - The current manga being read, which includes the reading settings.
 */
export default function useDeviceOrientation(manga: Manga) {
  const { state: readingOrientation } = useReaderSetting(
    'readingOrientation',
    manga,
  );

  // Effect to lock or unlock device orientation based on current setting
  React.useEffect(() => {
    switch (readingOrientation) {
      case ReadingOrientation.FREE:
        // Allow all orientations
        orientation.unlockAllOrientations();
        break;
      case ReadingOrientation.LANDSCAPE:
        // Lock to landscape orientation
        orientation.lockToLandscape();
        break;
      case ReadingOrientation.PORTRAIT:
        orientation.lockToPortrait();
        break;
    }

    // Cleanup function to unlock all orientations on component unmount
    return () => {
      orientation.unlockAllOrientations();
    };
  }, [readingOrientation]);
}
