import resolveMissingMangas from '@app/(root)/history/helpers/resolveMissingMangas';
import { HistoryLookup, RemovedChapter } from '@app/(root)/history/page';
import getMangaHost from '@app/helpers/getMangaHost';
import { MangaMultilingualChapter } from '@mangayomu/mangascraper';
import {
  IUserHistorySchema,
  getSourceChapterId,
  getSourceMangaId,
} from '@mangayomu/schemas';

export default function addMissingChapters(
  copy: Record<string, HistoryLookup>,
  removed: Record<string, RemovedChapter>,
  missing: IUserHistorySchema[],
  resolvedMissingMangasLookup: Awaited<
    ReturnType<typeof resolveMissingMangas>
  >[1],
) {
  for (const x of missing) {
    if (x.manga in resolvedMissingMangasLookup) {
      const [meta, chapters] = resolvedMissingMangasLookup[x.manga];
      copy[x.manga] = {
        type: 'manga',
        manga: {
          _id: getSourceMangaId(meta),
          description: meta.description,
          imageCover: meta.imageCover,
          link: meta.link,
          source: meta.source,
          title: meta.title,
        },
      };
      if (x.chapter in chapters) {
        const chapter = chapters[x.chapter];
        const host = getMangaHost(meta.source);
        copy[x.chapter] = {
          type: 'chapter',
          chapter: {
            _id: getSourceChapterId(meta, chapter),
            _mangaId: meta.link,
            language:
              (chapter as MangaMultilingualChapter).language ??
              host.defaultLanguage,
            link: x.chapter,
            name: chapter.name,
          },
        };
      } else {
        removed[x.chapter] = {
          chapter: x.chapter,
          manga: meta,
        };
      }
    }
  }
}
