import orientation from 'react-native-orientation-locker';
import useReaderSetting from '@/hooks/useReaderSetting';
import { ReadingOrientation } from '@/models/schema';
import React from 'react';
import { Manga } from '@mangayomu/mangascraper';

export default function useDeviceOrientation(manga: Manga) {
  const { state: readingOrientation } = useReaderSetting(
    'readingOrientation',
    manga,
  );
  React.useEffect(() => {
    switch (readingOrientation) {
      case ReadingOrientation.FREE:
        orientation.unlockAllOrientations();
        break;
      case ReadingOrientation.LANDSCAPE:
        orientation.lockToLandscape();
        break;
      case ReadingOrientation.PORTRAIT:
        orientation.lockToPortrait();
        break;
    }
    return () => {
      orientation.unlockAllOrientations();
    };
  }, [readingOrientation]);
}
