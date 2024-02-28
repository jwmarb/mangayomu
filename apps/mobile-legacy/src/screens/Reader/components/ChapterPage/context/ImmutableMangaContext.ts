import { Manga } from '@mangayomu/mangascraper/src';
import React from 'react';

export const ImmutableMangaContext = React.createContext<Manga | undefined>(
  undefined,
);
export const useImmutableManga = () => {
  const ctx = React.useContext(ImmutableMangaContext);
  if (ctx == null)
    throw Error('ChapterPage must be a child of ImmutableMangaContext');
  return ctx;
};
