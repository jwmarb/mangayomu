import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { MangaViewFetchStatusContext } from '@/screens/MangaView/MangaView';

export default function useMangaViewFetchStatus() {
  const ctx = React.useContext(MangaViewFetchStatusContext);
  if (ctx == null)
    throw new InvalidUseContextException(MangaViewFetchStatusContext);
  return ctx;
}
