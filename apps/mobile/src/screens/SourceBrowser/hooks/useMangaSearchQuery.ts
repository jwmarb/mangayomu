import { MangaSource } from '@mangayomu/mangascraper';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { GeneratedFilterSchema } from '@mangayomu/schema-creator';
import {
  InfiniteMangaData,
  InfiniteMangaError,
} from '@/screens/SourceBrowser/SourceBrowser';

type UseMangaSearchQueryParameters = {
  source: MangaSource;
  input: string;
  filters: GeneratedFilterSchema;
};

/**
 * A minified version of a completed `useInfiniteQuery` hook; this hook exists to simply improve code readability
 * @param param The parameters passed into this hook
 * @returns Returns the result of the invoked `useInfiniteQuery` hook
 */
export default function useMangaSearchQuery({
  source,
  input,
  filters,
}: UseMangaSearchQueryParameters) {
  return useInfiniteQuery<
    InfiniteMangaData,
    InfiniteMangaError,
    InfiniteData<unknown, unknown>,
    QueryKey,
    number
  >({
    queryKey: ['browse', source.NAME, input, filters],
    queryFn: ({ pageParam, signal }) =>
      source
        .search(
          input,
          pageParam,
          signal,
          filters === source.FILTER_SCHEMA?.schema ? undefined : filters,
        )
        .then(
          (mangas): InfiniteMangaData => ({
            source,
            mangas,
          }),
        )
        .catch((error) => Promise.reject({ error, source })),
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length === 0) return 1;
      if (lastPage.mangas.length === 0) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    select: (data) => {
      return {
        pageParams: data.pageParams,
        pages: data.pages.flatMap((x) => x.mangas),
      };
    },
  });
}
