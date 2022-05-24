import { DownloadStatus } from '@components/Chapter/Chapter';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadManager from '@utils/DownloadManager/DownloadManager';

export type ChapterPressableMode = 'selection' | 'normal';

export interface ChapterProps {
  manga: Manga;
  chapter: ReadingChapterInfo;
}

export interface ChapterRef {
  setChecked: (t: boolean) => void;
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
