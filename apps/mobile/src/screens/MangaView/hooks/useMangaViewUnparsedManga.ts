import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { MangaViewUnparsedMangaContext } from '@/screens/MangaView/context';

export default function useMangaViewUnparsedManga(): unknown {
  const ctx = React.useContext(MangaViewUnparsedMangaContext);
  if (ctx == null)
    throw new InvalidUseContextException(MangaViewUnparsedMangaContext);
  return ctx;
}
