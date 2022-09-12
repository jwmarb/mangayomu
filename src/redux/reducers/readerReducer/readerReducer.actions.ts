import { orderedChaptersComparator } from '@redux/reducers/mangaReducer/mangaReducer.helpers';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { getImageDimensions } from '@redux/reducers/readerReducer/readerReducer.helpers';
import { MangaPage, Page, SavePageInfo } from '@redux/reducers/readerReducer/readerReducer.interfaces';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { AppState, AppDispatch } from '@redux/store';
import { Manga, MangaChapter, MangaMultilingualChapter } from '@services/scraper/scraper.interfaces';
import { ISOLangCode } from '@utils/languageCodes';
import MangaValidator from '@utils/MangaValidator';
import SortedList from '@utils/SortedList';
import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type StateGetter = () => AppState;
let chapterLang: ISOLangCode | null = null;
let orderedChapters: SortedList<MangaChapter> | null;

export const exitReader = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'EXIT_READER' });
    chapterLang = null;
    orderedChapters = null;
  };
};

export const openReader = (manga: Manga, chapter: ReadingChapterInfo) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'OPEN_READER', manga, chapter });
    if (MangaValidator.isMultilingualChapter(chapter)) chapterLang = chapter.language;
    else chapterLang = null;
  };
};

export const transformPages = (
  pages: string[],
  chapter: ReadingChapterInfo,
  manga: Manga,
  appendLocation: 'start' | 'end' | null = null
) => {
  return (dispatch: AppDispatch, getState: StateGetter) => {
    let canceled: boolean = false;
    return {
      cancel: () => {
        canceled = true;
      },
      start: async () => {
        dispatch({ type: 'SET_NUMBER_OF_PAGES', manga, chapter, numOfPages: pages.length });
        if (MangaValidator.isMultilingualChapter(chapter)) {
          if (orderedChapters == null) {
            const newArray: MangaChapter[] = [];
            for (let i = 0; i < getState().mangas[manga.link].orderedChapters.size(); i++) {
              const itemChapter = getState().mangas[manga.link].orderedChapters.get(i) as MangaMultilingualChapter;
              if (itemChapter.language === chapter.language) newArray.push(itemChapter);
            }
            orderedChapters = new SortedList<MangaChapter>((b, a) => {
              if (a.name && b.name) {
                const aName = a.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
                const bName = b.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
                if (aName != null && bName != null) return parseFloat(bName[0]) - parseFloat(aName[0]);
              }
              if (a.index != null && b.index != null) return b.index - a.index;
              throw Error(`Chapter cannot be sorted due to undefined name and index`);
            }, newArray);
          }
        } else orderedChapters = getState().mangas[manga.link].orderedChapters;

        const index = orderedChapters.indexOf(chapter);
        const previousChapter = orderedChapters.get(index - 1);
        const nextChapter = orderedChapters.get(index + 1);
        const hasPreviousChapter = previousChapter != null;
        const hasNextChapter = nextChapter != null;
        if (appendLocation === 'start') dispatch({ type: 'RESET_SCROLL_POSITION_INDEX' });
        const p: MangaPage[] = await Promise.all(pages.map(getImageDimensions(chapter)));
        if (!canceled) {
          if (p[0].type === 'PAGE') {
            p[0].isFirstPage = true;
            if (index === 0) p[0].isOfFirstChapter = true;
          }
          if (p[p.length - 1].type === 'PAGE') (p[p.length - 1] as Page).isLastPage = true;
          if (hasPreviousChapter) p.unshift({ type: 'PREVIOUS_CHAPTER', key: previousChapter.link });
          if (hasNextChapter) p.push({ type: 'NEXT_CHAPTER', key: nextChapter.link });
          else p.push({ type: 'NO_MORE_CHAPTERS' });
          dispatch({
            type: 'APPEND_PAGES',
            pages: p,
            chapter,
            manga,
            appendLocation,
            numOfPages: pages.length,
            initialIndexPage: index === 0 ? chapter.indexPage : chapter.indexPage + 1,
          });
          if (getState().reader.isMounted) dispatch({ type: 'OPEN_READER', manga, chapter });
        }
      },
    };
  };
};

export const setShouldActivateOnStart = (shouldActivateOnStart: boolean) => {
  return (dispatch: AppDispatch, getState: StateGetter) => {
    if (getState().reader.shouldActivateOnStart !== shouldActivateOnStart)
      dispatch({ type: 'SHOULD_ACTIVATE_ON_START', shouldActivateOnStart });
  };
};

export const setReaderError = (error: any) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'READER_ERROR', error });
  };
};

export const setReaderLoading = (loading: boolean, extendedStateKey?: string) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'READER_LOADING', loading, extendedStateKey });
  };
};

export const setCurrentlyReadingChapter = (chapter: ReadingChapterInfo) => {
  return (dispatch: AppDispatch, getState: StateGetter) => {
    if (getState().reader.forcedShouldTrackIndex) dispatch({ type: 'SET_CURRENTLY_READING_CHAPTER', chapter });
  };
};

export const transitioningPageShouldFetch = (key: string) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TRANSITIONING_PAGE_SHOULD_FETCH_CHAPTER', extendedStateKey: key });
  };
};

export const toggleOverlay = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'TOGGLE_OVERLAY' });
  };
};

export const showOverlay = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SHOW_OVERLAY' });
  };
};

export const setReaderIndex = (index?: number) => {
  return (dispatch: AppDispatch, getState: StateGetter) => {
    if (getState().reader.chapterInView)
      dispatch({
        type: 'SET_READER_INDEX',
        index:
          index ??
          getState().reader.index - getState().reader.chapterPositionOffset[getState().reader.chapterInView!.link],
      });
  };
};

export const openReaderModal = (page: SavePageInfo) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_READER_MODAL_VISIBILITY', show: true, page });
  };
};

export const closeReaderModal = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_READER_MODAL_VISIBILITY', show: false });
  };
};

export const shouldTrackIndex = (payload: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SHOULD_TRACK_INDEX', payload });
  };
};
