import useMongoClient from '@app/hooks/useMongoClient';
import {
  ISourceChapterSchema,
  ISourceMangaSchema,
  IUserHistorySchema,
} from '@mangayomu/schemas';

type AggregationResult<T> = [
  | {
      links: string[];
      result: T[];
    }
  | undefined,
];

export default async function findMissingMangas(
  userHistory: IUserHistorySchema[],
  sourceMangas: ReturnType<typeof useMongoClient<ISourceMangaSchema>>,
  sourceChapters: ReturnType<typeof useMongoClient<ISourceChapterSchema>>,
) {
  /**
   * Get mangas from DB
   */

  const [[sourceMangasAggregationResult], [sourceChaptersAggregationResult]]: [
    AggregationResult<ISourceMangaSchema>,
    AggregationResult<ISourceChapterSchema>,
  ] = await Promise.all([
    sourceMangas.aggregate([
      {
        $match: {
          link: {
            $in: Array.from(new Set(userHistory.map((x) => x.manga))),
          },
        },
      },
      {
        $group: {
          _id: null,
          links: {
            $push: '$link',
          },
          result: {
            $push: '$$ROOT',
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
      {
        $group: {
          _id: null,
          links: {
            $push: '$link',
          },
          result: {
            $push: '$$ROOT',
          },
        },
      },
    ]),
  ]);

  const sourceMangaLinks = sourceMangasAggregationResult?.links ?? [];
  const sourceMangasResult = sourceMangasAggregationResult?.result ?? [];
  const sourceChaptersResult = sourceChaptersAggregationResult?.result ?? [];
  const sourceChaptersLinks = sourceChaptersAggregationResult?.links ?? [];

  // { links: sourceMangaLinks, result: sourceMangasResult }

  /**
   * Filter out mangas that the DB found. This gives the missing mangas from DB.
   */
  const sourceMangaLookup = new Set(sourceMangaLinks);
  const sourceChapterLookup = new Set(sourceChaptersLinks);
  const missingSourceMangas = userHistory.filter(
    (x) => !sourceMangaLookup.has(x.manga),
  );
  const missingSourceChapters = userHistory.filter(
    (x) => !sourceChapterLookup.has(x.chapter),
  );
  return {
    found: [sourceMangasResult, sourceChaptersResult] as const,
    missing: [missingSourceChapters, missingSourceMangas] as const,
  };
}
