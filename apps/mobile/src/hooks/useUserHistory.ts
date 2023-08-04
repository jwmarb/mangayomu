import { useRealm } from '@database/main';
import { UserHistorySchema } from '@database/schemas/History';
import { MangaSchema } from '@database/schemas/Manga';
import assertIsManga from '@helpers/assertIsManga';
import integrateSortedList from '@helpers/integrateSortedList';
import mangaSchemaToManga from '@helpers/mangaSchemaToManga';
import { Manga, MangaChapter } from '@mangayomu/mangascraper/src';
import { useUser } from '@realm/react';
import { isToday } from 'date-fns';

const useUserHistory = (config?: { incognito: boolean }) => {
  const realm = useRealm();
  const currentUser = useUser();

  const addMangaToHistory = (payload: {
    manga: Manga | MangaSchema;
    chapter: MangaChapter;
  }) => {
    if (config == null)
      throw Error(
        'A config argument must be provided to use addMangaToHistory',
      );
    if (config.incognito) return;

    const mangaId = assertIsManga(payload.manga)
      ? payload.manga.link
      : payload.manga._id;

    const date = new Date();
    const today = Date.parse(
      new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
      ).toString(),
    );
    const tomorrow = Date.parse(
      new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + 1,
      ).toString(),
    );

    const found = realm
      .objects(UserHistorySchema)
      .filtered(
        'chapter = $0 AND manga = $1 AND date >= $2 AND date < $3',
        payload.chapter.link,
        mangaId,
        today,
        tomorrow,
      );

    if (found.length === 0)
      realm.write(() => {
        realm.create(UserHistorySchema, {
          _realmId: currentUser.id,
          manga: mangaId,
          chapter: payload.chapter.link,
        });
      });
    // if (!config.incognito && currentUser != null) {
    //   const document = realm.objectForPrimaryKey(
    //     UserHistorySchema,
    //     currentUser.id,
    //   );
    //   if (document != null) {
    //     const { history: sections } = document;
    //     realm.write(() => {
    //       if (
    //         sections.length === 0 ||
    //         !isToday(sections[sections.length - 1]?.date)
    //       ) {
    //         sections.push({ data: [], date: Date.now() });
    //       }
    //       const recentSection = sections[sections.length - 1];
    //       const dateNow = Date.now();
    //       const appendData = {
    //         manga: {
    //           link: assertIsManga(payload.manga)
    //             ? payload.manga.link
    //             : payload.manga._id,
    //           imageCover: payload.manga.imageCover,
    //           source: payload.manga.source,
    //           title: payload.manga.title,
    //         },
    //         chapter: payload.chapter,
    //         date: dateNow,
    //       };
    //       if (recentSection.data.length === 0) {
    //         recentSection.data.push(appendData);
    //       } else {
    //         const sortedList = integrateSortedList(
    //           recentSection.data,
    //           (a, b) => a.date - b.date,
    //         );
    //         const index = recentSection.data.findIndex(
    //           (x) => x.manga.link === mangaSchemaToManga(payload.manga).link,
    //         ); // Linear search is more than sufficient enough here
    //         if (index !== -1) {
    //           recentSection.data.splice(index, 1);
    //           sortedList.add(appendData);
    //         } else recentSection.data.push(appendData);
    //       }
    //     });
    //   } else {
    //     realm.write(() => {
    //       realm.create<UserHistorySchema>(UserHistorySchema, {
    //         _id: currentUser.id,
    //         history: [
    //           {
    //             data: [
    //               {
    //                 manga: mangaSchemaToManga(payload.manga),
    //                 chapter: payload.chapter,
    //                 date: Date.now(),
    //               },
    //             ],
    //             date: Date.now(),
    //           },
    //         ],
    //       });
    //     });
    // }
    // }
  };

  const deleteMangaFromHistory = (id: string) => {
    realm.write(() => {
      realm.delete(realm.objectForPrimaryKey(UserHistorySchema, id));
    });
  };

  const clearMangaHistory = () => {
    realm.write(() => {
      realm.delete(realm.objects(UserHistorySchema));
    });
  };
  return { addMangaToHistory, deleteMangaFromHistory, clearMangaHistory };
};

export default useUserHistory;
