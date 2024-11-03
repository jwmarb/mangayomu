import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import useMangaSource from '@/hooks/useMangaSource';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';

export type UseCurrentChapterParams = {
  chapter: unknown;
};

export default function useCurrentChapter(params: UseCurrentChapterParams) {
  const { chapter } = params;
  const source = ExtraReaderInfo.getSource();
  const tmangameta = ExtraReaderInfo.getTMangaMeta();
  const [currentChapter, setCurrentChapter] = React.useState<MangaChapter>(
    () => {
      const result = source.toChapter(chapter, tmangameta);
      ExtraReaderInfo.setCurrentChapter(result);
      return result;
    },
  );

  React.useEffect(() => {
    setCurrentChapter((prev) => {
      const result =
        prev == null ? source.toChapter(chapter, tmangameta) : prev;
      ExtraReaderInfo.setCurrentChapter(result);
      return result;
    });
  }, [tmangameta, chapter]);

  return [currentChapter, setCurrentChapter] as const;
}
