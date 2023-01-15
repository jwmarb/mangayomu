import * as chaptersListReducerActions from '@redux/reducers/chaptersListReducer';
import { AppState } from '@redux/store';
import { DownloadingChapterProps } from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.interfaces';
import DownloadManager from '@utils/DownloadManager';
import { connect, ConnectedProps } from 'react-redux';
import { cancelDownload } from '@redux/reducers/mangaDownloadingReducer';

const mapStateToProps = (state: AppState, props: DownloadingChapterProps) => {
  const downloadManager = DownloadManager.ofWithManga(
    state.mangas[props.mangaKey].chapters[props.chapterKey],
    state.mangas[props.mangaKey]
  );
  return {
    ...props,
    chapterDownloadingState: state.downloading.metas[props.mangaKey]
      ? state.downloading.metas[props.mangaKey]![props.chapterKey]
      : null,
    chapter: state.mangas[props.mangaKey].chapters[props.chapterKey],
    downloadedPages: downloadManager.getDownloadedPages(),
    totalPages: downloadManager.getTotalPages(),
  };
};

const connector = connect(mapStateToProps, { cancelDownload });

export type ConnectedDownloadingChapterProps = ConnectedProps<typeof connector>;

export default connector;
