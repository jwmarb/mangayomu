import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import {
  fetchPagesByChapter,
  resetReaderState,
  setCurrentChapter,
} from '@redux/slices/reader';
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
});

const connector = connect(mapStateToProps, {
  fetchPagesByChapter,
  resetReaderState,
  setCurrentChapter,
});

export type ConnectedReaderProps = ConnectedProps<typeof connector>;

export default connector;
