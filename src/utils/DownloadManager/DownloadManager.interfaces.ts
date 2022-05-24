import { ChapterRef } from '@components/Chapter/Chapter.interfaces';
import { MangaChapter } from '@services/scraper/scraper.interfaces';
import * as FileSystem from 'expo-file-system';
import DownloadManager from './DownloadManager';

export enum DownloadStatus {
  START_DOWNLOADING = 'Start',
  RESUME_DOWNLOADING = 'Resume',
  DOWNLOADING = 'Downloading',
  ERROR = 'Error',
  DOWNLOADED = 'Downloaded',
  PAUSED = 'Paused',
  CANCELLED = 'Cancelled',
  IDLE = 'Idle',
  VALIDATING = 'Validating',
  QUEUED = 'Queued',
}

export type DownloadableObject = {
  ref: ChapterRef | null;
  downloadManager: DownloadManager;
};

export type RecordDownload = Record<string, DownloadableObject | undefined>;

export interface SavedChapterDownloadState {
  state: {
    status: DownloadStatus;
    downloadState: FileSystem.DownloadPauseState;
  }[];
  status: DownloadStatus;
  progress: number[];
  sourceName: string;
  dir: string;
  chapter: MangaChapter;
  pages: string[];
}
