import { MangaChapter } from '@mangayomu/mangascraper';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import React from 'react';
import useMangaSource from '@/hooks/useMangaSource';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import { Data, Query } from '@/screens/Reader/Reader';
import determinePageBoundaries from '@/screens/Reader/helpers/determinePageBoundaries';

export type UsePagesParams = {
  manga: unknown;
  source?: string;
  chapter: unknown;
  currentChapter: MangaChapter | null;
  tmangameta: unknown;
  meta?: NonNullable<ReturnType<typeof useMangaMeta>['data']>[1];
};

export default function usePages(params: UsePagesParams) {
  const {
    manga,
    source: sourceStr,
    chapter,
    currentChapter,
    tmangameta: unparsedMeta,
    meta,
  } = params;
  const source = useMangaSource({ manga, source: sourceStr });

  const isQueryEnabled = unparsedMeta != null && currentChapter != null;

  const initialPageParam = React.useMemo(
    () =>
      meta?.chapters.findIndex(
        (item) =>
          source.toChapter(item, unparsedMeta).link ===
          source.toChapter(chapter, unparsedMeta).link,
      ) ?? -1,
    [unparsedMeta, chapter, source, meta?.chapters],
  );
  const indices = React.useRef<Record<string, [number, number]>>({});
  const queryClient = useQueryClient();
  const select = React.useCallback(
    (data: InfiniteData<Query, number>) => {
      if (meta == null) {
        return {
          pageParams: data.pageParams,
          pages: [],
        };
      }

      indices.current = determinePageBoundaries(
        data.pages,
        data.pageParams[0] > 0,
      );

      const pages: Data[] = [];
      for (let i = 0; i < data.pages.length; i++) {
        if (data.pageParams[i] > 0) {
          const previousMetaChapter = meta.chapters[data.pageParams[i] - 1];
          pages.push({
            type: 'CHAPTER_DIVIDER',
            next: data.pages[i]?.chapter,
            previous:
              previousMetaChapter != null
                ? source.toChapter(previousMetaChapter, unparsedMeta)
                : undefined,
          });
        }
        for (let j = 0; j < data.pages[i].pages.length; j++) {
          pages.push({
            type: 'PAGE',
            source: { uri: data.pages[i].pages[j] },
            chapter: data.pages[i].chapter,
            page: j + 1,
          });
        }
        if (data.pageParams[i] >= meta?.chapters.length - 1) {
          pages.push({ type: 'NO_MORE_CHAPTERS' });
        } else if (i === data.pages.length - 1) {
          const nextMetaChapter = meta.chapters[data.pageParams[i] + 1];
          pages.push({
            type: 'CHAPTER_DIVIDER',
            next:
              nextMetaChapter != null
                ? source.toChapter(nextMetaChapter, unparsedMeta)
                : undefined,
            previous: data.pages[i]?.chapter,
          });
        }
      }

      return {
        pageParams: data.pageParams,
        pages,
      };
    },
    [meta, source, unparsedMeta],
  );
  const query = useInfiniteQuery<
    Query,
    Error,
    InfiniteData<Data>,
    QueryKey,
    number
  >({
    enabled: isQueryEnabled,
    queryKey: [manga, initialPageParam],
    gcTime: 0,
    queryFn: async (args) => {
      if (meta == null || unparsedMeta == null)
        return {
          pages: [],
          chapter: {
            date: Date.now(),
            link: '',
            name: '',
            subname: '',
            index: 0,
          },
        };
      const chapter = source.toChapter(
        meta.chapters[args.pageParam],
        unparsedMeta,
      );
      const pages = await queryClient.fetchQuery({
        queryKey: [meta.chapters[args.pageParam]],
        queryFn: () => source.pages(chapter, args.signal),
      });
      return { pages, chapter } as Query;
    },
    initialPageParam,
    getNextPageParam: (_, __, lastPage) => {
      if (meta == null || meta.chapters.length <= lastPage) {
        return undefined;
      }
      return lastPage + 1;
    },
    getPreviousPageParam: (_, __, firstPage) => {
      if (meta == null || firstPage < 1) {
        return undefined;
      }
      return firstPage - 1;
    },
    select,
  });

  const dataLength = React.useRef<number>(0);
  React.useEffect(() => {
    dataLength.current = query.data?.pages.length ?? 0;
  }, [query.data?.pages]);

  return { query, dataLength, initialPageParam, indices };
}
