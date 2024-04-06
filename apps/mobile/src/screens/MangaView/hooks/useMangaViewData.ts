import React from 'react';
import { MangaViewDataContext } from '@/screens/MangaView/context';

export default function useMangaViewData() {
  return React.useContext(MangaViewDataContext);
}
