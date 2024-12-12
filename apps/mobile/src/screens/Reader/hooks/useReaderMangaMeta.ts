import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import GestureManager from '@/screens/Reader/helpers/GestureManager';
import MangaMetaHandler from '@/screens/Reader/helpers/MangaMetaHandler';
import React from 'react';

type UseReaderMangaMetaOptions = {
  chapter: unknown;
  manga: unknown;
};

/**
 *  Manages and fetches metadata for a manga chapter in the reader.
 *  It fetches the metadata for the provided manga and stores it using MangaMetaHandler.
 *  It also sets the initial page parameter for the reader based on the chapter.
 *  Cleans up resources when the component unmounts.
 *
 *  @pre    The params object contains valid chapter and manga information.
 *  @post   The manga metadata is fetched and stored; initial page parameter is set; cleanup functions are registered.
 *  @param params   An object containing the chapter and manga information.
 *          - chapter: The chapter for which the initial page parameter is set.
 *          - manga: The manga for which metadata is fetched.
 *
 *  @returns A boolean indicating whether the metadata has been fetched.
 */
export default function useReaderMangaMeta(params: UseReaderMangaMetaOptions) {
  const { chapter, manga } = params;
  // Fetch manga metadata using the current manga and source name.
  const { data: metaResult, isFetched } = useMangaMeta(
    manga,
    ExtraReaderInfo.getSource().NAME,
  );
  // Store the fetched metadata in MangaMetaHandler.
  MangaMetaHandler.setMangaMeta(metaResult);
  // Set the initial page parameter for the reader based on the chapter.
  ExtraReaderInfo.setInitialPageParam(chapter);
  // Cleanup resources when the component unmounts.
  React.useEffect(() => {
    return () => {
      ExtraReaderInfo.cleanup();
      MangaMetaHandler.cleanup();
      GestureManager.cleanup();
    };
  }, []);
  // Return a boolean indicating if the metadata has been fetched.
  return isFetched;
}
