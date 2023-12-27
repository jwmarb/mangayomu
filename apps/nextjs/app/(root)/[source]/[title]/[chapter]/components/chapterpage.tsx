import { useManga } from '@app/(root)/[source]/[title]/[chapter]/context/MangaContext';
import useReaderSetting from '@app/(root)/[source]/[title]/[chapter]/hooks/useReaderSetting';
import { ImageScaling, ReadingDirection } from '@mangayomu/schemas';
import React from 'react';

interface ChapterPageProps {
  page: string;
}

function ChapterPage(props: ChapterPageProps) {
  const { page } = props;
  const manga = useManga();
  const scaling = useReaderSetting('readerImageScaling', manga);
  const readingDirection = useReaderSetting('readerDirection', manga);

  if (readingDirection !== ReadingDirection.WEBTOON)
    switch (scaling) {
      case ImageScaling.FIT_SCREEN:
        return (
          <img src={page} className="object-contain h-[100vh] w-[100vw]" />
        );
      case ImageScaling.FIT_HEIGHT:
        return <img src={page} className="object-contain h-[100vh]" />;
      case ImageScaling.FIT_WIDTH:
        return <img src={page} className="object-contain w-[100vw]" />;
      case ImageScaling.SMART_FIT:
        return (
          <img src={page} className="object-contain h-[100vh] w-[100vw]" />
        );
    }
  return <img src={page} className="w-[100vw]" />;
}

export default React.memo(ChapterPage);
