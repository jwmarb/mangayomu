import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import useMangaSource from '@/hooks/useMangaSource';

export type UseCurrentChapterParams = {
  source?: string;
  manga: unknown;
  chapter: unknown;
  tmangameta: unknown;
};

export default function useCurrentChapter(params: UseCurrentChapterParams) {
  const { source: sourceStr, manga, chapter, tmangameta } = params;
  const source = useMangaSource({ source: sourceStr, manga });
  const [currentChapter, setCurrentChapter] =
    React.useState<MangaChapter | null>(null);

  React.useEffect(() => {
    setCurrentChapter((prev) =>
      prev == null ? source.toChapter(chapter, tmangameta) : prev,
    );
  }, [tmangameta, chapter]);

  return [currentChapter, setCurrentChapter] as const;
}
