import React from 'react';

export interface MangaActionButtonsProps extends React.PropsWithChildren {
  onBookmark: () => void;
  inLibrary?: boolean;
}
