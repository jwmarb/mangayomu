import * as chaptersListReducerActions from '@redux/reducers/chaptersListReducer';
import { AppState } from '@redux/store';
import { DownloadingChapterProps } from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.interfaces';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: DownloadingChapterProps) => {
  return {
    ...props,
    mangaCursor: state.chaptersList.mangasInDownloading[props.manga.link],
  };
};

const connector = connect(mapStateToProps, chaptersListReducerActions);

export type ConnectedDownloadingChapterProps = ConnectedProps<typeof connector>;

export default connector;
