import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { PageSchema } from '@database/schemas/Page';
import { getErrorMessage } from '@helpers/getErrorMessage';
import { MangaChapter, MangaHost } from '@mangayomu/mangascraper';
import { AppState } from '@redux/main';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFileExtension,
  removeURLParams,
} from '@screens/Reader/components/ChapterPage/ChapterPage';
import { Dimensions, Image, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';

export type Page = ChapterError | ChapterPage | NoMorePages | TransitionPage;
export type TransitionPage = {
  type: 'TRANSITION_PAGE';
  previous: { _id: string; index: number };
  next: { _id: string; index: number };
};
export type ChapterPage = {
  type: 'PAGE';
  page: string;
  localPageUri: string;
  pageNumber: number;
  chapter: string;
  width: number;
  height: number;
  error?: boolean;
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
  isOnChapterError: boolean | null;
  chapterInfo: Record<string, ReaderChapterInfo>;
  currentChapter: string | null;
  pageInDisplay: {
    parsedKey: string;
    url: string;
    chapter: string;
  } | null;
  showTransitionPage: boolean;
  isMounted: boolean;
}

export interface FetchPagesByChapterPayload {
  chapter: ChapterSchema; // this is the chapter to fetch pages from
  manga: MangaSchema;
  availableChapters: (ChapterSchema & Realm.Object<ChapterSchema, never>)[];
  localRealm: Realm;
  source: MangaHost;
  offsetIndex: React.MutableRefObject<
    Record<string, { start: number; end: number }>
  >;
  fetchedPreviousChapter?: React.MutableRefObject<boolean>;
  mockSuccess?: boolean; // remove later
}

const initialReaderState: ReaderState = {
  pages: [],
  loading: true,
  chapterInfo: {},
  currentChapter: null,
  pageInDisplay: null,
  isOnChapterError: null,
  showTransitionPage: false,
  isMounted: false,
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

function encodePathName(uri: string) {
  return uri.replace(/[^A-Za-z0-9\s-]/g, '');
}

export const fetchPagesByChapter = createAsyncThunk(
  'reader/fetchPagesByChapter',
  async (payload: FetchPagesByChapterPayload) => {
    try {
      const response = await payload.source.getPages(payload.chapter);
      const preload = Promise.all(response.map((x) => Image.prefetch(x)));
      const dimensions = Promise.all(
        response.map(async (uri, index) => {
          const localPage = payload.localRealm.objectForPrimaryKey(
            PageSchema,
            removeURLParams(uri),
          );

          const fileExtension = getFileExtension(uri);
          /**
           * Download image locally
           */
          const path =
            RNFetchBlob.fs.dirs['CacheDir'] +
            '/' +
            payload.source.getName() +
            '/' +
            encodePathName(payload.manga.title) +
            '/' +
            encodePathName(payload.chapter.name) +
            '/' +
            index +
            `.${fileExtension}`;

          const imageExists = await RNFetchBlob.fs.exists(path);
          const base64 = `data:image/${fileExtension};base64,${
            imageExists
              ? ((await RNFetchBlob.fs.readFile(path, 'base64')) as string)
              : await RNFetchBlob.config({
                  path,
                })
                  .fetch('GET', uri)
                  .then((res) => res.base64() as string)
          }`;
          if (localPage == null) {
            const { width, height } = await getImageSizeAsync(base64);
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

            return {
              width,
              height,
              url: uri,
              localPath: base64,
            };
          }
          return {
            url: uri,
            width: localPage.width,
            height: localPage.height,
            localPath: base64,
          };
        }),
      );

      const [data] = await Promise.all([dimensions, preload]);

      return {
        type: 'response' as const,
        data,
      };
    } catch (e) {
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
      state.isOnChapterError = null;
      state.showTransitionPage = false;
      state.pageInDisplay = null;
      state.isMounted = false;
    },
    setIsMounted: (state, action: PayloadAction<boolean>) => {
      state.isMounted = action.payload;
    },
    setPageInDisplay: (
      state,
      action: PayloadAction<{
        parsedKey: string;
        url: string;
        chapter: string;
      }>,
    ) => {
      state.pageInDisplay = action.payload;
    },
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
    },
    setIsOnChapterError: (state, action: PayloadAction<boolean>) => {
      state.isOnChapterError = action.payload;
    },
    setShowTransitionPage: (state, action: PayloadAction<boolean>) => {
      state.showTransitionPage = action.payload;
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
    setPageError: (
      state,
      action: PayloadAction<{ index: number; value: boolean }>,
    ) => {
      (state.pages[action.payload.index] as ChapterPage).error =
        action.payload.value;
      state.pages = [...state.pages];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPagesByChapter.fulfilled, (state, action) => {
      if (action.payload == null || !state.isMounted) return;

      const previousChapter:
        | (ChapterSchema & Realm.Object<ChapterSchema, never>)
        | undefined =
        action.meta.arg.availableChapters[action.meta.arg.chapter.index + 1];
      const nextChapter:
        | (ChapterSchema & Realm.Object<ChapterSchema, never>)
        | undefined =
        action.meta.arg.availableChapters[action.meta.arg.chapter.index - 1];
      if (action.payload.type === 'error') {
        state.isOnChapterError = true;
        if (state.pages.length === 0) {
          state.pages[0] = {
            type: 'CHAPTER_ERROR',
            error: getErrorMessage(action.payload.error),
            chapter: action.meta.arg.chapter._id,
          };
        } else if (
          previousChapter != null &&
          previousChapter._id in state.chapterInfo
        ) {
          state.pages[state.pages.length - 1] = {
            type: 'CHAPTER_ERROR',
            error: getErrorMessage(action.payload.error),
            chapter: action.meta.arg.chapter._id,
          };
        } else if (
          nextChapter != null &&
          nextChapter._id in state.chapterInfo
        ) {
          state.pages[0] = {
            type: 'CHAPTER_ERROR',
            error: getErrorMessage(action.payload.error),
            chapter: action.meta.arg.chapter._id,
          };
        }
        state.loading = false;
        delete state.chapterInfo[action.meta.arg.chapter._id];
        return;
      }
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

      if (
        state.pages.length === 0 ||
        (state.pages.length === 1 && state.pages[0].type === 'CHAPTER_ERROR')
      ) {
        state.isOnChapterError = false;
        action.meta.arg.offsetIndex.current[action.meta.arg.chapter._id] = {
          start: previousChapter == null ? 0 : 1,
          end: action.payload.data.length - (previousChapter == null ? 1 : 0),
        };
        if (state.pages.length === 1 && state.pages[0].type === 'CHAPTER_ERROR')
          state.pages = [];

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
            localPageUri: action.payload.data[i].localPath,
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

          if (state.pages[state.pages.length - 1].type === 'CHAPTER_ERROR')
            state.pages[state.pages.length - 1] = {
              type: 'TRANSITION_PAGE',
              next: {
                _id: action.meta.arg.chapter._id,
                index: action.meta.arg.chapter.index,
              },
              previous: {
                _id: previousChapter._id,
                index: previousChapter.index,
              },
            };

          for (let i = 0; i < action.payload.data.length; i++) {
            state.pages.push({
              type: 'PAGE',
              page: action.payload.data[i].url,
              width: action.payload.data[i].width,
              height: action.payload.data[i].height,
              pageNumber: i + 1,
              chapter: action.meta.arg.chapter.link,
              localPageUri: action.payload.data[i].localPath,
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
          if (action.meta.arg.fetchedPreviousChapter == null)
            throw Error(
              'When fetching a previous chapter, fetchedPreviousChapter must be passed.',
            );
          action.meta.arg.fetchedPreviousChapter.current = true;
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
              localPageUri: action.payload.data[i].localPath,
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
          if (state.pages[0].type === 'CHAPTER_ERROR')
            state.pages[0] = {
              type: 'TRANSITION_PAGE',
              previous: {
                _id: action.meta.arg.chapter._id,
                index: action.meta.arg.chapter.index,
              },
              next: { _id: nextChapter._id, index: nextChapter.index },
            };
          state.pages = newArray.concat(state.pages);
        }
      }
      state.loading = false;
    });
    // builder.addCase(fetchPagesByChapter.rejected, (state, action) => {
    //   state.pages.push({
    //     type: 'CHAPTER_ERROR',
    //     error: getErrorMessage((action.payload as any).error),
    //     chapter: action.meta.arg.chapter._id,
    //   });
    //   state.loading = false;
    // });
    builder.addCase(fetchPagesByChapter.pending, (state, action) => {
      if (
        action.meta.arg.chapter._id in state.chapterInfo === false &&
        state.isMounted
      ) {
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

export const {
  resetReaderState,
  setCurrentChapter,
  startFetchingChapter,
  setIsOnChapterError,
  setShowTransitionPage,
  setPageError,
  setIsMounted,
  setPageInDisplay,
} = readerSlice.actions;

export default readerSlice.reducer;
