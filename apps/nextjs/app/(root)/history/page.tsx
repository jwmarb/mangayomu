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
  getSourceChapterId,
  getSourceMangaId,
} from '@mangayomu/schemas';
import { format } from 'date-fns';
import Link from 'next/link';

import React from 'react';
import { Manga, MangaChapter, MangaMeta } from '@mangayomu/mangascraper';
import uploadResolved from '@app/(root)/history/helpers/uploadResolved';

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

export default function Page() {
  const [lookup, setLookup] = React.useState<Record<string, HistoryLookup>>({});
  const [removed, setRemoved] = React.useState<Record<string, RemovedChapter>>(
    {},
  );
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
    const removedCopy = { ...removed };
    const controller = new AbortController();
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
        setLoading(Object.keys(copy).length === 0 && userHistory.length > 0);
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
