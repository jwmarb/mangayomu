import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import MangaMetaHandler from '@/screens/Reader/helpers/MangaMetaHandler';
import React from 'react';

type UseReaderMangaMetaOptions = {
  chapter: unknown;
  manga: unknown;
};

export default function useReaderMangaMeta(params: UseReaderMangaMetaOptions) {
  const { chapter, manga } = params;
  const { data: metaResult, isFetched } = useMangaMeta(
    manga,
    ExtraReaderInfo.getSource().NAME,
  );
  MangaMetaHandler.setMangaMeta(metaResult);
  ExtraReaderInfo.setInitialPageParam(chapter);
  React.useEffect(() => {
    return () => {
      ExtraReaderInfo.cleanup();
      MangaMetaHandler.cleanup();
    };
  }, []);
  return isFetched;
}
