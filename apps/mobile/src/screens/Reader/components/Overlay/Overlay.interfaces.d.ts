import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import Realm from 'realm';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu/ImageMenu.interfaces';

export interface OverlayProps extends React.PropsWithChildren {
  opacity: SharedValue<number>;
  currentPage: number;
  mangaTitle: string;
  chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
  manga: MangaSchema & Realm.Object<MangaSchema, never>;
}

export interface ReaderSettingProps {
  type?: 'button' | 'setting';
}
