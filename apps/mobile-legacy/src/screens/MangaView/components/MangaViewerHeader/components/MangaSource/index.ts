export { default } from './MangaSource';
import React from 'react';

export interface MangaSourceProps extends React.PropsWithChildren {
  mangaSource: string;
}
