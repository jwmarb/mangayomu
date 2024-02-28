export { default } from './MangaActionButtons';
import React from 'react';

export interface MangaActionButtonsProps extends React.PropsWithChildren {
  onBookmark: () => void;
  inLibrary?: boolean;
  loading: boolean;
  mangaKey?: string;
  currentlyReadingChapterKey?: string;
  firstChapterKey?: string;
}
