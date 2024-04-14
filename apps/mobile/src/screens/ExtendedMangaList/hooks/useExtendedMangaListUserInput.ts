import React from 'react';
import { ExtendedMangaListUserInputContext } from '@/screens/ExtendedMangaList/context';

export default function useExtendedMangaListUserInput() {
  return React.useContext(ExtendedMangaListUserInputContext);
}
