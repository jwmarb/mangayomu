import integrateSortedList from '@helpers/integrateSortedList';
import { MangaHost, Manga } from '@mangayomu/mangascraper';
import { AppState } from '@redux/main';
import { getErrorMessage } from './getErrorMessage';

function indexComparator(a: { index: number }, b: { index: number }) {
  return a.index - b.index;
}

export interface SourceError {
  error: string;
  source: string;
}

type MangaCollectionState = [SourceError[], Manga[]];

export type MangaConcurrencyResult = {
  errors: SourceError[];
  mangas: Manga[];
};

/**
 * Get the MangaHost from redux or not. Comes with safety from edge cases.
 * @param state The App state from redux
 * @param overrideSource Name of a different source. Use this parameter if the code does not need to use the user-defined selected source.
 * @returns
 */
export default function getMangaHost(state: AppState) {
  const p = MangaHost.getAvailableSources();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const hosts = state.host.name.map((host) => p.get(host)!);
  return {
    getSourcesLength() {
      return hosts.length;
    },
    hasNoSources() {
      return hosts.length === 0;
    },
    getGenres() {
      const genres = hosts
        .flatMap((x) =>
          x
            .getGenres()
            .map((y, i) => ({ genre: y, source: x.getName(), index: i })),
        )
        .sort((a, b) => a.genre.localeCompare(b.genre));
      return genres;
    },
    async getHotMangas(): Promise<MangaConcurrencyResult> {
      const mangaCollection = await Promise.allSettled(
        hosts.map((x) => x.listHotMangas()),
      );
      const [errors, mangas] = mangaCollection.reduce(
        (prev, curr, index) => {
          if (curr.status === 'rejected')
            prev[0].push({
              source: hosts[index].getName(),
              error: getErrorMessage(curr.reason),
            });
          else integrateSortedList(prev[1], indexComparator).add(curr.value);
          return prev;
        },
        [[], []] as MangaCollectionState,
      );
      return {
        errors,
        mangas,
      };
    },
    async getLatestMangas(): Promise<MangaConcurrencyResult> {
      const mangaCollection = await Promise.allSettled(
        hosts.map((x) => x.listRecentlyUpdatedManga()),
      );
      const [errors, mangas] = mangaCollection.reduce(
        (prev, curr, index) => {
          if (curr.status === 'rejected')
            prev[0].push({
              source: hosts[index].getName(),
              error: getErrorMessage(curr.reason),
            });
          else integrateSortedList(prev[1], indexComparator).add(curr.value);
          return prev;
        },
        [[], []] as MangaCollectionState,
      );
      return {
        errors,
        mangas,
      };
    },
    async getMangaDirectory(): Promise<MangaConcurrencyResult> {
      const mangaCollection = await Promise.allSettled(
        hosts.map((x) => x.listMangas()),
      );
      const [errors, mangas] = mangaCollection.reduce(
        (prev, curr, index) => {
          if (curr.status === 'rejected')
            prev[0].push({
              source: hosts[index].getName(),
              error: getErrorMessage(curr.reason),
            });
          else integrateSortedList(prev[1], indexComparator).add(curr.value);
          return prev;
        },
        [[], []] as MangaCollectionState,
      );
      return {
        errors,
        mangas,
      };
    },
  };
}
