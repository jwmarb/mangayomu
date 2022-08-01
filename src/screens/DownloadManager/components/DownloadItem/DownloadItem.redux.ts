import { AppState } from '@redux/store';
import { DownloadItemProps } from '@screens/DownloadManager/components/DownloadItem/DownloadItem.interfaces';
import { cancelAllForSeries } from '@redux/reducers/mangaDownloadingReducer';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: DownloadItemProps) => {
  return {
    ...props,
    manga: state.mangas[props.mangaKey],
    chapter:
      state.downloading.downloadingKeys[props.mangaKey] != null
        ? state.mangas[props.mangaKey].chapters[state.downloading.downloadingKeys[props.mangaKey]!]
        : null,
  };
};

const connector = connect(mapStateToProps, { cancelAllForSeries });

export type ConnectedDownloadItemProps = ConnectedProps<typeof connector>;

export default connector;
