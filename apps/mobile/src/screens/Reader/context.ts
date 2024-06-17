import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';

export const CurrentChapterContext = React.createContext<MangaChapter | null>(
  null,
);

export const IsFetchingChapterContext = React.createContext<boolean>(false);
