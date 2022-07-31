import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';

export interface ReaderProfile {}

export type Page = {
  type: 'PAGE';
  link: string;
  width: number;
  height: number;
  isFirstPage?: boolean;
  chapter: ReadingChapterInfo;
  isLastPage?: boolean;
  isOfFirstChapter?: boolean;
};

export type TransitionPage = { type: 'CHAPTER_TRANSITION'; previous: string; next: string; extendedStateKey: string };
export type NoMoreChaptersPage = { type: 'NO_MORE_CHAPTERS' };
export type MangaPage =
  | Page
  | NoMoreChaptersPage
  | { type: 'PREVIOUS_CHAPTER'; key: string }
  | { type: 'NEXT_CHAPTER'; key: string }
  | TransitionPage;

export type ReaderReducerState = {
  index: number;
  maintainScrollPositionOffset?: Record<ReaderDirection, number>;
  maintainScrollPositionIndex: number;
  showOverlay: boolean;
  showModal: boolean;
  modalPageURI: string | null;
  data: MangaPage[];
  chapterInView: ReadingChapterInfo | null;
  numberOfPages: Record<string, number>;
  shouldActivateOnStart: boolean;
  error: string;
  loadingContent: boolean;
  extendedState: Record<string, ChapterTransitionState>;
  chapterPositionOffset: Record<string, number>;
  shouldTrackIndex: boolean;
  forcedShouldTrackIndex: boolean;
  isMounted: boolean;
};

export type ChapterTransitionState = {
  loading: boolean;
  hasAlreadyFetched: boolean;
  shouldFetch: boolean;
};

export type ReaderReducerAction =
  | {
      type: 'APPEND_PAGES';
      pages: MangaPage[];
      numOfPages: number;
      chapter: MangaChapter;
      manga: Manga;
      appendLocation: 'start' | 'end' | null;
      initialIndexPage: number;
    }
  | { type: 'EXIT_READER' }
  | { type: 'OPEN_READER'; manga: Manga; chapter: ReadingChapterInfo }
  | { type: 'SHOULD_ACTIVATE_ON_START'; shouldActivateOnStart: boolean }
  | { type: 'READER_ERROR'; error: any }
  | { type: 'READER_LOADING'; loading: boolean; extendedStateKey?: string }
  | { type: 'SET_CURRENTLY_READING_CHAPTER'; chapter: ReadingChapterInfo }
  | { type: 'SET_SCROLL_POSITION_INDEX'; index: number }
  | { type: 'RESET_SCROLL_POSITION_INDEX' }
  | { type: 'TRANSITIONING_PAGE_SHOULD_FETCH_CHAPTER'; extendedStateKey: string }
  | { type: 'TOGGLE_OVERLAY' }
  | { type: 'SHOW_OVERLAY' }
  | { type: 'SET_READER_INDEX'; index: number }
  | { type: 'SET_READER_MODAL_VISIBILITY'; show: false }
  | { type: 'SET_READER_MODAL_VISIBILITY'; show: true; uri: string }
  | { type: 'SHOULD_TRACK_INDEX'; payload: boolean }
  | { type: 'SET_DEVICE_ORIENTATION_FOR_SERIES'; mangaKey: string; orientation: ReaderScreenOrientation };
