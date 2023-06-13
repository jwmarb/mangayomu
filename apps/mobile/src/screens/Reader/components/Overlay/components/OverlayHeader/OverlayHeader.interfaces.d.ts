import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface OverlayHeaderProps {
  style: {
    opacity: number;
  };
  opacity: SharedValue<number>;
  mangaTitle: string;
  chapterTitle: string;
  onOpenSettingsMenu: () => void;
  onBookmark: () => void;
  onBack: () => void;
  onTitlePress: () => void;
  isBookmarked: boolean;
}
