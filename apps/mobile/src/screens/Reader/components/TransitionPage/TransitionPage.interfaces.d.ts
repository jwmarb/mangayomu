import { ChapterSchema } from '@database/schemas/Chapter';
import { TransitionPage } from '@redux/slices/reader';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import React from 'react';
import { TapGesture } from 'react-native-gesture-handler';

export interface TransitionPageProps extends React.PropsWithChildren {
  page: TransitionPage;
}

export interface TransitionPageContextState {
  tapGesture: TapGesture;
  backgroundColor: ReaderBackgroundColor;
  currentChapter: ChapterSchema;
  showTransitionPage: boolean;
}
