'use client';
import addMissingMangas from '@app/(root)/history/helpers/addMissingMangas';
import addMissingChapters from '@app/(root)/history/helpers/addMissingChapters';
import findMissingMangas from '@app/(root)/history/helpers/findMissingMangas';
import resolveMissingMangas from '@app/(root)/history/helpers/resolveMissingMangas';
import Book from '@app/components/Book';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import { useMangaProxy } from '@app/context/proxy';
import { useUser } from '@app/context/realm';
import getMangaHost from '@app/helpers/getMangaHost';
import getSlug from '@app/helpers/getSlug';
import isMultilingualChapter from '@app/helpers/isMultilingualChapter';
import useBoolean from '@app/hooks/useBoolean';
import useMongoClient from '@app/hooks/useMongoClient';
import useQuery from '@app/hooks/useQuery';
import HistorySchema from '@app/realm/History';
import SourceChapterSchema from '@app/realm/SourceChapter';
import SourceMangaSchema from '@app/realm/SourceManga';
import {
  ISourceChapterSchema,
  ISourceMangaSchema,
  IUserHistorySchema,
  getSourceChapterId,
  getSourceMangaId,
} from '@mangayomu/schemas';
import { format, isSameDay } from 'date-fns';
import Link from 'next/link';

import React from 'react';
import { Manga, MangaChapter, MangaMeta } from '@mangayomu/mangascraper';
import uploadResolved from '@app/(root)/history/helpers/uploadResolved';
import Section from './components/section';
import HistoryEntry from './components/historyentry';
import NotFoundEntry from '@app/(root)/history/components/notfoundentry';
import HistoryLoading from './components/historyloading';
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

export type RemovedChapter = {
  chapter: string;
  manga: Manga & MangaMeta<MangaChapter>;
};

export type HistoryLookup =
  | {
      type: 'manga';
      manga: ISourceMangaSchema;
    }
  | {
      type: 'chapter';
      chapter: Omit<ISourceChapterSchema, '_nextId' | '_prevId'>;
    };

export type HistorySection = { type: 'section'; date: number };
export type HistoryItem = { type: 'item'; item: IUserHistorySchema };
type Data = HistorySection | HistoryItem;

export default function Page() {
  const [lookup, setLookup] = React.useState<Record<string, HistoryLookup>>({});
  const [removed, setRemoved] = React.useState<Record<string, RemovedChapter>>(
    {},
  );
  const [loading, setLoading] = useBoolean(true);
  const [userHistoryLoading, toggleUserHistoryLoading] = useBoolean(true);
  const userHistory = useQuery(
    HistorySchema,
    {
      sort: {
        date: -1,
      },
    },
    { onData: () => toggleUserHistoryLoading(false) },
  );
  const data = React.useMemo(
    () =>
      userHistory.length > 0
        ? userHistory
            .reduce(
              (prev, x) => {
                if (isSameDay(x.date, prev[prev.length - 1].date)) {
                  prev[prev.length - 1].data.push(x);
                } else {
                  prev.push({ date: x.date, data: [x] });
                }
                return prev;
              },
              [{ data: [], date: userHistory[0].date }] as {
                data: IUserHistorySchema[];
                date: number;
              }[],
            )
            .reduce((prev, x) => {
              prev.push({ type: 'section', date: x.date });
              for (let i = 0; i < x.data.length; i++) {
                prev.push({ type: 'item', item: x.data[i] });
              }
              return prev;
            }, [] as Data[])
        : [],
    [userHistory],
  );
  const sourceMangas = useMongoClient(SourceMangaSchema);
  const sourceChapters = useMongoClient(SourceChapterSchema);
  const user = useUser();
  const proxy = useMangaProxy();
  const isMounted = React.useRef<boolean>(false);

  React.useEffect(() => {
    const copy = { ...lookup };
    const removedCopy = { ...removed };
    async function init() {
      const {
        found: [sourceMangasResult, sourceChaptersResult],
        missing: [missingSourceChapters, missingSourceMangas],
      } = await findMissingMangas(userHistory, sourceMangas, sourceChapters);

      for (const x of sourceMangasResult) {
        copy[x.link] = { type: 'manga', manga: x };
      }
      for (const x of sourceChaptersResult) {
        copy[x.link] = { type: 'chapter', chapter: x };
      }

      try {
        const [resolvedMissingMangasArr, resolvedMissingMangasLookup] =
          await resolveMissingMangas(
            missingSourceChapters.concat(missingSourceMangas),
            proxy,
          );

        addMissingChapters(
          copy,
          removedCopy,
          missingSourceChapters,
          resolvedMissingMangasLookup,
        );
        addMissingMangas(
          copy,
          missingSourceMangas,
          resolvedMissingMangasLookup,
        );
        await uploadResolved(
          missingSourceChapters,
          resolvedMissingMangasArr,
          sourceMangas,
          sourceChapters,
          resolvedMissingMangasLookup,
        );
      } catch (e) {
        console.error(e);
      } finally {
        setRemoved(removedCopy);
        setLookup(copy);
        setLoading(
          (Object.keys(copy).length === 0 && userHistory.length > 0) ||
            userHistoryLoading,
        );
      }
    }
    if (isMounted.current) {
      init();
    } else isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    proxy,
    sourceChapters,
    sourceMangas,
    user.functions,
    userHistory,
    userHistoryLoading,
  ]);

  return (
    <Screen>
      <Screen.Header className="pb-2">
        <Text variant="header">History</Text>
      </Screen.Header>
      <Screen.Content overrideClassName="max-w-screen-xl mx-auto flex flex-col pb-52">
        {loading ? (
          <HistoryLoading />
        ) : (
          data.map((x) => {
            switch (x.type) {
              case 'section':
                return <Section key={x.date} date={x.date} />;
              case 'item': {
                if (x.item.chapter in removed)
                  return (
                    <NotFoundEntry
                      key={x.item._id.toHexString()}
                      removed={removed[x.item.chapter]}
                    />
                  );
                if (x.item.manga in lookup === false)
                  return (
                    <Text key={x.item._id.toHexString()}>
                      {x.item.manga} missing
                    </Text>
                  );
                if (x.item.chapter in lookup === false)
                  return (
                    <Text key={x.item._id.toHexString()}>
                      {x.item.chapter} missing
                    </Text>
                  );
                const { chapter } = lookup[x.item.chapter] as {
                  type: 'chapter';
                  chapter: ISourceChapterSchema;
                };
                const { manga } = lookup[x.item.manga] as {
                  type: 'manga';
                  manga: ISourceMangaSchema;
                };
                return (
                  <HistoryEntry
                    entry={x.item}
                    manga={manga}
                    chapter={chapter}
                  />
                );
              }
            }
          })
        )}
      </Screen.Content>
    </Screen>
  );
}
