import cache from '@app/helpers/cache';
import getMangaHostFromLink from '@app/helpers/getMangaHostFromLink';
import {
  Manga,
  MangaChapter,
  MangaMeta,
  MangaMultilingualChapter,
} from '@mangayomu/mangascraper';
import { IUserHistorySchema } from '@mangayomu/schemas';

export default async function resolveMissingMangas(
  missing: IUserHistorySchema[],
  proxy?: string,
) {
  function getMeta(missingManga: IUserHistorySchema) {
    return cache(
      missingManga.manga,
      async () => {
        const host = getMangaHostFromLink(missingManga.manga);
        if (host == null) throw Error('Invalid host for ' + missingManga.manga);

        host.proxy = proxy;

        const meta = await host.getMeta({ link: missingManga.manga });
        return [
          meta,
          meta.chapters.reduce((prev: any, x: any) => {
            prev[x.link] = x;
            return prev;
          }, {} as Record<string, MangaChapter>),
        ] as [Manga & MangaMeta<MangaChapter>, Record<string, MangaChapter>];
      },
      3600,
    );
  }

  const uniq = new Set();
  const p = missing.reduce((prev, x) => {
    if (!uniq.has(x.manga)) {
      uniq.add(x.manga);
      prev.push(x);
    }
    return prev;
  }, [] as IUserHistorySchema[]);

  const resolvedMissingMangas = await Promise.allSettled(
    p.map((missingManga) => getMeta(missingManga)),
  );
  const resolvedMissingMangasArr: (Manga & MangaMeta<MangaChapter>)[] = [];
  const lookup: Record<
    string,
    [
      Manga &
        MangaMeta<
          MangaChapter & Partial<Pick<MangaMultilingualChapter, 'language'>>
        >,
      Record<
        string,
        MangaChapter & Partial<Pick<MangaMultilingualChapter, 'language'>>
      >,
    ]
  > = {};
  for (let i = 0; i < resolvedMissingMangas.length; i++) {
    const x = resolvedMissingMangas[i];
    switch (x.status) {
      case 'fulfilled':
        resolvedMissingMangasArr.push(x.value[0]);
        lookup[x.value[0].link] = x.value;
        break;
    }
  }

  return [resolvedMissingMangasArr, lookup] as const;
}
