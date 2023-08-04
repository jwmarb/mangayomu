import { useRealm } from '@database/main';
import { UserHistorySchema } from '@database/schemas/History';
import { MangaSchema } from '@database/schemas/Manga';
import { Manga, MangaChapter } from '@mangayomu/mangascraper/src';
import { useUser } from '@realm/react';

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

    const mangaId = payload.manga.link;

    const date = new Date();
    const today = Date.parse(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).toString(),
    );
    const tomorrow = Date.parse(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
      ).toString(),
    );

    const found = realm
      .objects(UserHistorySchema)
      .filtered(
        'manga = $0 AND date >= $1 AND date < $2',
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
    else
      realm.write(() => {
        found[0].chapter = payload.chapter.link;
        found[0].date = Date.now();
      });
  };

  const deleteMangaFromHistory = (id: Realm.BSON.ObjectId) => {
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
