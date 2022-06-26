import { AppState } from '@redux/store';
import { DownloadItemProps } from '@screens/DownloadManager/components/DownloadItem/DownloadItem.interfaces';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: DownloadItemProps) => {
  return {
    ...props,
    manga: state.mangas[props.mangaKey],
    downloadingChapter: props.downloadingManga.cursorPosition != null ? state.chaptersList.chapters[props.downloadingManga.cursorPosition] : null
  };
};

const connector = connect(mapStateToProps);

export type ConnectedDownloadItemProps = ConnectedProps<typeof connector>;

export default connector;
