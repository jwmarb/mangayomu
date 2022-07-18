import { AppState } from '@redux/store';
import { ChapterHeaderProps } from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.interfaces';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: ChapterHeaderProps) => ({
  ...props,
  numOfSelectedChapters: state.chaptersList.numOfSelected,
});

const connector = connect(mapStateToProps);

export type ConnectedChapterHeaderProps = ConnectedProps<typeof connector>;

export default connector;
