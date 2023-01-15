import { DownloadStatus } from '@utils/DownloadManager';

export interface ChapterDownloadStatusProps {
  status: DownloadStatus;
  onDownload: () => void;
  progress: number;
  mangaKey: string;
  chapterKey: string;
}
