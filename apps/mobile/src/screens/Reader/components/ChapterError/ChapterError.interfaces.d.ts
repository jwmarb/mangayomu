import { ChapterError } from '@redux/slices/reader';
import useChapterFetcher from '@screens/Reader/hooks/useChapterFetcher';
import React from 'react';

export interface ChapterErrorProps extends React.PropsWithChildren {
  data: ChapterError;
}

export type ChapterErrorContextState = ReturnType<typeof useChapterFetcher>;
