import { DownloadStatus } from '@utils/DownloadManager';

export interface ChapterDownloadStatusProps {
  downloadStatus: DownloadStatus;
  isDownloading: boolean;
  startDownload: () => void;
}
