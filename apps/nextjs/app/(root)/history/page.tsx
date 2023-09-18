'use client';
import Book from '@app/components/Book';
import Button from '@app/components/Button';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import { useMangaProxy } from '@app/context/proxy';
import { useUser } from '@app/context/realm';
import cache from '@app/helpers/cache';
import collectMangaMetas from '@app/helpers/collectMangaMetas';
import getMangaHost from '@app/helpers/getMangaHost';
import getMangaHostFromLink from '@app/helpers/getMangaHostFromLink';
import getSlug from '@app/helpers/getSlug';
import getSourceManga from '@app/helpers/getSourceManga';
import isMultilingualChapter from '@app/helpers/isMultilingualChapter';
import useBoolean from '@app/hooks/useBoolean';
import useMongoClient from '@app/hooks/useMongoClient';
import useQuery from '@app/hooks/useQuery';
import HistorySchema from '@app/realm/History';
import SourceChapterSchema from '@app/realm/SourceChapter';
import SourceMangaSchema from '@app/realm/SourceManga';
import {
  Manga,
  MangaHost,
  MangaMeta,
  MangaMultilingualChapter,
} from '@mangayomu/mangascraper';
import {
  ISourceChapterSchema,
  ISourceMangaSchema,
  IUserHistorySchema,
  getSourceChapterId,
  getSourceMangaId,
} from '@mangayomu/schemas';
import { format } from 'date-fns';
import Link from 'next/link';

import React from 'react';

// function toFlashListData(
//   sections: IUserHistorySchema[],
//   query?: string,
// ) {
//   const parsedQuery = query?.trim().toLowerCase();
//   const newArray: HistorySectionFlashListData[] = [];
//   function addRow(idx: number) {
//     if (
//       !parsedQuery ||
//       (parsedQuery &&
//         localRealm
//           .objectForPrimaryKey(LocalMangaSchema, sections[idx].manga)
//           ?.title.trim()
//           .toLowerCase()
//           .includes(parsedQuery))
//     )
//       newArray.push({ type: 'ROW', item: sections[idx] });
//   }
// }

type HistoryLookup =
  | {
      type: 'manga';
      manga: ISourceMangaSchema;
    }
  | {
      type: 'chapter';
      chapter: ISourceChapterSchema;
    };

