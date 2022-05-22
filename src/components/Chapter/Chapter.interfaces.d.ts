import { DownloadStatus } from '@components/Chapter/Chapter';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import DownloadManager from '@utils/DownloadManager/DownloadManager';

export interface ChapterProps {
  chapter: ReadingChapterInfo & { mangaName: string; sourceName: string };
}

export interface ChapterRef {
  download: () => void;
  resume: () => void;
  pause: () => void;
  cancel: () => void;
  getStatus: () => DownloadStatus;
}
