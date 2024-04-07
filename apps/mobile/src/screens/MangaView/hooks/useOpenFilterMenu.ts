import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { MangaViewOpenFilterMenuContext } from '@/screens/MangaView/context';

export default function useOpenFilterMenu() {
  const ctx = React.useContext(MangaViewOpenFilterMenuContext);
  if (ctx == null)
    throw new InvalidUseContextException(MangaViewOpenFilterMenuContext);
  return ctx;
}
