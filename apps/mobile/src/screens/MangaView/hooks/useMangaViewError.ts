import React from 'react';
import { MangaViewErrorContext } from '@/screens/MangaView/context';

export default function useMangaViewError() {
  return React.useContext(MangaViewErrorContext);
}
