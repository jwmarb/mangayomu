import { mapMangaToState } from '@redux/reducers/mangaReducer/mangaReducer.helpers';
import {
  MangaReducerAction,
  MangaReducerState,
  ReadingChapterInfo,
  ReadingChapterInfoRecord,
} from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { MangaChapter } from '@services/scraper/scraper.interfaces';

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
        oldState[payload[i].link] = { ...payload[i], indexPage: 0, scrollPosition: 0, pages: null, dateRead: null };
      }
      return oldState;
    }

    return state;
  }

  return payload.reduce(
    (prev, chapter) => ({
      ...prev,
      [chapter.link]: {
        ...chapter,
        indexPage: 0,
        scrollPosition: 0,
        pages: null,
        dateRead: null,
      },
    }),
    {}
  );
}

const reducer = (state: MangaReducerState = INITIAL_STATE, action: MangaReducerAction): MangaReducerState => {
  switch (action.type) {
    case 'VIEW_MANGA':
      // return {
      //   ...state,
      //   [action.payload.link]: {
      //     ...action.payload,
      //     ...state[action.payload.link],
      //     chapters: updateChapters(action.payload.chapters, state[action.payload.link]?.chapters ?? []),
      //     inLibrary: state[action.payload.link]?.inLibrary ?? state[action.payload.link]?.inLibrary ?? false,
      //     currentlyReadingChapter: state[action.payload.link]?.currentlyReadingChapter ?? null,
      //   },
      // };
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
