import { MangaSchema } from '@database/schemas/Manga';
import { ISOLangCode } from '@mangayomu/language-codes';
import { Manga, MangaMeta } from '@mangayomu/mangascraper/src';
import { useUser } from '@realm/react';
import { ReadingDirection } from '@redux/slices/settings';

export default function writeManga(
  mangaRealm: Realm,
  meta: MangaMeta & Manga,
  currentUser: ReturnType<typeof useUser>,
  chapters: string[],
  availableLanguages: ISOLangCode[],
) {
  const manga = mangaRealm.objectForPrimaryKey(MangaSchema, meta.link);
  mangaRealm.write(() => {
    mangaRealm.create<MangaSchema>(
      'Manga',
      {
        ...meta,
        _id: meta.link,
        _realmId: currentUser.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        genres: meta.genres as unknown as Set<string>,
        chapters,
        availableLanguages,
        readerDirection: meta.genres.some((genre) => {
          const formatted = genre.toLowerCase();
          return (
            formatted === 'manhwa' ||
            formatted === 'manhua' ||
            formatted === 'webtoon'
          );
        })
          ? ReadingDirection.WEBTOON
          : manga?.readerDirection ?? 'Use global setting',
        notifyNewChaptersCount: 0,
      },
      Realm.UpdateMode.Modified,
    );
  });
}
