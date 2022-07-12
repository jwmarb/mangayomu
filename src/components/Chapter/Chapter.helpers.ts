import { getKey } from '@redux/reducers/chaptersListReducer/chaptersListReducer';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { AppState, useAppDispatch } from '@redux/store';
import { useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChapterState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import { Manga } from '@services/scraper/scraper.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';

export function useChapterStateFromRedux(chapter: ReadingChapterInfo, manga: Manga) {
  const selected = useSelector((state: AppState) => state.chaptersList.selected);
  return { downloadManager: DownloadManager.ofWithManga(chapter, manga), checked: getKey(chapter) in selected };
}
