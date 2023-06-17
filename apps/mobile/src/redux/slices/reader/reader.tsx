import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { PageSchema } from '@database/schemas/Page';
import { getErrorMessage } from '@helpers/getErrorMessage';
import { MangaHost } from '@mangayomu/mangascraper';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { removeURLParams } from '@screens/Reader/components/ChapterPage/ChapterPage';
import { Image } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import NetInfo from '@react-native-community/netinfo';

export type Page = ChapterPage | NoMorePages | TransitionPage | ChapterError;
export type ChapterError = {
  type: 'CHAPTER_ERROR';
  error: string;
  current: { _id: string; index: number };
};
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

export interface ReaderChapterInfo {
  numberOfPages: number;
  loading: boolean;
  alreadyFetched: boolean;
  previousChapter: string | null;
  // shouldFetch: boolean // if this is false, fallback to onViewableItemsChanged. Otherwise fetch when transition page is mounted.
}

export interface ExtendedReaderPageState {
  error: boolean;
  retries: number;
  localPageUri?: string;
}

const initialExtendedState: ExtendedReaderPageState = {
  error: false,
  retries: 0,
};

export type ExtendedReaderState = ReaderState['extendedState'];

export const fetchedChapters = new Set<string>();
export const fetchingChapters = new Set<string>();
export const chapterIndices: Map<string, { start: number; end: number }> =
  new Map();
export const offsetMemo: Map<string, { min: number; max: number }> = new Map();

interface ReaderState {
  pages: Page[];
  loading: boolean;
  extendedState: Record<string, ExtendedReaderPageState | undefined>;
  currentChapter: string | null;
  showImageModal: boolean;
}

export interface FetchPagesByChapterPayload {
  chapter: ChapterSchema; // this is the chapter to fetch pages from
  manga: MangaSchema;
  availableChapters: (ChapterSchema & Realm.Object<ChapterSchema, never>)[];
  localRealm: Realm;
  source: MangaHost;
  mockError?: boolean;
}

