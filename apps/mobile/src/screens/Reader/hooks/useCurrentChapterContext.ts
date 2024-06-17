import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { CurrentChapterContext } from '@/screens/Reader/context';

export default function useCurrentChapterContext() {
  const ctx = React.useContext(CurrentChapterContext);
  if (ctx == null) {
    throw new InvalidUseContextException(CurrentChapterContext);
  }
  return ctx;
}
