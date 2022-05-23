import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';
import React from 'react';

export const ChapterContext = React.createContext<
  [mode: ChapterPressableMode, setMode: React.Dispatch<React.SetStateAction<ChapterPressableMode>>]
>([] as any);

export const useChapterContext = () => React.useContext(ChapterContext);
