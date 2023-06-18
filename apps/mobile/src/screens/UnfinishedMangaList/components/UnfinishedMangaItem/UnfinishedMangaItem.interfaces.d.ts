import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';

export interface UnfinishedMangaItemProps extends React.PropsWithChildren {
  manga: MangaSchema;
  chapters: Realm.Results<ChapterSchema & Realm.Object<unknown, never>>;
}
