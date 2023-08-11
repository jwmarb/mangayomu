import { Handler, Route } from '@mangayomu/request-handler';
import { getSourceMangaId, mongodb } from '@main';
import { Manga as UserManga, SourceManga } from '@main';
import { Manga } from '@mangayomu/mangascraper';
import { IMangaSchema, ISourceMangaSchema } from '@mangayomu/schemas';

const post: Route = async (req, res) => {
  const mangas = req.body<Manga[]>();
  const bulkWriteOperationSourceManga: Parameters<
    typeof SourceManga.bulkWrite<ISourceMangaSchema>
  >[0] = [];
  const bulkWriteOperationUserManga: Parameters<
    typeof UserManga.bulkWrite<IMangaSchema>
  >[0] = [];
  for (let i = 0; i < mangas.length; i++) {
    const _id = getSourceMangaId(mangas[i]);
    bulkWriteOperationSourceManga.push({
      updateOne: {
        upsert: true,
        filter: { _id },
        update: [
          {
            $set: { _id, ...mangas[i] },
          },
        ],
      },
    });
    bulkWriteOperationUserManga.push({
      updateMany: {
        filter: { link: mangas[i].link },
        update: [{ $set: mangas[i] }],
      },
    });
  }
  await Promise.all([
    SourceManga.bulkWrite(bulkWriteOperationSourceManga),
    UserManga.bulkWrite(bulkWriteOperationUserManga),
  ]);
  res.json('success');
};

export default Handler.builder()
  .middleware(mongodb())
  .route('POST', post)
  .build();
