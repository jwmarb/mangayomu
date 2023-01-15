import { AppState } from '@redux/store';
import { ChapterHeaderProps } from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.interfaces';
import { connect, ConnectedProps } from 'react-redux';
import { hideFloatingModal } from '@redux/reducers/chaptersListReducer';

const mapStateToProps = (state: AppState, props: ChapterHeaderProps) => ({
  ...props,
  numOfSelectedChapters: state.chaptersList.numOfSelected,
  selectionMode: state.chaptersList.mode,
});

const connector = connect(mapStateToProps, { hideFloatingModal });

export type ConnectedChapterHeaderProps = ConnectedProps<typeof connector>;

export default connector;
