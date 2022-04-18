import { MangaReducerState, ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga, MangaMeta } from '@services/scraper/scraper.interfaces';

type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends object ? RecursivePartial<T[K]> : T[K];
};

/**
 *
 * @param state The state
 * @param mangaKey The key to access the object in state
 * @param mapToState Map to state
 * @returns
 */
export function mapMangaToState(
  state: MangaReducerState,
  payload: Manga | (MangaMeta & Manga),
  mapToState: (manga: ReadingMangaInfo) => ReadingMangaInfo = () => ({ ...state[payload.link] })
): MangaReducerState {
  const mangaKey = payload.link;
  return {
    ...state,
    [mangaKey]: {
      ...mapToState(state[mangaKey]),
    },
  };
}
