import { useRealm } from '@database/main';
import { MangaHistory, UserHistorySchema } from '@database/schemas/History';
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
    if (!config.incognito && currentUser != null) {
      const document = realm.objectForPrimaryKey(
        UserHistorySchema,
        currentUser.id,
      );
      if (document != null) {
        const { history: sections } = document;
        realm.write(() => {
          if (
            sections.length === 0 ||
            !isToday(sections[sections.length - 1]?.date)
          ) {
            sections.push({ data: [], date: Date.now() });
          }
          const recentSection = sections[sections.length - 1];
          const dateNow = Date.now();
          const appendData = {
            manga: {
              link: assertIsManga(payload.manga)
                ? payload.manga.link
                : payload.manga._id,
              imageCover: payload.manga.imageCover,
              source: payload.manga.source,
              title: payload.manga.title,
            },
            chapter: payload.chapter,
            date: dateNow,
          };
          if (recentSection.data.length === 0) {
            recentSection.data.push(appendData);
          } else {
            const sortedList = integrateSortedList(
              recentSection.data,
              (a, b) => a.date - b.date,
            );
            const index = recentSection.data.findIndex(
              (x) => x.manga.link === mangaSchemaToManga(payload.manga).link,
            ); // Linear search is more than sufficient enough here
            if (index !== -1) {
              recentSection.data.splice(index, 1);
              sortedList.add(appendData);
            } else recentSection.data.push(appendData);
          }
        });
      } else {
        realm.write(() => {
          realm.create<UserHistorySchema>(UserHistorySchema, {
            _id: currentUser.id,
            history: [
              {
                data: [
                  {
                    manga: mangaSchemaToManga(payload.manga),
                    chapter: payload.chapter,
                    date: Date.now(),
                  },
                ],
                date: Date.now(),
              },
            ],
          });
        });
      }
    }
  };

  const deleteMangaFromHistory = (payload: {
    sectionDate: number;
    item: MangaHistory;
  }) => {
    if (currentUser != null) {
      const document = realm.objectForPrimaryKey(
        UserHistorySchema,
        currentUser.id,
      );
      if (document != null && document.isValid())
        realm.write(() => {
          const { history: sections } = document;
          let index = 0;
          for (let i = 0; i < sections.length; i++) {
            if (sections[i].date === payload.sectionDate) {
              index = i;
              break;
            }
          }
          const sortedList = integrateSortedList(sections[index].data, (a, b) =>
            a.manga.link.localeCompare(b.manga.link),
          );
          sortedList.remove(payload.item);
          if (sections[index].data.length === 0) sections.splice(index, 1);
        });
    }
  };

  const clearMangaHistory = () => {
    if (currentUser != null) {
      const document = realm.objectForPrimaryKey(
        UserHistorySchema,
        currentUser.id,
      );
      if (document != null && document.isValid())
        realm.write(() => {
          document.history = [];
        });
    }
  };
  return { addMangaToHistory, deleteMangaFromHistory, clearMangaHistory };
};

export default useUserHistory;
