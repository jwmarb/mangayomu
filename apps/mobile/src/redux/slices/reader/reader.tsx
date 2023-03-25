import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { PageSchema } from '@database/schemas/Page';
import { getErrorMessage } from '@helpers/getErrorMessage';
import { MangaChapter, MangaHost } from '@mangayomu/mangascraper';
import { AppState } from '@redux/main';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { removeURLParams } from '@screens/Reader/components/ChapterPage/ChapterPage';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

export type Page = ChapterError | ChapterPage | NoMorePages | TransitionPage;
export type TransitionPage = {
  type: 'TRANSITION_PAGE';
  previous: { _id: string; index: number };
  next: { _id: string; index: number };
};
export type ChapterPage = {
  type: 'PAGE';
  page: string;
  pageNumber: number;
  chapter: string;
  width: number;
  height: number;
};
export type NoMorePages = { type: 'NO_MORE_PAGES' };
export type ChapterError = {
  type: 'CHAPTER_ERROR';
  chapter: string;
  error: string;
};

export interface ReaderChapterInfo {
  numberOfPages: number;
  loading: boolean;
  alreadyFetched: boolean;
  previousChapter: string | null;
  // shouldFetch: boolean // if this is false, fallback to onViewableItemsChanged. Otherwise fetch when transition page is mounted.
}

interface ReaderState {
  pages: Page[];
  loading: boolean;

  chapterInfo: Record<string, ReaderChapterInfo>;
  currentChapter: string | null;
}

export interface FetchPagesByChapterPayload {
  chapter: ChapterSchema; // this is the chapter to fetch pages from
  availableChapters: (ChapterSchema & Realm.Object<ChapterSchema, never>)[];
  localRealm: Realm;
  source: MangaHost;
  offsetIndex: React.MutableRefObject<
    Record<string, { start: number; end: number }>
  >;
}

const initialReaderState: ReaderState = {
  pages: [],
  loading: true,
  chapterInfo: {},
  currentChapter: null,
};

function getImageSizeAsync(
  uri: string,
): Promise<{ width: number; height: number }> {
  return new Promise((res, rej) => {
    Image.getSize(
      uri,
      (width, height) => res({ width, height }),
      (err) => rej(err),
    );
  });
}

