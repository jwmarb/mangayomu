import { ChapterSchema } from '@database/schemas/Chapter';
import { CurrentlyReadingChapter } from '@database/schemas/Manga';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface QuickReadButtonProps extends React.PropsWithChildren {
  currentlyReadingChapter?: CurrentlyReadingChapter;
  networkStatusOffset: SharedValue<number>;
  textOpacity: SharedValue<number>;
  firstChapter: ChapterSchema;
  mangaKey?: string;
}
