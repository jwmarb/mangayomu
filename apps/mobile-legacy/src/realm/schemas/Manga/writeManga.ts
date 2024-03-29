import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { MangaSchema } from '@database/schemas/Manga';
import { ISOLangCode } from '@mangayomu/language-codes';
import { Manga, MangaHost, MangaMeta } from '@mangayomu/mangascraper/src';
import { ILocalManga } from '@mangayomu/schemas';
import { useUser } from '@realm/react';
import Realm from 'realm';

export default function writeManga(
  localRealm: Realm,
  realm: Realm,
  meta: MangaMeta & Manga,
  chapters: string[],
  availableLanguages: ISOLangCode[],
  user: ReturnType<typeof useUser>,
) {
  const localManga = localRealm.objectForPrimaryKey(
    LocalMangaSchema,
    meta.link,
  );
  user.functions.addSourceManga(
    meta,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    MangaHost.sourcesMap.get(meta.source)!.defaultLanguage,
  );

  const cloudManga = realm
    .objects(MangaSchema)
    .filtered('link = $0', meta.link)[0];
  realm.write(() => {
    if (cloudManga != null) {
      cloudManga.imageCover = meta.imageCover;
      cloudManga.title = meta.title;
    }
  });
  localRealm.write(() => {
    if (localManga == null)
      localRealm.create(LocalMangaSchema, {
        ...meta,
        genres: meta.genres as unknown as Set<string>,
        chapters,
        _id: meta.link,
        availableLanguages,
      });
    else {
      const jsonManga = localManga.toJSON() as unknown as ILocalManga;
      for (const key in jsonManga) {
        if (
          key in localManga &&
          key in meta &&
          key !== 'genres' &&
          key !== 'chapters'
        )
          (localManga as any)[key as keyof ILocalManga] =
            meta[key as keyof typeof meta];
      }
      localManga.availableLanguages = availableLanguages;
      localManga.chapters = chapters;
    }
  });
  // mangaRealm.write(() => {
  //   mangaRealm.create<MangaSchema>(
  //     'Manga',
  //     {
  //       ...meta,
  //       _id: meta.link,
  //       _realmId: currentUser.id,
  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //       genres: meta.genres as unknown as Set<string>,
  //       chapters,
  //       availableLanguages,
  //       readerDirection: meta.genres.some((genre) => {
  //         const formatted = genre.toLowerCase();
  //         return (
  //           formatted === 'manhwa' ||
  //           formatted === 'manhua' ||
  //           formatted === 'webtoon'
  //         );
  //       })
  //         ? ReadingDirection.WEBTOON
  //         : manga?.readerDirection ?? 'Use global setting',
  //       notifyNewChaptersCount: 0,
  //     },
  //     Realm.UpdateMode.Modified,
  //   );
  // });
}
