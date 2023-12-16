import React from 'react';
export { default } from './MangaSearchResult';

export interface MangaSearchResultProps extends React.PropsWithChildren {
  source: string;
}
