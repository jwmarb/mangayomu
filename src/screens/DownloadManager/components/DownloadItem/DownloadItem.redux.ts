import { AppState } from '@redux/store';
import { DownloadItemProps } from '@screens/DownloadManager/components/DownloadItem/DownloadItem.interfaces';
import * as chaptersListReducerActions from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: DownloadItemProps) => {
  return {
    ...props,
    manga: state.mangas[props.mangaKey],
  };
};

const connector = connect(mapStateToProps, chaptersListReducerActions);

export type ConnectedDownloadItemProps = ConnectedProps<typeof connector>;

export default connector;
