import React from 'react';

export interface LiveMangaPreviewProps extends React.PropsWithChildren {
  setBookTitle: (str: string) => void;
  bookTitle: string;
  setImageURL: (str: string) => void;
  imageURL: string;
  setSource: (str: string) => void;
  onLibraryPreview: () => void;
}
