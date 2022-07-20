import { MangaReducerState, ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga, MangaChapter, MangaMeta } from '@services/scraper/scraper.interfaces';
import { Comparator } from '@utils/Algorithms/Comparator/Comparator.interfaces';

type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends object ? RecursivePartial<T[K]> : T[K];
};

export const orderedChaptersComparator: Comparator<MangaChapter, MangaChapter> = (a, b) => a.index - b.index;

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
