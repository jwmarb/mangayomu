import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { OverlayProps } from './Overlay.interfaces';
import { addIfNewSourceToLibrary } from '@redux/slices/library';

const mapStateToProps = (state: AppState, props: OverlayProps) => ({
  ...props,
  showPageNumber: state.settings.reader.showPageNumber,
  totalPages: state.reader.currentChapter
    ? state.reader.chapterInfo[state.reader.currentChapter]?.numberOfPages ??
      null
    : null,
});

const connector = connect(mapStateToProps, { addIfNewSourceToLibrary });

export type ConnectedOverlayProps = ConnectedProps<typeof connector>;

export default connector;
