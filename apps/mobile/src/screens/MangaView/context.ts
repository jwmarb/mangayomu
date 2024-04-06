import { Manga, MangaMeta, MangaSource } from '@mangayomu/mangascraper';
import React from 'react';
export const MangaViewMangaSourceContext =
  React.createContext<MangaSource | null>(null);
MangaViewMangaSourceContext.displayName = 'MangaViewMangaSourceContext';

export const MangaViewFetchStatusContext = React.createContext<
  'error' | 'success' | 'pending' | null
>(null);
MangaViewFetchStatusContext.displayName = 'MangaViewFetchStatusContext';

export const SynopsisExpandedContext = React.createContext<boolean>(false);

export const MangaViewErrorContext = React.createContext<Error | null>(null);

export const MangaViewDataContext = React.createContext<
  (Manga & MangaMeta<unknown>) | null | undefined
>(null);

export const MangaViewMangaContext = React.createContext<Manga | null>(null);