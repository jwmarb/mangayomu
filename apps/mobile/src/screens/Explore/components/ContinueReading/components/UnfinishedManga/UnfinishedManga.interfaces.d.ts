import { MangaSchema } from '@database/schemas/Manga';
import { ChapterSchema } from '@database/schemas/Chapter';
import React from 'react';

export interface UnfinishedMangaProps extends React.PropsWithChildren {
  manga: MangaSchema & Realm.Object<unknown, never>;
  chapters: Realm.Results<ChapterSchema & Realm.Object<unknown, never>>;
}
