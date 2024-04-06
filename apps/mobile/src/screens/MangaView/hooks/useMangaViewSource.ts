import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { MangaViewMangaSourceContext } from '@/screens/MangaView/context';

export default function useMangaViewSource() {
  const ctx = React.useContext(MangaViewMangaSourceContext);
  if (ctx == null)
    throw new InvalidUseContextException(MangaViewMangaSourceContext);
  return ctx;
}
