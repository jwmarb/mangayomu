import { ChapterPageContextState } from '@screens/Reader/components/ChapterPage/';
import React from 'react';

export const ChapterPageContext = React.createContext<
  ChapterPageContextState | undefined
>(undefined);
export const useChapterPageContext = () => {
  const ctx = React.useContext(ChapterPageContext);
  if (ctx == null)
    throw Error('ChapterPage must be a child of ChapterPageContext');
  return ctx;
};
