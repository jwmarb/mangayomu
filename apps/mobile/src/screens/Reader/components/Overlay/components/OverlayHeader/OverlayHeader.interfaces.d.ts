import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface OverlayHeaderProps {
  style: {
    opacity: number;
  };
  opacity: SharedValue<number>;
  manga: MangaSchema & Realm.Object<MangaSchema, never>;
  chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
  onOpenSettingsMenu: () => void;
  onBookmark: () => void;
}
