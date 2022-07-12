import { mapMangaToState } from '@redux/reducers/mangaReducer/mangaReducer.helpers';
import {
  MangaReducerAction,
  MangaReducerState,
  ReadingChapterInfo,
  ReadingChapterInfoRecord,
} from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { MangaChapter } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';

const INITIAL_STATE: MangaReducerState = {};

function updateChapters(payload: MangaChapter[], state: ReadingChapterInfoRecord): ReadingChapterInfoRecord {
  if (state) {
    const keys = Object.keys(state);
    /**
     * If the user has already seen this manga but the server returns more chapters, this must mean there are new chapters
     */
    if (keys.length < payload.length) {
      const oldState = { ...state };
      for (let i = keys.length; i < payload.length; i++) {
        oldState[payload[i].link] = {
          ...payload[i],
          indexPage: 0,
          scrollPosition: 0,
          pages: null,
          dateRead: null,
          validatedStatus: DownloadStatus.VALIDATING,
          status: DownloadStatus.VALIDATING,
        };
      }
      return oldState;
    }

    return state;
  }

  return payload.reduce(
    (prev, chapter): ReadingChapterInfoRecord => ({
      ...prev,
      [chapter.link]: {
        ...chapter,
        indexPage: 0,
        scrollPosition: 0,
        pages: null,
        dateRead: null,
        validatedStatus: DownloadStatus.VALIDATING,
        status: DownloadStatus.VALIDATING,
      },
    }),
    {}
  );
}

const reducer = (state: MangaReducerState = INITIAL_STATE, action: MangaReducerAction): MangaReducerState => {
  switch (action.type) {
    case 'VALIDATE_FILE_INTEGRITY': {
      const newState = { ...state };
      switch (action.stage) {
        case 'prepare':
          newState[action.mangaKey].chapters[action.chapterKey].validatedStatus = DownloadStatus.VALIDATING;
          newState[action.mangaKey].chapters[action.chapterKey].status = DownloadStatus.VALIDATING;
          break;
        case 'finish':
          const downloadManager = DownloadManager.ofWithManga(
            newState[action.mangaKey].chapters[action.chapterKey],
            newState[action.mangaKey]
          );
          newState[action.mangaKey].chapters[action.chapterKey].validatedStatus = downloadManager.getValidatedStatus();
          newState[action.mangaKey].chapters[action.chapterKey].status = downloadManager.getStatus();
          break;
      }
      return newState;
    }
    case 'CANCEL_ALL_FOR_SERIES': {
      const newState = { ...state };
      for (const chapterKey of action.chapters) {
        const downloadManager = DownloadManager.ofWithManga(
          newState[action.mangaKey].chapters[chapterKey],
          newState[action.mangaKey]
        );
        newState[action.mangaKey].chapters[chapterKey].status = downloadManager.getStatus();
      }
      return newState;
    }
    case 'CHAPTER_DOWNLOAD_LISTENER': {
      const newState = { ...state };
      newState[action.mangaKey].chapters[action.chapterKey].status = DownloadStatus.DOWNLOADING;
      return newState;
    }
    case 'CHAPTER_DOWNLOAD_COMPLETE': {
      const newState = { ...state };
      const downloadManager = DownloadManager.ofWithManga(
        newState[action.mangaKey].chapters[action.chapterKey],
        newState[action.mangaKey]
      );
      newState[action.mangaKey].chapters[action.chapterKey].validatedStatus = DownloadStatus.DOWNLOADED;
      newState[action.mangaKey].chapters[action.chapterKey].status = DownloadStatus.DOWNLOADED;
      downloadManager.setStatus(DownloadStatus.DOWNLOADED);
      return newState;
    }
    case 'APPEND_TO_DOWNLOAD_REDUCER': {
      const newState = { ...state };
      for (const key in action.selected) {
        const downloadManager = DownloadManager.ofWithManga(newState[action.manga.link].chapters[key], action.manga);
        downloadManager.queue();
        newState[action.manga.link].chapters[key].status = downloadManager.getStatus();
        // console.log(
        //   `${newState[action.manga.link].chapters[key].name}: ${newState[action.manga.link].chapters[key].status}`
        // );
      }
      return newState;
    }
    case 'VALIDATE_CHAPTERS':
      return mapMangaToState(state, action.payload, (manga) => {
        for (const key in manga.chapters) {
          const downloadManager = DownloadManager.ofWithManga(manga.chapters[key], manga);
          const validatedStatus = downloadManager.getValidatedStatus();
          manga.chapters[key].validatedStatus = validatedStatus;
          if (DownloadManager.ofWithManga(manga.chapters[key], manga).getStatus() === DownloadStatus.VALIDATING)
            downloadManager.setStatus(validatedStatus);
          manga.chapters[key].status = DownloadManager.ofWithManga(manga.chapters[key], manga).getStatus();
        }
        return manga;
      });
    case 'VIEW_MANGA':
      return mapMangaToState(state, action.payload, (manga) => ({
        ...action.payload,
        chapters: updateChapters(action.payload.chapters, manga?.chapters ?? []),
        inLibrary: manga?.inLibrary ?? manga?.inLibrary ?? false,
        currentlyReadingChapter: manga?.currentlyReadingChapter ?? null,
      }));
    case 'TOGGLE_LIBRARY':
      return mapMangaToState(state, action.payload, (manga) => ({
        ...manga,
        inLibrary: !manga.inLibrary ?? false,
      }));
    // return {
    //   ...state,
    //   [action.payload.link]: {
    //     ...state[action.payload.link],
    //     inLibrary: !state[action.payload.link]?.inLibrary ?? false,
    //   },
    // };
    default:
      return state;
  }
};

export default reducer;
