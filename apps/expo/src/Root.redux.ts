import { connect, ConnectedProps } from 'react-redux';
import * as downloadingMangaActions from '@redux/reducers/mangaDownloadingReducer';

const connector = connect(null, downloadingMangaActions);

export type ConnectedRootProps = ConnectedProps<typeof connector>;

export default connector;
