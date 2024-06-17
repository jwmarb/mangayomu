import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { IsFetchingChapterContext } from '@/screens/Reader/context';

export default function useIsFetchingChapter() {
  const ctx = React.useContext(IsFetchingChapterContext);
  if (ctx == null) {
    throw new InvalidUseContextException(IsFetchingChapterContext);
  }
  return ctx;
}
