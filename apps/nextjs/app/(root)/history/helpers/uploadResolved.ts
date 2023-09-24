import resolveMissingMangas from '@app/(root)/history/helpers/resolveMissingMangas';
import getMangaHost from '@app/helpers/getMangaHost';
import useMongoClient from '@app/hooks/useMongoClient';
import { Manga, MangaChapter, MangaMeta } from '@mangayomu/mangascraper';
import {
  ISourceChapterSchema,
  ISourceMangaSchema,
  IUserHistorySchema,
  getSourceChapterId,
  getSourceMangaId,
} from '@mangayomu/schemas';

export default async function uploadResolved(
  missingSourceChapters: IUserHistorySchema[],
  resolvedMissingMangasArr: (Manga & MangaMeta<MangaChapter>)[],
  sourceMangas: ReturnType<typeof useMongoClient<ISourceMangaSchema>>,
  sourceChapters: ReturnType<typeof useMongoClient<ISourceChapterSchema>>,
  resolvedMissingMangasLookup: Awaited<
    ReturnType<typeof resolveMissingMangas>
  >[1],
) {
  const resolvedMissingChaptersArr = missingSourceChapters.reduce((prev, x) => {
    if (x.manga in resolvedMissingMangasLookup) {
      const [meta, chapters] = resolvedMissingMangasLookup[x.manga];
      const chapter = chapters[x.chapter];
      const host = getMangaHost(meta.source);
      if (chapter != null) {
        const next = meta.chapters[chapter.index - 1];
        const previous = meta.chapters[chapter.index + 1];
        prev.push({
          _id: getSourceChapterId(meta, chapter),
          _mangaId: x.manga,
          _nextId:
            next != null && next.language === chapter.language
              ? getSourceChapterId(meta, next)
              : null,
          _prevId:
            previous != null && previous.language === chapter.language
              ? getSourceChapterId(meta, previous)
              : null,
          language: chapter.language ?? host.defaultLanguage,
          link: x.chapter,
          name: chapter.name,
        });
      }
    }
    return prev;
  }, [] as ISourceChapterSchema[]);

  const [foundSourceMangas, foundSourceChapters]: [
    ISourceMangaSchema[],
    ISourceChapterSchema[],
  ] = await Promise.all([
    sourceMangas.aggregate([
      {
        $match: {
          _id: {
            $in: resolvedMissingMangasArr.map((x) => getSourceMangaId(x)),
          },
        },
      },
    ]),
    sourceChapters.aggregate([
      {
        $match: {
          _id: {
            $in: resolvedMissingChaptersArr.map((x) => x._id),
          },
        },
      },
    ]),
  ]);

  if (foundSourceMangas.length !== resolvedMissingMangasArr.length) {
    const matches = new Set(foundSourceMangas.map((x) => x._id));
    sourceMangas.insertMany(
      resolvedMissingMangasArr.reduce((prev, x) => {
        const _id = getSourceMangaId(x);
        if (!matches.has(_id)) {
          matches.add(_id);
          prev.push({
            _id,
            description: x.description,
            imageCover: x.imageCover,
            link: x.link,
            source: x.source,
            title: x.title,
          });
        }
        return prev;
      }, [] as ISourceMangaSchema[]),
    );
  }
  if (foundSourceChapters.length !== resolvedMissingChaptersArr.length) {
    const matches = new Set(foundSourceChapters.map((x) => x._id));
    sourceChapters.insertMany(
      resolvedMissingChaptersArr.reduce((prev, x) => {
        if (!matches.has(x._id)) {
          matches.add(x._id);
          prev.push(x);
        }
        return prev;
      }, [] as ISourceChapterSchema[]),
    );
  }
}
