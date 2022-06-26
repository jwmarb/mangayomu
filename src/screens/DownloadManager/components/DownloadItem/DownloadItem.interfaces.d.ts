import { DownloadingManga } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';

export interface DownloadItemProps {
  mangaKey: string;
  downloadingManga: DownloadingManga;
}
