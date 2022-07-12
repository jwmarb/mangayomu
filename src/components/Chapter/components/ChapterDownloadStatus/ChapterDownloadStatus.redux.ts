import { connect, ConnectedProps } from 'react-redux';
import { cancelAllForSeries } from '@redux/reducers/mangaDownloadingReducer';
import { validateFileIntegrity } from '@redux/reducers/mangaReducer';
import { AppState } from '@redux/store';
import { ChapterDownloadStatusProps } from '@components/Chapter/components/ChapterDownloadStatus/ChapterDownloadStatus.interfaces';

const mapStateToProps = (state: AppState, props: ChapterDownloadStatusProps) => props;

const connector = connect(mapStateToProps, { cancelAllForSeries, validateFileIntegrity });

export type ConnectedChapterDownloadStatusProps = ConnectedProps<typeof connector>;

export default connector;
