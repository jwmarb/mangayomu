import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { resetReaderState, setCurrentChapter } from '@redux/slices/reader';

const mapStateToProps = (state: AppState, props: RootStackProps<'Reader'>) => ({
  chapter: state.reader.currentChapter ?? props.route.params.chapter,
  backgroundColor: state.settings.reader.backgroundColor,
  notifyOnLastChapter: state.settings.reader.notifyOnLastChapter,
  manga: props.route.params.manga,
  pages: state.reader.pages,
  globalReadingDirection: state.settings.reader.readingDirection,
  globalDeviceOrientation: state.settings.reader.lockOrientation,
  globalImageScaling: state.settings.reader.imageScaling,
  globalZoomStartPosition: state.settings.reader.zoomStartPosition,
  extendedState: state.reader.extendedState,
  incognito: state.settings.history.incognito,
  internetStatus: state.explore.internetStatus,
});

const connector = connect(mapStateToProps, {
  resetReaderState,
  setCurrentChapter,
});

export type ConnectedReaderProps = ConnectedProps<typeof connector>;

export default connector;
