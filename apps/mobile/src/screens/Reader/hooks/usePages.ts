import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import React from 'react';
import { Data, Query } from '@/screens/Reader/Reader';
import { downloadImage, getImageDimensions } from '@/utils/image';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import MangaMetaHandler from '@/screens/Reader/helpers/MangaMetaHandler';

export type UsePagesParams = {
  manga: unknown;
};

/**
 *  Manages and retrieves manga pages using the provided parameters.
 *  This hook initializes a query to fetch manga pages from a specified source,
 *  processes the fetched data to include chapter dividers and page information,
 *  and handles pagination.
 *
 *  @pre    The manga object is provided and contains valid metadata.
 *          The source object is available for fetching manga data.
 *          The meta and tmangameta objects are initialized with manga metadata.
 *  @post   The hook returns a query object containing the fetched and processed manga pages.
 *          The query object includes methods for pagination and data management.
 *
 *  @param params - An object containing the manga for which pages are to be fetched.
 *
 *
 *  @returns A query object from useInfiniteQuery, which includes:
 *           - data: An object containing the fetched pages and page parameters.
 *           - fetchNextPage: A function to fetch the next set of pages.
 *           - fetchPreviousPage: A function to fetch the previous set of pages.
 *           - hasNextPage: A boolean indicating if there are more pages to fetch.
 *           - hasPreviousPage: A boolean indicating if there are previous pages to fetch.
 *           - isFetching: A boolean indicating if data is currently being fetched.
 *           - isError: A boolean indicating if an error occurred during fetching.
 *           - error: The error object if an error occurred.
 */
export default function usePages(params: UsePagesParams) {
  const { manga } = params;
  const source = ExtraReaderInfo.getSource(); // Retrieve the source object for fetching manga data.
  const meta = MangaMetaHandler.getMangaMeta(); // Get metadata for the manga.
  const tmangameta = MangaMetaHandler.getTMangaMeta(); // Get additional metadata for the manga.

  const queryClient = useQueryClient(); // Initialize the query client for managing data fetching.
  const select = React.useCallback(
    (data: InfiniteData<Query, number>) => {
      if (meta == null) {
        return {
          pageParams: data.pageParams,
          pages: [],
        };
      }

      // Determine the boundaries of the pages based on the data and page parameters.
      ExtraReaderInfo.determinePageBoundaries(
        data.pages,
        data.pageParams[0] > 0,
      );

      const pages: Data[] = [];
      for (let i = 0; i < data.pages.length; i++) {
        // If the current page parameter is greater than 0, add a chapter divider.
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
        // Add each page of the chapter to the pages array.
        for (let j = 0; j < data.pages[i].pages.length; j++) {
          pages.push({
            type: 'PAGE',
            source: data.pages[i].pages[j],
            chapter: data.pages[i].chapter,
            page: j + 1,
          });
        }
        // If this is the last chapter, add a NO_MORE_CHAPTERS marker.
        if (data.pageParams[i] >= meta?.chapters.length - 1) {
          pages.push({ type: 'NO_MORE_CHAPTERS' });
        } else if (i === data.pages.length - 1) {
          // Otherwise, add a chapter divider for the next chapter.
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
    enabled: ExtraReaderInfo.shouldFetchChapter(), // Determine if the chapter should be fetched.
    queryKey: [manga], // Unique key for the query.
    gcTime: 0, // Disable garbage collection for the query.
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
      ); // Convert the chapter metadata to a chapter object.
      ExtraReaderInfo.setPageParam(args.pageParam); // Set the current page parameter.
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
                  ), // Start preloading images.
              ),
            ),
          ),
      });
      return { pages, chapter } as Query;
    },
    initialPageParam: ExtraReaderInfo.getInitialPageParam(), // Get the initial page parameter.
    getNextPageParam: (_, __, lastPage) => {
      if (meta == null || meta.chapters.length <= lastPage) {
        return undefined;
      }
      return lastPage + 1; // Return the next page parameter.
    },
    getPreviousPageParam: (_, __, firstPage) => {
      if (meta == null || firstPage < 1) {
        return undefined;
      }
      return firstPage - 1; // Return the previous page parameter.
    },
    select,
  });

  ExtraReaderInfo.setDataLength(query.data?.pages.length ?? 0); // Set the length of the data.

  return query;
}
