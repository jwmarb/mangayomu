'use client';
import Button from '@app/components/Button';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import collectMangaMetas from '@app/helpers/collectMangaMetas';
import getSlug from '@app/helpers/getSlug';
import useMongoClient from '@app/hooks/useMongoClient';
import useQuery from '@app/hooks/useQuery';
import HistorySchema from '@app/realm/History';
import SourceChapterSchema from '@app/realm/SourceChapter';
import SourceMangaSchema from '@app/realm/SourceManga';
import { ISourceMangaSchema, IUserHistorySchema } from '@mangayomu/schemas';
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

export default function Page() {
  const p = useQuery(HistorySchema, {
    sort: {
      date: -1,
    },
  });
  const sourceMangas = useMongoClient(SourceMangaSchema);
  const sourceChapters = useMongoClient(SourceChapterSchema);
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
      <Screen.Content>
        {p.map((x) => (
          <div key={x._id.toHexString()} className="grid grid-cols-2">
            <Text>{x.chapter}</Text>
            <Text>{format(x.date, 'MMM d, h:mm a')}</Text>
          </div>
        ))}
      </Screen.Content>
    </Screen>
  );
}
