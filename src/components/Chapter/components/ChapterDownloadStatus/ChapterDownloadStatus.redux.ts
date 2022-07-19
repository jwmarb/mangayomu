import { connect, ConnectedProps } from 'react-redux';
import { cancelDownload, downloadSelected } from '@redux/reducers/mangaDownloadingReducer';
import { validateFileIntegrity } from '@redux/reducers/mangaReducer';
import { AppState } from '@redux/store';
import { ChapterDownloadStatusProps } from '@components/Chapter/components/ChapterDownloadStatus/ChapterDownloadStatus.interfaces';
import DownloadManager from '@utils/DownloadManager';

const mapStateToProps = (state: AppState, props: ChapterDownloadStatusProps) => ({
  downloadManager: DownloadManager.ofWithManga(
    state.mangas[props.mangaKey].chapters[props.chapterKey],
    state.mangas[props.mangaKey]
  ),
  manga: state.mangas[props.mangaKey],
  ...props,
});

const connector = connect(mapStateToProps, { cancelDownload, validateFileIntegrity });

export type ConnectedChapterDownloadStatusProps = ConnectedProps<typeof connector>;

export default connector;
