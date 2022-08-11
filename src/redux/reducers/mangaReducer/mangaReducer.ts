import { mapMangaToState, orderedChaptersComparator } from '@redux/reducers/mangaReducer/mangaReducer.helpers';
import {
  MangaReducerAction,
  MangaReducerState,
  ReadingChapterInfo,
  ReadingChapterInfoRecord,
} from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { MangaChapter } from '@services/scraper/scraper.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import SortedList from '@utils/SortedList';

const INITIAL_STATE: MangaReducerState = {};

function updateOrderOfChapters(payload: MangaChapter[], orderedChapters?: SortedList<MangaChapter>) {
  if (orderedChapters) {
    // if (orderedChapters instanceof SortedList === false) {
    //   console.log(`rehydrating... ${Array.isArray(orderedChapters)}`);
    //   orderedChapters = SortedList.rehydrate(orderedChapters as any, orderedChaptersComparator);
    // } else {
    //   console.log(`did not rehydrate`);
    // }

    /**
     * If the user has already seen this manga but the server returns more chapters, this must mean there are new chapters
     */
    if (orderedChapters.size() < payload.length)
      return new SortedList<MangaChapter>(orderedChaptersComparator, payload);
    return orderedChapters;
  }

  return new SortedList<MangaChapter>(orderedChaptersComparator, payload);
}

function updateChapters(payload: MangaChapter[], state?: ReadingChapterInfoRecord): ReadingChapterInfoRecord {
  const obj: ReadingChapterInfoRecord = {};
  if (state)
    for (const chapter of payload) {
      obj[chapter.link] = {
        ...chapter,
        indexPage: state[chapter.link]?.indexPage ?? 0,
        totalPages: state[chapter.link]?.totalPages ?? 0,
        scrollPosition: state[chapter.link]?.scrollPosition ?? 0,
        dateRead: state[chapter.link]?.dateRead ?? null,
        validatedStatus: state[chapter.link]?.validatedStatus ?? DownloadStatus.VALIDATING,
        status: state[chapter.link]?.status ?? DownloadStatus.VALIDATING,
      };
    }
  else
    for (const chapter of payload) {
      obj[chapter.link] = {
        ...chapter,
        indexPage: 0,
        totalPages: 0,
        scrollPosition: 0,
        dateRead: null,
        validatedStatus: DownloadStatus.VALIDATING,
        status: DownloadStatus.VALIDATING,
      };
    }

  return obj;
}

