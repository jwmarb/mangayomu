import { MangaSchema } from '@database/schemas/Manga';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';

export interface BookListItemProps extends React.PropsWithChildren {
  manga: Manga | MangaSchema;
  start?: React.ReactNode;
  end?: React.ReactNode;
  onPress?: () => void;
}
