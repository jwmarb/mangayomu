import { MangaChapter } from '@services/scraper/scraper.interfaces';
import * as FileSystem from 'expo-file-system';

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
}

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
