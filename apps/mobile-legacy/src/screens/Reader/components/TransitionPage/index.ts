export { default } from './TransitionPage';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { TransitionPage } from '@redux/slices/reader';
import React from 'react';
import { TapGesture } from 'react-native-gesture-handler';

export interface TransitionPageProps extends React.PropsWithChildren {
  page: TransitionPage;
}

export interface TransitionPageContextState {
  tapGesture: TapGesture;
  currentChapter: LocalChapterSchema;
}
