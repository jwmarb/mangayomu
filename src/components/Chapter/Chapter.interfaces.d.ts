import { DownloadStatus } from '@components/Chapter/Chapter';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import DownloadManager from '@utils/DownloadManager/DownloadManager';

export type ChapterPressableMode = 'selection' | 'normal';

export interface ChapterProps {
  chapter: ReadingChapterInfo & { mangaName: string; sourceName: string };
}

export interface ChapterRef {
  toggleCheck: () => void;
  getDownloadManager: () => DownloadManager;
  downloadAsync: () => Promise<void>;
  download: () => void;
  resume: () => void;
  resumeAsync: () => Promise<void>;
  pause: () => void;
  pauseAsync: () => Promise<void>;
  cancel: () => void;
  cancelAsync: () => Promise<void>;
  queue: () => void;
  getStatus: () => DownloadStatus;
  getURL: () => string;
}