const reducer = (state: MangaReducerState = INITIAL_STATE, action: MangaReducerAction): MangaReducerState => {
  switch (action.type) {
    case 'CHAPTER_UPDATES': {
      return mapMangaToState(state, action.payload, (manga) => {
        return {
          ...action.payload,
          chapters: updateChapters(action.payload.chapters, manga?.chapters),
          inLibrary: manga?.inLibrary ?? false,
          currentlyReadingChapter: manga?.currentlyReadingChapter ?? null,
          dateAddedInLibrary: manga?.dateAddedInLibrary ?? null,
          orderedChapters: manga?.orderedChapters ?? action.payload.chapters,
          newChapters: manga ? action.payload.chapters.length - manga.orderedChapters.size() : 0,
        };
      });
    }
    case 'SIMULATE_NEW_CHAPTERS': {
      const newState = { ...state };
      for (const manga in newState) {
        const latestChapter = newState[manga].orderedChapters.get(newState[manga].orderedChapters.size() - 1);
        delete newState[manga].chapters[latestChapter.link];
        newState[manga].orderedChapters.remove(latestChapter);
      }
      return newState;
    }
    case 'SET_NUMBER_OF_PAGES': {
      state[action.manga.link].chapters[action.chapter.link].totalPages = action.numOfPages;
      return state;
    }
    case 'SET_INDEX_PAGE': {
      state[action.mangaKey].chapters[action.chapterKey].indexPage = action.indexPage;
      state[action.mangaKey].currentlyReadingChapter = action.chapterKey;
      return state;
    }
    case 'OPEN_READER':
      return {
        ...state,
        [action.manga.link]: {
          ...state[action.manga.link],
          chapters: {
            ...state[action.manga.link].chapters,
            [action.chapter.link]: {
              ...state[action.manga.link].chapters[action.chapter.link],
              dateRead: new Date().toString(),
            },
          },
          currentlyReadingChapter: action.chapter.link,
        },
      };
    case 'VALIDATE_FILE_INTEGRITIES': {
      const newState = {
        ...state,
        [action.mangaKey]: {
          ...state[action.mangaKey],
          chapters: { ...state[action.mangaKey].chapters },
        },
      };
      switch (action.stage) {
        case 'prepare':
          for (const key of action.chapterKeys) {
            newState[action.mangaKey].chapters[key].validatedStatus = DownloadStatus.VALIDATING;
            newState[action.mangaKey].chapters[key].status = DownloadStatus.VALIDATING;
          }
          return newState;
        case 'finish':
          for (const key of action.chapterKeys) {
            const downloadManager = DownloadManager.ofWithManga(
              state[action.mangaKey].chapters[key],
              state[action.mangaKey]
            );
            newState[action.mangaKey].chapters[key].validatedStatus = downloadManager.getValidatedStatus();
            newState[action.mangaKey].chapters[key].status = downloadManager.getStatus();
          }
          return newState;
      }
    }
    case 'VALIDATE_WHOLE_MANGA_FILE_INTEGRITY': {
      switch (action.stage) {
        case 'prepare': {
          const newState = {
            ...state,
            [action.mangaKey]: {
              ...state[action.mangaKey],
              chapters: { ...state[action.mangaKey].chapters },
            },
          };
          for (const key in newState[action.mangaKey].chapters) {
            newState[action.mangaKey].chapters[key].validatedStatus = DownloadStatus.VALIDATING;
            newState[action.mangaKey].chapters[key].status = DownloadStatus.VALIDATING;
          }
          return newState;
        }
        case 'finish': {
          const newState = {
            ...state,
            [action.mangaKey]: {
              ...state[action.mangaKey],
              chapters: { ...state[action.mangaKey].chapters },
            },
          };
          for (const key in newState[action.mangaKey].chapters) {
            const downloadManager = DownloadManager.ofWithManga(
              state[action.mangaKey].chapters[key],
              state[action.mangaKey]
            );
            newState[action.mangaKey].chapters[key].validatedStatus = downloadManager.getValidatedStatus();
            newState[action.mangaKey].chapters[key].status = downloadManager.getStatus();
          }
          return newState;
          // return {
          //   ...state,
          //   [action.mangaKey]: {
          //     ...state[action.mangaKey],
          //     chapters: Object.entries(state[action.mangaKey].chapters).reduce((prev, [key, val]) => {
          //       const downloadManager = DownloadManager.ofWithManga(
          //         state[action.mangaKey].chapters[key],
          //         state[action.mangaKey]
          //       );
          //       return {
          //         ...prev,
          //         [key]: {
          //           ...val,
          //           validatedStatus: downloadManager.getValidatedStatus(),
          //           status: downloadManager.getStatus(),
          //         },
          //       };
          //     }, {}),
          //   },
        }
      }
      // }
    }

    case 'VALIDATE_FILE_INTEGRITY': {
      // const newState = { ...state };
      switch (action.stage) {
        case 'prepare':
          return {
            ...state,
            [action.mangaKey]: {
              ...state[action.mangaKey],
              chapters: {
                ...state[action.mangaKey].chapters,
                [action.chapterKey]: {
                  ...state[action.mangaKey].chapters[action.chapterKey],
                  validatedStatus: DownloadStatus.VALIDATING,
                  status: DownloadStatus.VALIDATING,
                },
              },
            },
          };
        // newState[action.mangaKey].chapters[action.chapterKey].validatedStatus = DownloadStatus.VALIDATING;
        // newState[action.mangaKey].chapters[action.chapterKey].status = DownloadStatus.VALIDATING;
        // break;
        case 'finish':
          const downloadManager = DownloadManager.ofWithManga(
            state[action.mangaKey].chapters[action.chapterKey],
            state[action.mangaKey]
          );
          return {
            ...state,
            [action.mangaKey]: {
              ...state[action.mangaKey],
              chapters: {
                ...state[action.mangaKey].chapters,
                [action.chapterKey]: {
                  ...state[action.mangaKey].chapters[action.chapterKey],
                  validatedStatus: downloadManager.getValidatedStatus(),
                  status: downloadManager.getStatus(),
                },
              },
            },
          };
        // newState[action.mangaKey].chapters[action.chapterKey].validatedStatus = downloadManager.getValidatedStatus();
        // newState[action.mangaKey].chapters[action.chapterKey].status = downloadManager.getStatus();
        // break;
      }
      // return newState;
    }
    case 'CANCEL_DOWNLOAD': {
      const newState = { ...state };
      const downloadManager = DownloadManager.ofWithManga(
        newState[action.mangaKey].chapters[action.chapterKey],
        newState[action.mangaKey]
      );
      newState[action.mangaKey].chapters[action.chapterKey].status = downloadManager.getStatus();
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
        chapters: updateChapters(action.payload.chapters, manga?.chapters),
        inLibrary: manga?.inLibrary ?? manga?.inLibrary ?? false,
        currentlyReadingChapter: manga?.currentlyReadingChapter ?? null,
        dateAddedInLibrary: manga?.dateAddedInLibrary ?? null,
        orderedChapters: updateOrderOfChapters(action.payload.chapters, manga?.orderedChapters),
        newChapters: 0,
      }));
    case 'TOGGLE_LIBRARY':
      return mapMangaToState(state, action.payload, (manga) => ({
        ...manga,
        inLibrary: !manga.inLibrary ?? false,
        dateAddedInLibrary: !manga.inLibrary ? new Date().toString() : null,
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
