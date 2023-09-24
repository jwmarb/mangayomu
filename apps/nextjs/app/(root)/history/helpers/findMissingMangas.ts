import useMongoClient from '@app/hooks/useMongoClient';
import {
  ISourceChapterSchema,
  ISourceMangaSchema,
  IUserHistorySchema,
} from '@mangayomu/schemas';

export default async function findMissingMangas(
  userHistory: IUserHistorySchema[],
  sourceMangas: ReturnType<typeof useMongoClient<ISourceMangaSchema>>,
  sourceChapters: ReturnType<typeof useMongoClient<ISourceChapterSchema>>,
) {
  /**
   * Get mangas from DB
   */
  const [sourceMangasResult, sourceChaptersResult]: [
    ISourceMangaSchema[],
    ISourceChapterSchema[],
  ] = await Promise.all([
    sourceMangas.aggregate([
      {
        $match: {
          link: {
            $in: Array.from(new Set(userHistory.map((x) => x.manga))),
          },
        },
      },
    ]),
    sourceChapters.aggregate([
      {
        $match: {
          link: {
            $in: Array.from(new Set(userHistory.map((x) => x.chapter))),
          },
        },
      },
    ]),
  ]);

  /**
   * Filter out mangas that the DB found. This gives the missing mangas from DB.
   */
  const sourceMangaLookup = new Set(sourceMangasResult.map((x) => x.link));
  const sourceChapterLookup = new Set(sourceChaptersResult.map((x) => x.link));
  const missingSourceMangas = Array.from(
    new Set(userHistory.filter((x) => !sourceMangaLookup.has(x.manga))),
  );
  const missingSourceChapters = Array.from(
    new Set(userHistory.filter((x) => !sourceChapterLookup.has(x.chapter))),
  );
  return {
    found: [sourceMangasResult, sourceChaptersResult] as const,
    missing: [missingSourceChapters, missingSourceMangas] as const,
  };
}
