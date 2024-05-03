import resolveMissingMangas from '@app/(root)/history/helpers/resolveMissingMangas';
import { HistoryLookup } from '@app/(root)/history/page';
import { IUserHistorySchema, getSourceMangaId } from '@mangayomu/schemas';

export default function addMissingMangas(
  copy: Record<string, HistoryLookup>,
  missing: IUserHistorySchema[],
  resolvedMissingMangasLookup: Awaited<
    ReturnType<typeof resolveMissingMangas>
  >[1],
) {
  for (const x of missing) {
    if (x.manga in resolvedMissingMangasLookup) {
      const [meta] = resolvedMissingMangasLookup[x.manga];
      copy[x.manga] = {
        type: 'manga',
        manga: {
          _id: getSourceMangaId(meta),
          description: meta.description as any,
          imageCover: meta.imageCover,
          link: meta.link,
          source: meta.source,
          title: meta.title,
        },
      };
    }
  }
}
