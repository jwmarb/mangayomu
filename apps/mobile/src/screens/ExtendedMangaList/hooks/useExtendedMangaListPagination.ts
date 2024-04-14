import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import React from 'react';
import { MangaSource } from '@mangayomu/mangascraper';
import { FetchedMangaResults, MangaResult } from '@/stores/explore';

const ITEMS_PER_PAGE = 30;

export type UseExtendedMangaListPaginationOptions = {
  type: keyof FetchedMangaResults;
  input: string;
  results?: FetchedMangaResults;
};

export default function useExtendedMangaListPagination({
  type,
  results,
  input,
}: UseExtendedMangaListPaginationOptions) {
  const deferredInput = React.useDeferredValue(input);
  const zeroResults = React.useRef(new Set());
  const searchMapping = React.useRef(new Map<string, MangaResult[]>());
  const queryClient = useQueryClient();
  const mangas = results?.[type].mangas ?? [];
  const queryKey = ['ExtendedMangaList', type, deferredInput];
  const query = useInfiniteQuery<
    MangaResult[],
    Error,
    InfiniteData<MangaResult>,
    QueryKey,
    number
  >({
    staleTime: 0,
    queryKey,
    queryFn: ({ pageParam }): MangaResult[] => {
      let filtered = searchMapping.current.get(deferredInput);
      if (filtered == null) {
        filtered = mangas.filter((manga) => {
          const source = MangaSource.getSource(manga.__source__);
          if (source == null)
            throw new Error(`Source ${manga.__source__} does not exist`);
          return source
            .toManga(manga)
            .title.toLowerCase()
            .trim()
            .includes(deferredInput);
        });

        if (filtered.length === 0) {
          for (
            let a = deferredInput;
            a.length > 0;
            a = a.substring(0, a.length - 1)
          ) {
            if (zeroResults.current.has(a)) {
              return [];
            }
          }
          zeroResults.current.add(deferredInput);
          return [];
        } else {
          searchMapping.current.set(deferredInput, filtered);
        }
      }
      return filtered.slice(
        Math.min((pageParam - 1) * ITEMS_PER_PAGE, mangas.length),
        Math.min(pageParam * ITEMS_PER_PAGE, mangas.length),
      );
    },
    initialPageParam: 1,
    getNextPageParam(previous, allPages) {
      if (allPages.length === 0) return 1;
      if (previous.length === 0) return undefined;
      return allPages.length + 1;
    },
    select: (data) => {
      return {
        pageParams: data.pageParams,
        pages: data.pages.flat(),
      };
    },
  });

  const { data, isFetchedAfterMount, hasNextPage, fetchNextPage } = query;

  const pages = query.data ?? { pageParams: [1], pages: [] };

  React.useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey });
    };
  }, []);

  const handleOnEndReached = React.useCallback(() => {
    if (data != null && hasNextPage && isFetchedAfterMount) {
      fetchNextPage();
    }
  }, [data != null, hasNextPage, isFetchedAfterMount]);

  return {
    onEndReached: handleOnEndReached,
    pages,
  };
}
