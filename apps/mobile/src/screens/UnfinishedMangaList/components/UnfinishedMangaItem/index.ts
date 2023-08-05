export { default } from './UnfinishedMangaItem';
import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';

export interface UnfinishedMangaItemProps extends React.PropsWithChildren {
  manga: MangaSchema;
}