export const fetchPagesByChapter = createAsyncThunk(
  'reader/fetchPagesByChapter',
  async (payload: FetchPagesByChapterPayload) => {
    try {
      const response = await payload.source.getPages(payload.chapter);
      FastImage.preload(response.map((x) => ({ uri: x })));
      const data = await Promise.all(
        response.map(async (uri) => {
          const localPage = payload.localRealm.objectForPrimaryKey(
            PageSchema,
            removeURLParams(uri),
          );
          if (localPage == null) {
            const { width, height } = await getImageSizeAsync(uri);
            payload.localRealm.write(() => {
              payload.localRealm.create<PageSchema>(
                'Page',
                {
                  _id: removeURLParams(uri),
                  _chapterId: payload.chapter._id,
                  _mangaId: payload.chapter._mangaId,
                  width,
                  height,
                },
                Realm.UpdateMode.Modified,
              );
            });
            return { width, height, url: uri };
          }
          return {
            url: uri,
            width: localPage.width,
            height: localPage.height,
          };
        }),
      );

      return {
        type: 'response' as const,
        data,
      };
    } catch (e) {
      console.error(e);
      return {
        type: 'error' as const,
        error: e,

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
    startFetchingChapter: (state, action: PayloadAction<string>) => {
      if (!state.chapterInfo[action.payload].alreadyFetched)
        state.chapterInfo[action.payload] = {
          loading: true,
          numberOfPages: 0,
          previousChapter: null,
          alreadyFetched: false,
        };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPagesByChapter.fulfilled, (state, action) => {
      if (action.payload == null) return;
      const previousChapter:
        | (ChapterSchema & Realm.Object<ChapterSchema, never>)
        | undefined =
        action.meta.arg.availableChapters[action.meta.arg.chapter.index + 1];
      const nextChapter:
        | (ChapterSchema & Realm.Object<ChapterSchema, never>)
        | undefined =
        action.meta.arg.availableChapters[action.meta.arg.chapter.index - 1];
      state.chapterInfo[action.meta.arg.chapter._id] = {
        numberOfPages: action.payload.data.length,
        previousChapter: previousChapter?._id ?? null,
        loading: false,
        alreadyFetched: true,
      };
      action.meta.arg.localRealm.write(() => {
        if (action.payload != null)
          action.meta.arg.chapter.numberOfPages = action.payload.data.length;
      });

      if (state.pages.length === 0) {
        action.meta.arg.offsetIndex.current[action.meta.arg.chapter._id] = {
          start: previousChapter == null ? 0 : 1,
          end: action.payload.data.length - (previousChapter == null ? 1 : 0),
        };

        if (previousChapter != null)
          state.pages.push({
            type: 'TRANSITION_PAGE',
            previous: {
              _id: previousChapter._id,
              index: previousChapter.index,
            },
            next: {
              _id: action.meta.arg.chapter._id,
              index: action.meta.arg.chapter.index,
            },
          });
        for (let i = 0; i < action.payload.data.length; i++) {
          state.pages.push({
            type: 'PAGE',
            page: action.payload.data[i].url,
            width: action.payload.data[i].width,
            height: action.payload.data[i].height,
            pageNumber: i + 1,
            chapter: action.meta.arg.chapter.link,
          });
        }
        if (nextChapter != null)
          state.pages.push({
            type: 'TRANSITION_PAGE',
            previous: {
              _id: action.meta.arg.chapter._id,
              index: action.meta.arg.chapter.index,
            },
            next: { _id: nextChapter._id, index: nextChapter.index },
          });
        else state.pages.push({ type: 'NO_MORE_PAGES' });
      } else {
        // Determine where to append fetched pages based
        if (
          previousChapter != null &&
          previousChapter.link in state.chapterInfo
        ) {
          // Assume this is the NEXT chapter we are fetching
          action.meta.arg.offsetIndex.current[action.meta.arg.chapter._id] = {
            start: state.pages.length,
            end: state.pages.length + action.payload.data.length - 1,
          };

          for (let i = 0; i < action.payload.data.length; i++) {
            state.pages.push({
              type: 'PAGE',
              page: action.payload.data[i].url,
              width: action.payload.data[i].width,
              height: action.payload.data[i].height,
              pageNumber: i + 1,
              chapter: action.meta.arg.chapter.link,
            });
          }
          if (nextChapter != null)
            state.pages.push({
              type: 'TRANSITION_PAGE',
              previous: {
                _id: action.meta.arg.chapter._id,
                index: action.meta.arg.chapter.index,
              },
              next: { _id: nextChapter._id, index: nextChapter.index },
            });
          else state.pages.push({ type: 'NO_MORE_PAGES' });
        }
        if (nextChapter != null && nextChapter.link in state.chapterInfo) {
          // Assume this is the PREVIOUS chapter we are fetching
          const newArray: Page[] = [];
          if (previousChapter != null)
            newArray.push({
              type: 'TRANSITION_PAGE',
              previous: {
                _id: previousChapter._id,
                index: previousChapter.index,
              },
              next: {
                _id: action.meta.arg.chapter._id,
                index: action.meta.arg.chapter.index,
              },
            });
          for (let i = 0; i < action.payload.data.length; i++) {
            newArray.push({
              type: 'PAGE',
              page: action.payload.data[i].url,
              width: action.payload.data[i].width,
              height: action.payload.data[i].height,
              pageNumber: i + 1,
              chapter: action.meta.arg.chapter.link,
            });
          }
          for (const key in action.meta.arg.offsetIndex.current) {
            action.meta.arg.offsetIndex.current[key].start += newArray.length;
            action.meta.arg.offsetIndex.current[key].end += newArray.length;
          }
          action.meta.arg.offsetIndex.current[action.meta.arg.chapter._id] = {
            start: 0,
            end: action.payload.data.length - 1,
          };
          state.pages = newArray.concat(state.pages);
        }
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
    builder.addCase(fetchPagesByChapter.pending, (state, action) => {
      if (action.meta.arg.chapter._id in state.chapterInfo === false) {
        state.chapterInfo[action.meta.arg.chapter._id] = {
          loading: true,
          numberOfPages: 0,
          previousChapter: null,
          alreadyFetched: false,
        };
        state.loading = true;
      }
    });
  },
});

export const { resetReaderState, setCurrentChapter, startFetchingChapter } =
  readerSlice.actions;

export default readerSlice.reducer;
