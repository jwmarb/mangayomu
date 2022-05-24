import { DownloadStatus } from '@utils/DownloadManager';
import { ChapterDownloadActionsProps } from '../ChapterDownloadActions/ChapterDownloadActions.interfaces';

export interface ChapterDownloadProgressProps extends ChapterDownloadActionsProps {
  totalProgress: number;
}