const initialReaderState: ReaderState = {
  pages: [],
  loading: true,
  extendedState: {},
  showImageModal: false,
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

export function getCachedReaderPages(source: MangaHost) {
  return RNFetchBlob.fs.dirs['CacheDir'] + '/' + source.getName() + '/';
}

const mockError = () => {
  throw new Error('Mock error has been invoked');
};

export const fetchPagesByChapter = createAsyncThunk(
  'reader/fetchPagesByChapter',
  async (payload: FetchPagesByChapterPayload) => {
    try {
      const { isInternetReachable } = await NetInfo.fetch();
      if (!isInternetReachable) throw Error('Internet unavailable');
      fetchingChapters.add(payload.chapter._id);
      const response = await payload.source.getPages(payload.chapter);
      if (payload.mockError) mockError();
      payload.localRealm.write(() => {
        payload.chapter.numberOfPages = response.length;
      });
      const preload = Promise.all(response.map((x) => Image.prefetch(x)));
      const dimensions = Promise.all(
        response.map(async (uri) => {
          const localPage = payload.localRealm.objectForPrimaryKey(
            PageSchema,
            removeURLParams(uri),
          );

          // const fileExtension = getFileExtension(uri);
          // /**
          //  * Download image locally
          //  */
          // const path =
          //   RNFetchBlob.fs.dirs['CacheDir'] +
          //   '/' +
          //   payload.source.getName() +
          //   '/' +
          //   encodePathName(payload.manga.title) +
          //   '/' +
          //   encodePathName(payload.chapter.name) +
          //   '/' +
          //   index +
          //   `.${fileExtension}`;

          // const base64 = `data:image/${fileExtension};base64,${await RNFetchBlob.config(
          //   {
          //     path,
          //   },
          // )
          //   .fetch('GET', uri)
          //   .then((res) => res.base64() as string)}`;

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

            return {
              width,
              height,
              url: uri,
              // localPath: base64,
            };
          }
          return {
            url: uri,
            width: localPage.width,
            height: localPage.height,
            // localPath: base64,
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
      state.loading = true;
      state.pages = [];
      state.showImageModal = false;
      state.currentChapter = null;
      state.extendedState = {};
      fetchedChapters.clear();
      fetchingChapters.clear();
      offsetMemo.clear();
    },
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
    },
    toggleImageModal: (state, action: PayloadAction<boolean | undefined>) => {
      state.showImageModal = action.payload ?? !state.showImageModal;
    },
    setPageError: (
      state,
      action: PayloadAction<{ pageKey: string; value: boolean }>,
    ) => {
      state.extendedState[action.payload.pageKey] = {
        ...(state.extendedState[action.payload.pageKey] ??
          initialExtendedState),
        error: action.payload.value,
      };
      if (!action.payload.value)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.extendedState[action.payload.pageKey]!.retries++;
    },
    setLocalPageURI: (
      state,
      action: PayloadAction<{ pageKey: string; value: string }>,
    ) => {
      state.extendedState[action.payload.pageKey] = {
        ...(state.extendedState[action.payload.pageKey] ??
          initialExtendedState),
        localPageUri: action.payload.value,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPagesByChapter.fulfilled, (state, action) => {
      state.loading = false;
      fetchingChapters.delete(action.meta.arg.chapter._id);

      const previousChapter:
        | (ChapterSchema & Realm.Object<ChapterSchema, never>)
        | undefined =
        action.meta.arg.availableChapters[action.meta.arg.chapter.index + 1];
      const nextChapter:
        | (ChapterSchema & Realm.Object<ChapterSchema, never>)
        | undefined =
        action.meta.arg.availableChapters[action.meta.arg.chapter.index - 1];

      if (action.payload.error != null) {
        const current = {
          _id: action.meta.arg.chapter._id,
          index: action.meta.arg.chapter.index,
        };
        const error = getErrorMessage(action.payload.error);
        if (state.pages.length === 0)
          state.pages = [{ type: 'CHAPTER_ERROR', current, error }];
        else {
          const lastItem = state.pages[state.pages.length - 1];
          if (
            lastItem.type === 'TRANSITION_PAGE' &&
            lastItem.next._id === action.meta.arg.chapter._id
          )
            state.pages[state.pages.length - 1] = {
              type: 'CHAPTER_ERROR',
              current,
              error,
            };
          const firstItem = state.pages[0];
          if (
            firstItem.type === 'TRANSITION_PAGE' &&
            firstItem.previous._id === action.meta.arg.chapter._id
          )
            state.pages[0] = {
              type: 'CHAPTER_ERROR',
              current,
              error,
            };
        }
        return;
      }
      const shouldAppendData =
        fetchedChapters.size === 0 ||
        (previousChapter != null && fetchedChapters.has(previousChapter._id));
      const shouldPrependData =
        nextChapter != null && fetchedChapters.has(nextChapter._id);
      const shouldAddPreviousChapterTransition =
        previousChapter != null &&
        (shouldPrependData || fetchedChapters.size === 0);
      const shouldAddNextChapterTransition =
        nextChapter != null && shouldAppendData;

      const newPages: Page[] = [];

      if (shouldAddPreviousChapterTransition) {
        newPages.push({
          type: 'TRANSITION_PAGE',
          next: {
            _id: action.meta.arg.chapter._id,
            index: action.meta.arg.chapter.index,
          },
          previous: {
            _id: previousChapter._id,
            index: previousChapter.index,
          },
        });
      }

      for (let i = 0; i < action.payload.data.length; i++) {
        const page = action.payload.data[i];
        newPages.push({
          type: 'PAGE',
          chapter: action.meta.arg.chapter._id,
          height: page.height,
          width: page.width,
          page: page.url,
          pageNumber: i + 1,
        });
      }
      /**
       * Determine whether or not this chapter was refetched after an error
       */
      if (
        state.pages[state.pages.length - 1]?.type === 'CHAPTER_ERROR' &&
        previousChapter != null
      )
        state.pages[state.pages.length - 1] = {
          type: 'TRANSITION_PAGE',
          next: {
            _id: action.meta.arg.chapter._id,
            index: action.meta.arg.chapter.index,
          },
          previous: { _id: previousChapter._id, index: previousChapter.index },
        };

      if (state.pages[0]?.type === 'CHAPTER_ERROR' && nextChapter != null) {
        if (state.pages.length === 1) state.pages = [];
        else {
          state.pages[0] = {
            type: 'TRANSITION_PAGE',
            previous: {
              _id: action.meta.arg.chapter._id,
              index: action.meta.arg.chapter.index,
            },
            next: {
              _id: nextChapter._id,
              index: nextChapter.index,
            },
          };
        }
      }

      /**
       * Final mutation of state.pages
       */
      if (shouldAppendData) state.pages = state.pages.concat(newPages);

      if (shouldPrependData) {
        state.pages = newPages.concat(state.pages);
        offsetMemo.clear();
      }
      if (shouldAddNextChapterTransition) {
        state.pages.push({
          type: 'TRANSITION_PAGE',
          next: {
            _id: nextChapter._id,
            index: nextChapter.index,
          },
          previous: {
            _id: action.meta.arg.chapter._id,
            index: action.meta.arg.chapter.index,
          },
        });
      } else if (nextChapter == null) {
        state.pages.push({ type: 'NO_MORE_PAGES' });
      }

      chapterIndices.clear();

      /**
       * Traverse through each item in state.pages and add corresponding index to TransitionPages
       */
      let start = 0;
      for (let i = 0; i < state.pages.length; i++) {
        const item = state.pages[i];
        switch (item.type) {
          case 'NO_MORE_PAGES':
            chapterIndices.set(action.meta.arg.chapter._id, {
              start: start + 1,
              end: i - 1,
            });
            break;
          case 'TRANSITION_PAGE':
            if (i > start) {
              chapterIndices.set(item.previous._id, {
                start: previousChapter == null ? 0 : start + 1,
                end: i - 1,
              });

              start = i;
            }
            break;
        }
      }

      fetchedChapters.add(action.meta.arg.chapter._id);
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
      state.loading = true;
      // if (
      //   action.meta.arg.chapter._id in state.chapterInfo === false &&
      //   state.isMounted
      // ) {
      //   state.chapterInfo[action.meta.arg.chapter._id] = {
      //     loading: true,
      //     numberOfPages: 0,
      //     previousChapter: null,
      //     alreadyFetched: false,
      //   };
      //   state.loading = true;
      // }
    });
    builder.addCase(fetchPagesByChapter.rejected, (state, action) => {
      fetchingChapters.delete(action.meta.arg.chapter._id);
    });
  },
});

export const {
  resetReaderState,
  setCurrentChapter,
  // startFetchingChapter,
  // setIsOnChapterError,
  // setShowTransitionPage,
  setPageError,
  // setIsMounted,
  // setPageInDisplay,
  setLocalPageURI,
  toggleImageModal,
} = readerSlice.actions;

export default readerSlice.reducer;
