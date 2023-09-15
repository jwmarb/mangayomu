'use client';
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

const ITEMS_PER_PAGE = 10;

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
  const [pageIndex, setPageIndex] = React.useState<number>(1);
  const userHistory = useQuery(HistorySchema, {
    sort: {
      date: -1,
    },
  });
  const sourceMangas = useMongoClient(SourceMangaSchema);
  const sourceChapters = useMongoClient(SourceChapterSchema);
  const user = useUser();
  const proxy = useMangaProxy();
  const userHistoryEntries = React.useMemo(
    () =>
      userHistory.slice(
        pageIndex * ITEMS_PER_PAGE,
        Math.min((pageIndex + 1) * ITEMS_PER_PAGE, userHistory.length),
      ),
    [pageIndex, userHistory],
  );
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
      setLookup(copy);
      // try {
      //   for (const missingSourceManga of missingSourceMangas) {
      //     const host = getMangaHostFromLink(missingSourceManga.manga);
      //     if (host == null) {
      //       console.error(`Invalid host for ${missingSourceManga.manga}`);
      //       return;
      //     }
      //     host.proxy = proxy;
      //     host.signal = controller.signal;
      //     const meta = await cache(
      //       missingSourceManga.manga,
      //       async () => {
      //         const result = await host.getMeta({
      //           link: missingSourceManga.manga,
      //         });
      //         user.functions.addSourceChapters(
      //           result.chapters,
      //           host.defaultLanguage,
      //           {
      //             link: missingSourceManga.manga,
      //             imageCover: result.imageCover,
      //             source: result.source,
      //             title: result.title,
      //           } as Manga,
      //         );
      //         return result;
      //       },
      //       3600,
      //     );
      //     lookup[missingSourceManga.manga] = {
      //       type: 'manga',
      //       manga: {
      //         _id: getSourceMangaId(meta),
      //         description: meta.description,
      //         imageCover: meta.imageCover,
      //         link: meta.link,
      //         source: meta.source,
      //         title: meta.title,
      //       },
      //     };
      //   }
      // } catch (e) {
      //   alert(JSON.stringify(e));
      // } finally {
      //   for (const missingSourceChapter of missingSourceChapters) {
      //     const host = getMangaHostFromLink(missingSourceChapter.manga);
      //     if (host == null) {
      //       console.error(`Invalid host for ${missingSourceChapter.manga}`);
      //       break;
      //     }
      //     host.proxy = proxy;
      //     host.signal = controller.signal;
      //     const meta = await cache(
      //       missingSourceChapter.manga,
      //       async () => {
      //         const result = await host.getMeta({
      //           link: missingSourceChapter.manga,
      //         });
      //         user.functions.addSourceChapters(
      //           result.chapters,
      //           host.defaultLanguage,
      //           {
      //             link: missingSourceChapter.manga,
      //             imageCover: result.imageCover,
      //             source: result.source,
      //             title: result.title,
      //           } as Manga,
      //         );
      //         return result;
      //       },

      //       3600,
      //     );
      //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //     const chapter = meta.chapters.find(
      //       (x) => x.link === missingSourceChapter.chapter,
      //     )!;
      //     lookup[missingSourceChapter.chapter] = {
      //       type: 'chapter',
      //       chapter: {
      //         _id: getSourceChapterId(meta, chapter),
      //         _mangaId: meta.link,
      //         language:
      //           (chapter as MangaMultilingualChapter).language ??
      //           host.defaultLanguage,
      //         link: missingSourceChapter.chapter,
      //         name: chapter.name,
      //       },
      //     };
      //   }
      // }
    }
    init();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proxy, sourceChapters, sourceMangas, user.functions]);

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
  function incrementPage() {
    setPageIndex((x) =>
      Math.min(x + 1, Math.floor(userHistory.length / ITEMS_PER_PAGE) - 1),
    );
  }
  function decrementPage() {
    setPageIndex((x) => Math.max(x - 1, 0));
  }
  return (
    <Screen>
      <Screen.Header className="pb-2">
        <Text variant="header">History</Text>
      </Screen.Header>
      <Screen.Content className="flex flex-col gap-2">
        <div className="flex flex-row justify-evenly items-center">
          <Button onPress={decrementPage}>Previous</Button>
          <Button
            onPress={() => {
              console.log(lookup);
            }}
          >
            test
          </Button>
          <Button onPress={incrementPage}>Next</Button>
        </div>
        {userHistoryEntries.map((x) => (
          <div key={x._id.toHexString()} className="grid grid-cols-2">
            <Text>{x.chapter}</Text>
            <Text>{format(x.date, 'MMM d, h:mm a')}</Text>
          </div>
        ))}
      </Screen.Content>
    </Screen>
  );
}
