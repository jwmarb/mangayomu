import { MangaSource } from '@mangayomu/mangascraper';
import React from 'react';
export const MangaViewMangaSourceContext =
  React.createContext<MangaSource | null>(null);
MangaViewMangaSourceContext.displayName = 'MangaViewMangaSourceContext';

export const MangaViewFetchStatusContext = React.createContext<
  'error' | 'success' | 'pending' | null
>(null);
MangaViewFetchStatusContext.displayName = 'MangaViewFetchStatusContext';

export const SynopsisExpandedContext = React.createContext<boolean>(false);
