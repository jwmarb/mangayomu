import React from 'react';
import { ExtendedMangaListMangasLengthContext } from '@/screens/ExtendedMangaList/context';

export default function useExtendedMangaListMangasLength() {
  return React.useContext(ExtendedMangaListMangasLengthContext);
}
