import integrateSortedList from '@helpers/integrateSortedList';
import { Manga, MangaChapter } from '@mangayomu/mangascraper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isToday } from 'date-fns';

export interface MangaHistory {
  manga: Manga; // key of the manga
  chapter: MangaChapter; // key of read/current chapter
  date: number; // the exact date when this chapter was read
}

export interface HistorySection {
  data: MangaHistory[];
  date: number;
}

export interface HistoryState {
  sections: HistorySection[];
  incognito: boolean; // toggles whether or not to track history
}

const initialState: HistoryState = {
  sections: [],
  incognito: false,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    toggleIncognitoMode: (state) => {
      state.incognito = !state.incognito;
    },
    deleteMangaFromHistory: (
      state,
      action: PayloadAction<{ sectionDate: number; item: MangaHistory }>,
    ) => {
      let index = 0;
      for (let i = 0; i < state.sections.length; i++) {
        if (state.sections[i].date === action.payload.sectionDate) {
          index = i;
          break;
        }
      }
      const sortedList = integrateSortedList(
        state.sections[index].data,
        (a, b) => a.manga.link.localeCompare(b.manga.link),
      );
      sortedList.remove(action.payload.item);
      if (state.sections[index].data.length === 0)
        state.sections.splice(index, 1);
    },
    addMangaToHistory: (
      state,
      action: PayloadAction<{ manga: Manga; chapter: MangaChapter }>,
    ) => {
      if (!state.incognito) {
        if (
          state.sections.length === 0 ||
          !isToday(state.sections[state.sections.length - 1]?.date)
        ) {
          state.sections.push({ data: [], date: Date.now() });
        }
        const recentSection = state.sections[state.sections.length - 1];
        const dateNow = Date.now();
        if (recentSection.data.length === 0) {
          recentSection.data.push({
            manga: action.payload.manga,
            chapter: action.payload.chapter,
            date: dateNow,
          });
        } else {
          const sortedList = integrateSortedList(
            recentSection.data,
            (a, b) => a.date - b.date,
          );
          const index = recentSection.data.findIndex(
            (x) => x.manga.link === action.payload.manga.link,
          ); // Linear search is more than sufficient enough here
          if (index === -1)
            sortedList.add({
              manga: action.payload.manga,
              chapter: action.payload.chapter,
              date: dateNow,
            });
          else {
            recentSection.data[index] = {
              manga: action.payload.manga,
              chapter: action.payload.chapter,
              date: dateNow,
            }; // It is OK to replace this because the `manga` will stay the same. The only thing changing is the chapter
            sortedList.insertionSort();
          }
        }
      }
    },
    clearMangaHistory: (state) => {
      state.sections = [];
    },
  },
});

export const {
  addMangaToHistory,
  clearMangaHistory,
  toggleIncognitoMode,
  deleteMangaFromHistory,
} = historySlice.actions;
export default historySlice.reducer;
