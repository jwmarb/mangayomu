import integrateSortedList from '@helpers/integrateSortedList';
import { StringComparator } from '@mangayomu/algorithms';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isToday } from 'date-fns';

export interface MangaHistory {
  manga: string; // key of the manga
  chapter: string; // key of read/current chapter
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
        (a, b) => a.manga.localeCompare(b.manga),
      );
      sortedList.remove(action.payload.item);
      if (state.sections[index].data.length === 0)
        state.sections.splice(index, 1);
    },
    addMangaToHistory: (
      state,
      action: PayloadAction<{ manga: string; chapter: string }>,
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
          const sortedList = integrateSortedList(recentSection.data, (a, b) =>
            a.manga.localeCompare(b.manga),
          );
          const index = sortedList.indexOf({
            manga: action.payload.manga,
            chapter: action.payload.chapter,
            date: dateNow,
          });
          if (index === -1)
            sortedList.add({
              manga: action.payload.manga,
              chapter: action.payload.chapter,
              date: dateNow,
            });
          else
            recentSection.data[index] = {
              manga: action.payload.manga,
              chapter: action.payload.chapter,
              date: dateNow,
            }; // It is OK to replace this because the `manga` will stay the same. The only thing changing is the chapter
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
