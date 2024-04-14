import React from 'react';
import { MangaViewChaptersContext } from '@/screens/MangaView/context';

export default function useMangaViewChapters() {
  return React.useContext(MangaViewChaptersContext);
}
