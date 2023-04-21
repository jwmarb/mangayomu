import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import {
  fetchPagesByChapter,
  resetReaderState,
  setCurrentChapter,
  setIsOnChapterError,
  setShowTransitionPage,
  setPageInDisplay,
  setIsMounted,
} from '@redux/slices/reader';
import { addMangaToHistory } from '@redux/slices/history';
import { ReadingDirection } from '@redux/slices/settings';

const mapStateToProps = (state: AppState, props: RootStackProps<'Reader'>) => ({
  chapter: state.reader.currentChapter ?? props.route.params.chapter,
  backgroundColor: state.settings.reader.backgroundColor,
  notifyOnLastChapter: state.settings.reader.notifyOnLastChapter,
  manga: props.route.params.manga,
  pages: state.reader.pages,
  horizontal:
    state.settings.reader.readingDirection === ReadingDirection.LEFT_TO_RIGHT ||
    state.settings.reader.readingDirection === ReadingDirection.RIGHT_TO_LEFT,
  reversed:
    state.settings.reader.readingDirection === ReadingDirection.RIGHT_TO_LEFT,
  pagingEnabled:
    state.settings.reader.readingDirection !== ReadingDirection.WEBTOON,
  globalReadingDirection: state.settings.reader.readingDirection,
  globalDeviceOrientation: state.settings.reader.lockOrientation,
  chapterInfo: state.reader.chapterInfo,
  isOnChapterError: state.reader.isOnChapterError,
  showTransitionPage: state.reader.showTransitionPage,
  pageInDisplay: state.reader.pageInDisplay,
  extendedState: state.reader.extendedState,
});

const connector = connect(mapStateToProps, {
  resetReaderState,
  setCurrentChapter,
  setIsOnChapterError,
  setShowTransitionPage,
  setPageInDisplay,
  setIsMounted,
  addMangaToHistory,
});

export type ConnectedReaderProps = ConnectedProps<typeof connector>;

export default connector;
