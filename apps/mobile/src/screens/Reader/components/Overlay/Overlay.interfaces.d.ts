import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import Realm from 'realm';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';

export interface OverlayProps extends React.PropsWithChildren {
  opacity: SharedValue<number>;
  active: boolean;
  mangaTitle: string;
  chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
  manga: MangaSchema & Realm.Object<MangaSchema, never>;
}