export default function Page() {
  const [lookup, setLookup] = React.useState<Record<string, HistoryLookup>>({});
  const [loading, setLoading] = useBoolean(true);
  const userHistory = useQuery(HistorySchema, {
    sort: {
      date: -1,
    },
  });
  const sourceMangas = useMongoClient(SourceMangaSchema);
  const sourceChapters = useMongoClient(SourceChapterSchema);
  const user = useUser();
  const proxy = useMangaProxy();
  const isMounted = React.useRef<boolean>(false);

  React.useEffect(() => {
    const copy = { ...lookup };
    const controller = new AbortController();
    async function init() {
      const [sourceMangasResult, sourceChaptersResult]: [
        ISourceMangaSchema[],
        ISourceChapterSchema[],
      ] = await Promise.all([
        sourceMangas.aggregate([
          {
            $match: {
              link: {
                $in: Array.from(new Set(userHistory.map((x) => x.manga))),
              },
            },
          },
        ]),
        sourceChapters.aggregate([
          {
            $match: {
              link: {
                $in: Array.from(new Set(userHistory.map((x) => x.chapter))),
              },
            },
          },
        ]),
      ]);
      const sourceMangaLookup = new Set(sourceMangasResult.map((x) => x.link));
      const sourceChapterLookup = new Set(
        sourceChaptersResult.map((x) => x.link),
      );
      const missingSourceMangas = Array.from(
        new Set(userHistory.filter((x) => !sourceMangaLookup.has(x.manga))),
      );
      const missingSourceChapters = Array.from(
        new Set(userHistory.filter((x) => !sourceChapterLookup.has(x.chapter))),
      );

      for (const x of sourceMangasResult) {
        copy[x.link] = { type: 'manga', manga: x };
      }
      for (const x of sourceChaptersResult) {
        copy[x.link] = { type: 'chapter', chapter: x };
      }
      try {
        await Promise.all(
          missingSourceMangas.map(async (missingSourceManga) => {
            const host = getMangaHostFromLink(missingSourceManga.manga);
            if (host == null) {
              console.error(`Invalid host for ${missingSourceManga.manga}`);
              return;
            }
            host.proxy = proxy;
            host.signal = controller.signal;
            const meta = await cache(
              missingSourceManga.manga,
              async () => {
                const result = await host.getMeta({
                  link: missingSourceManga.manga,
                });
                user.functions.addSourceChapters(
                  result.chapters,
                  host.defaultLanguage,
                  {
                    link: missingSourceManga.manga,
                    imageCover: result.imageCover,
                    source: result.source,
                    title: result.title,
                  } as Manga,
                );
                return result;
              },
              3600,
            );
            copy[missingSourceManga.manga] = {
              type: 'manga',
              manga: {
                _id: getSourceMangaId(meta),
                description: meta.description,
                imageCover: meta.imageCover,
                link: meta.link,
                source: meta.source,
                title: meta.title,
              },
            };
          }),
        );
      } catch (e) {
        alert(JSON.stringify(e));
      } finally {
        try {
          await Promise.all(
            missingSourceChapters.map(async (missingSourceChapter) => {
              const host = getMangaHostFromLink(missingSourceChapter.manga);
              if (host == null) {
                console.error(`Invalid host for ${missingSourceChapter.manga}`);
                return;
              }
              host.proxy = proxy;
              host.signal = controller.signal;
              const meta = await cache(
                missingSourceChapter.manga,
                async () => {
                  const result = await host.getMeta({
                    link: missingSourceChapter.manga,
                  });

                  user.functions.addSourceChapters(
                    result.chapters,
                    host.defaultLanguage,
                    {
                      link: missingSourceChapter.manga,
                      imageCover: result.imageCover,
                      source: result.source,
                      title: result.title,
                    } as Manga,
                  );
                  return result;
                },

                3600,
              );
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const chapter = meta.chapters.find(
                (x) => x.link === missingSourceChapter.chapter,
              );

              if (chapter != null)
                copy[missingSourceChapter.chapter] = {
                  type: 'chapter',
                  chapter: {
                    _id: getSourceChapterId(meta, chapter),
                    _mangaId: meta.link,
                    language:
                      (chapter as MangaMultilingualChapter).language ??
                      host.defaultLanguage,
                    link: missingSourceChapter.chapter,
                    name: chapter.name,
                  },
                };
              else console.log(`${missingSourceChapter.chapter} deleted`);
            }),
          );
        } finally {
          setLookup(copy);
          setLoading(Object.keys(copy).length === 0 && userHistory.length > 0);
        }
      }
    }
    if (isMounted.current) {
      init();
      return () => {
        controller.abort();
      };
    } else isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proxy, sourceChapters, sourceMangas, user.functions, userHistory]);

  // const collection = useMongoClient(SourceMangaSchema);
  // React.useEffect(() => {
  //   if (p.length > 0) {
  //     collection
  //       .aggregate([
  //         {
  //           $match: {
  //             link: {
  //               $in: p.map((x) => x.manga),
  //             },
  //           },
  //         },
  //       ])
  //       .then((x: ISourceMangaSchema[]) =>
  //         collectMangaMetas(
  //           x.reduce((prev, curr) => {
  //             if (prev[curr.source] == null) prev[curr.source] = [];
  //             prev[curr.source].push(curr.link);
  //             return prev;
  //           }, {} as Record<string, string[]>),
  //         ),
  //       )
  //       .then(console.log);
  //   }
  // }, [p]);

  return (
    <Screen>
      <Screen.Header className="pb-2">
        <Text variant="header">History</Text>
      </Screen.Header>
      <Screen.Content overrideClassName="max-w-screen-xl mx-auto flex flex-col">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          userHistory.map((x) => {
            if (x.manga in lookup === false)
              return <Text key={x._id.toHexString()}>{x.manga} missing</Text>;
            if (x.chapter in lookup === false)
              return <Text key={x._id.toHexString()}>{x.chapter} missing</Text>;
            const { chapter } = lookup[x.chapter] as {
              type: 'chapter';
              chapter: ISourceChapterSchema;
            };
            const { manga } = lookup[x.manga] as {
              type: 'manga';
              manga: ISourceMangaSchema;
            };
            const host = getMangaHost(manga.source);
            return (
              <Link
                href={`/${getSlug(manga.source)}/${getSlug(manga.title)}/${
                  getSlug(chapter.name) +
                  '-' +
                  (isMultilingualChapter(chapter)
                    ? chapter.language
                    : host.defaultLanguage)
                }`}
                key={x._id.toHexString()}
                className="flex flex-row items-center gap-2 px-4 cursor-pointer hover:bg-hover active:bg-pressed transition duration-150"
              >
                <div>
                  <Book.Cover manga={manga} standalone compact />
                </div>
                <div className="flex flex-col">
                  <Text className="font-bold" variant="book-title">
                    {manga.title}
                  </Text>
                  <div className="flex flex-row gap-2">
                    <Text color="text-secondary">{chapter.name}</Text>
                    <Text color="text-secondary">•</Text>
                    <Text className="font-bold" color="text-secondary">
                      {format(x.date, 'h:mm a')}
                    </Text>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </Screen.Content>
    </Screen>
  );
}
