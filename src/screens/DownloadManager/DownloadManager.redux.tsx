import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: StackScreenProps<RootStackParamList, 'DownloadManager'>) => {
  return {
    ...props,
    cursors: state.chaptersList.mangasInDownloading,
    extraState: state.mangas,
  };
};

const connector = connect(mapStateToProps);

export type DownloadManagerProps = ConnectedProps<typeof connector>;

export default connector;
