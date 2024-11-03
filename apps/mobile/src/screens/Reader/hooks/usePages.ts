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
import { downloadImage, getImageDimensions } from '@/utils/image';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';

export type UsePagesParams = {
  manga: unknown;
};

export default function usePages(params: UsePagesParams) {
  const { manga } = params;
  const source = ExtraReaderInfo.getSource();
  const meta = ExtraReaderInfo.getMangaMeta();
  const tmangameta = ExtraReaderInfo.getTMangaMeta();

  const queryClient = useQueryClient();
  const select = React.useCallback(
    (data: InfiniteData<Query, number>) => {
      if (meta == null) {
        return {
          pageParams: data.pageParams,
          pages: [],
        };
      }

      ExtraReaderInfo.determinePageBoundaries(
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
                ? source.toChapter(previousMetaChapter, tmangameta)
                : undefined,
          });
        }
        for (let j = 0; j < data.pages[i].pages.length; j++) {
          pages.push({
            type: 'PAGE',
            source: data.pages[i].pages[j],
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
                ? source.toChapter(nextMetaChapter, tmangameta)
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
    [meta, source, tmangameta],
  );
  const query = useInfiniteQuery<
    Query,
    Error,
    InfiniteData<Data>,
    QueryKey,
    number
  >({
    enabled: ExtraReaderInfo.shouldFetchChapter(),
    queryKey: [manga],
    gcTime: 0,
    queryFn: async (args) => {
      if (meta == null || tmangameta == null)
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
        tmangameta,
      );
      console.log(args.pageParam, chapter.link);
      ExtraReaderInfo.setPageParam(args.pageParam);
      const pages = await queryClient.fetchQuery({
        queryKey: [meta.chapters[args.pageParam]],
        queryFn: () =>
          source.pages(chapter, args.signal).then((pages) =>
            Promise.all(
              pages.map(
                (uri) =>
                  downloadImage(uri).then(() =>
                    getImageDimensions(uri).then((resolved) => ({
                      uri,
                      width: resolved.width,
                      height: resolved.height,
                    })),
                  ), // invoke this first to start preloading images
              ),
            ),
          ),
      });
      return { pages, chapter } as Query;
    },
    initialPageParam: ExtraReaderInfo.getInitialPageParam(),
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

  ExtraReaderInfo.setDataLength(query.data?.pages.length ?? 0);

  return query;
}
