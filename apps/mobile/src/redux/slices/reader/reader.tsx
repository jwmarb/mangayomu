import { ChapterSchema } from '@database/schemas/Chapter';
import { PageSchema } from '@database/schemas/Page';
import { getErrorMessage } from '@helpers/getErrorMessage';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Image } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import NetInfo from '@react-native-community/netinfo';
import removeURLParams from '@screens/Reader/components/ChapterPage/helpers/removeURLParams';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { useUser } from '@realm/react';
import { CombinedMangaWithLocal } from '@hooks/useCombinedMangaWithLocal';

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
  chapterId: Realm.BSON.ObjectId;
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
  currentChapterId: Realm.BSON.ObjectId | null;
  showImageModal: boolean;
  pageAspectRatio: number;
}

export interface FetchPagesByChapterPayload {
  chapter: LocalChapterSchema; // this is the chapter to fetch pages from
  manga: CombinedMangaWithLocal;
  availableChapters: Realm.Results<LocalChapterSchema>;
  localRealm: Realm;
  realm: Realm;
  user: ReturnType<typeof useUser>;
  source: MangaHost;
  mockError?: boolean;
}

const initialReaderState: ReaderState = {
  pages: [],
  loading: true,
  extendedState: {},
  showImageModal: false,
  currentChapter: null,
  currentChapterId: null,
  pageAspectRatio: 0.7, // It's common for manga pages to be within 0.69 to 0.71 for aspect ratio ( width / height )
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
  return RNFetchBlob.fs.dirs['CacheDir'] + '/' + source.name + '/';
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
      const response = await payload.source.getPages({
        date: payload.chapter.date,
        index: payload.chapter.index,
        link: payload.chapter._id,
        name: payload.chapter.name,
      });
      if (payload.mockError) mockError();
      const chapterWithData = payload.realm
        .objects(ChapterSchema)
        .filtered('link = $0', payload.chapter._id)[0];
      payload.realm.write(() => {
        payload.realm.create(
          ChapterSchema,
          {
            _id: chapterWithData?._id,
            link: payload.chapter._id,
            _realmId: payload.user.id,
            _mangaId: payload.manga._id,
            numberOfPages: response.length,
          },
          Realm.UpdateMode.Modified,
        );
      });
      const preload = Promise.all(response.map((x) => Image.prefetch(x)));
      const dimensions = Promise.all(
        response.map(async (uri) => {
          const localPage = payload.localRealm.objectForPrimaryKey(
            PageSchema,
            removeURLParams(uri),
          );

          // const fileExtension = 1(uri);
          // /**
          //  * Download image locally
          //  */
          // const path =
          //   RNFetchBlob.fs.dirs['CacheDir'] +
          //   '/' +
          //   payload.source.name +
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
                PageSchema,
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
    setCurrentChapter: (
      state,
      action: PayloadAction<{ link: string; id: Realm.BSON.ObjectId }>,
    ) => {
      state.currentChapter = action.payload.link;
      state.currentChapterId = action.payload.id;
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

      const previousChapter: LocalChapterSchema | undefined =
        action.meta.arg.availableChapters[action.meta.arg.chapter.index + 1];
      const nextChapter: LocalChapterSchema | undefined =
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

      const chapterWithData = action.meta.arg.realm
        .objects(ChapterSchema)
        .filtered('link = $0', action.meta.arg.chapter._id)[0];

      for (let i = 0; i < action.payload.data.length; i++) {
        const page = action.payload.data[i];
        newPages.push({
          type: 'PAGE',
          chapter: action.meta.arg.chapter._id,
          chapterId: chapterWithData._id,
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
      const mostFrequentAspectRatio = new Map<number, number>();
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
              const isFirstChapter =
                item.previous.index ===
                action.meta.arg.availableChapters.length - 1;
              chapterIndices.set(item.previous._id, {
                start: !isFirstChapter ? start + 1 : 0,
                end: i - 1,
              });

              start = i;
            }
            break;
          case 'PAGE': {
            const aspectRatio = item.width / item.height;
            const count = mostFrequentAspectRatio.get(aspectRatio);
            if (count == null) mostFrequentAspectRatio.set(aspectRatio, 1);
            else mostFrequentAspectRatio.set(aspectRatio, count + 1);
            break;
          }
        }
      }

      let mostFrequent = 0;
      for (const [key, value] of mostFrequentAspectRatio) {
        const result = Math.max(mostFrequent, value);
        if (result > mostFrequent) {
          mostFrequent = result;
          state.pageAspectRatio = key;
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
