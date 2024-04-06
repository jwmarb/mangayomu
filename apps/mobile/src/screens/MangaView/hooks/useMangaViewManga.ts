import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { MangaViewMangaContext } from '@/screens/MangaView/context';

export default function useMangaViewManga() {
  const ctx = React.useContext(MangaViewMangaContext);
  if (ctx == null) throw new InvalidUseContextException(MangaViewMangaContext);
  return ctx;
}
