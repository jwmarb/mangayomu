import React from 'react';
import { MangaViewUnparsedDataContext } from '@/screens/MangaView/context';

export default function useMangaViewUnparsedData() {
  const ctx = React.useContext(MangaViewUnparsedDataContext);

  return ctx;
}
