import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import MangaMetaHandler from '@/screens/Reader/helpers/MangaMetaHandler';
import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { create } from 'zustand';

export type CurrentChapterStore = {
  currentChapter: MangaChapter | null;
  setCurrentChapter: (chapter: MangaChapter) => void;
  onInitialize: (chapter: unknown) => void;
};

export const useCurrentChapter = create<CurrentChapterStore>((set, get) => ({
  currentChapter: null,
  setCurrentChapter: (chapter: MangaChapter) =>
    set(() => ({ currentChapter: chapter })),
  reset: () => set({ currentChapter: null }),
  onInitialize: (chapter) => {
    if (get().currentChapter == null) {
      set({
        currentChapter: ExtraReaderInfo.getSource().toChapter(
          chapter,
          MangaMetaHandler.getTMangaMeta(),
        ),
      });
    }
    React.useEffect(() => {
      set({
        currentChapter: ExtraReaderInfo.getSource().toChapter(
          chapter,
          MangaMetaHandler.getTMangaMeta(),
        ),
      });
    }, [chapter]);
    React.useEffect(() => {
      return () => {
        set({ currentChapter: null });
      };
    }, []);
  },
}));
