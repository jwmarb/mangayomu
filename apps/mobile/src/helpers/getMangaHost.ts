import integrateSortedList from '@helpers/integrateSortedList';
import { MangaHost, Manga } from '@mangayomu/mangascraper';
import { AppState } from '@redux/main';

function indexComparator(a: Manga, b: Manga) {
  return a.index - b.index;
}

interface SourceError {
  error: string;
  source: string;
}

type MangaCollectionState = [SourceError[], Manga[]];

type MangaConcurrencyResult = Promise<{
  errors: SourceError[];
  mangas: Manga[];
}>;

function getErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && err != null) {
    if ('message' in err) return err.message as string;
    if ('msg' in err) return err.msg as string;
    if ('stack' in err) return err.stack as string;
  }
  return 'No error code/message has been provided';
}

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
    sources: hosts,
    hasNoSources() {
      return hosts.length === 0;
    },
    getGenres() {
      const genres = hosts.flatMap((x) =>
        x.getGenres().map((y) => ({ genre: y, source: x.getName() })),
      );
      return genres;
    },
    async getHotMangas(): MangaConcurrencyResult {
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
    async getLatestMangas(): MangaConcurrencyResult {
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
    async getMangaDirectory(): MangaConcurrencyResult {
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
