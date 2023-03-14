import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { fetchPagesByChapter, resetReaderState } from '@redux/slices/reader';
import { ReadingDirection } from '@redux/slices/settings';

const mapStateToProps = (state: AppState, props: RootStackProps<'Reader'>) => ({
  chapter: props.route.params.chapter,
  backgroundColor: state.settings.reader.backgroundColor,
  notifyOnLastChapter: state.settings.reader.notifyOnLastChapter,
  manga: props.route.params.manga,
  pages: state.reader.pages,
  horizontal:
    state.settings.reader.readingDirection === ReadingDirection.LEFT_TO_RIGHT ||
    state.settings.reader.readingDirection === ReadingDirection.RIGHT_TO_LEFT,
});

const connector = connect(mapStateToProps, {
  fetchPagesByChapter,
  resetReaderState,
});

export type ConnectedReaderProps = ConnectedProps<typeof connector>;

export default connector;
