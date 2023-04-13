import { ChapterSchema } from '@database/schemas/Chapter';
import { TransitionPage } from '@redux/slices/reader';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu/ImageMenu.interfaces';
import React from 'react';
import Realm from 'realm';
import { TapGesture } from 'react-native-gesture-handler';
import { MangaHost } from '@mangayomu/mangascraper';

export interface TransitionPageProps extends React.PropsWithChildren {
  page: TransitionPage;
}

export interface TransitionPageContextState {
  tapGesture: TapGesture;
  backgroundColor: ReaderBackgroundColor;
  currentChapter: ChapterSchema;
  showTransitionPage: boolean;
}
