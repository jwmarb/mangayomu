import { ChapterRef } from '@components/Chapter/Chapter.interfaces';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import SharedMangaViewerRefs from '@screens/MangaViewer/MangaViewer.shared';
import { Manga } from '@services/scraper/scraper.interfaces';
import DownloadManager from '@utils/DownloadManager';
import * as FileSystem from 'expo-file-system';
import pLimit from 'p-limit';

export default class DownloadCollection {
  private static queued: Map<string, DownloadCollection> = new Map();
}
