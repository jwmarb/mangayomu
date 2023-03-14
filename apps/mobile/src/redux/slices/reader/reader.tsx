import { getErrorMessage } from '@helpers/getErrorMessage';
import { MangaChapter, MangaHost } from '@mangayomu/mangascraper';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Page = ChapterError | ChapterPage | NoMorePages;

export type ChapterPage = { type: 'PAGE'; page: string; pageNumber: number };
export type NoMorePages = { type: 'NO_MORE_PAGES' };
export type ChapterError = {
  type: 'CHAPTER_ERROR';
  chapter: string;
  error: string;
};

interface ReaderChapterInfo {
  numberOfPages: number;
  offsetIndex: number;
}

interface ReaderState {
  pages: Page[];
  loading: boolean;
  chapterInfo: Record<string, ReaderChapterInfo>;
  currentChapter: string | null;
}

interface FetchPagesByChapterPayload {
  chapter: MangaChapter;
  source: MangaHost;
}

const initialReaderState: ReaderState = {
  pages: [],
  loading: true,
  chapterInfo: {},
  currentChapter: null,
};

export const fetchPagesByChapter = createAsyncThunk(
  'reader/fetchPagesByChapter',
  async (payload: FetchPagesByChapterPayload) => {
    try {
      const response = await payload.source.getPages(payload.chapter);
      return {
        data: response,
        chapter: payload.chapter,
      };
    } catch (e) {
      return {
        error: e,
        chapter: payload.chapter,
        data: [],
      };
    }
  },
);

const readerSlice = createSlice({
  name: 'reader',
  initialState: initialReaderState,
  reducers: {
    resetReaderState: (state) => {
      state.chapterInfo = {};
      state.loading = true;
      state.pages = [];
      state.currentChapter = null;
    },
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPagesByChapter.fulfilled, (state, action) => {
      state.chapterInfo[action.payload.chapter.link] = {
        numberOfPages: action.payload.data.length,
        offsetIndex: state.pages.length - 1,
      };
      for (let i = 0; i < action.payload.data.length; i++) {
        state.pages.push({
          type: 'PAGE',
          page: action.payload.data[i],
          pageNumber: i + 1,
        });
      }
      state.loading = false;
    });
    builder.addCase(fetchPagesByChapter.rejected, (state, action) => {
      state.pages.push({
        type: 'CHAPTER_ERROR',
        error: getErrorMessage((action.payload as any).error),
        chapter: (action.payload as any).chapter,
      });
      state.loading = false;
    });
    builder.addCase(fetchPagesByChapter.pending, (state) => {
      state.loading = true;
    });
  },
});

export const { resetReaderState, setCurrentChapter } = readerSlice.actions;

export default readerSlice.reducer;
