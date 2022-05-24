import { DownloadStatus } from '@utils/DownloadManager';

export interface ChapterDownloadActionsProps {
  downloadStatus: DownloadStatus;
  isDownloading: boolean;
  pauseDownload: () => void;
  cancelDownload: () => void;
  resumeDownload: () => void;
}
