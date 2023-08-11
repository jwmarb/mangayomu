import {
  Manga,
  MangaChapter,
  MangaHost,
  MangaMeta,
  MangaMultilingualChapter,
} from '@mangayomu/mangascraper';
import { Handler, ResponseError, Route } from '@mangayomu/request-handler';
import { StatusCodes } from 'http-status-codes';
import {
  Manga as UserManga,
  SourceManga,
  getErrorMessage,
  mongodb,
  slugify,
  SourceChapter,
  redis,
  state,
} from '@main';
import pLimit from 'promise-limit';
import {
  IMangaSchema,
  ISourceChapterSchema,
  ISourceMangaSchema,
} from '@mangayomu/schemas';
import env from '@mangayomu/vercel-env';

const post: Route = async (req, res) => {
  const data = req.body<MangaMeta<MangaChapter> & Manga>();
  const doc = await SourceManga.findById(
    slugify(data.source) + '/' + slugify(data.title),
  ).exec();

  if (doc == null)
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json(
        ResponseError.from(StatusCodes.UNPROCESSABLE_ENTITY, 'Illegal request'),
      );

  const bulkWriteOperationSourceChapter: Parameters<
    typeof SourceManga.bulkWrite<ISourceChapterSchema>
  >[0] = [];
  for (let i = 0; i < data.chapters.length; i++) {
    bulkWriteOperationSourceChapter.push({
      updateOne: {
        filter: { _id: data.chapters[i].link },
        update: {
          _mangaId: data.link,
          language:
            (data.chapters[i] as MangaMultilingualChapter).language ?? 'en',
        },
        upsert: true,
      },
    });
  }
  await Promise.all([
    SourceChapter.bulkWrite(bulkWriteOperationSourceChapter),
    SourceManga.updateOne(
      { _id: slugify(data.source) + '/' + slugify(data.title) },
      {
        $set: {
          title: data.title,
          imageCover: data.imageCover,
          link: data.link,
        },
      },
    ).exec(),
    UserManga.updateMany(
      { link: data.link },
      {
        $set: {
          title: data.title,
          imageCover: data.imageCover,
        },
      },
    ).exec(),
  ]);
  res.json('success');
};

const patch: Route = async (req, res) => {
  const { mangas: body } = req.body<{ mangas: Record<string, string[]> }>();
  const mangas = Object.entries(body);
  const bulkWriteOperationSourceManga: Parameters<
    typeof SourceManga.bulkWrite<ISourceMangaSchema>
  >[0] = [];
  const bulkWriteOperationUserManga: Parameters<
    typeof SourceManga.bulkWrite<IMangaSchema>
  >[0] = [];
  const bulkWriteOperationSourceChapter: Parameters<
    typeof SourceManga.bulkWrite<ISourceChapterSchema>
  >[0] = [];
  const result = await Promise.allSettled(
    mangas.map(async ([source, value]) => {
      const limit = pLimit<MangaMeta<MangaChapter> & Manga>(100);
      const host = MangaHost.sourcesMap.get(source);
      if (host == null) throw new Error(`${source} does not exist as a source`);
      return await Promise.allSettled(
        value.map((link, i) =>
          limit(async () => {
            host.proxy = env().PROXY_URL;
            const data = await host.getMeta({ link });
            const _id = `${slugify(source)}/${slugify(data.title)}`;

            for (let i = 0; i < data.chapters.length; i++) {
              bulkWriteOperationSourceChapter.push({
                updateOne: {
                  filter: { _id: data.chapters[i].link },
                  update: {
                    _mangaId: data.link,
                    language:
                      (data.chapters[i] as MangaMultilingualChapter).language ??
                      'en',
                  },
                  upsert: true,
                },
              });
            }

            bulkWriteOperationSourceManga.push({
              updateOne: {
                upsert: true,
                filter: { _id },
                update: [
                  {
                    $set: {
                      _id,
                      title: data.title,
                      imageCover: data.imageCover,
                      link,
                      source: data.source,
                    },
                  },
                ],
              },
            });
            bulkWriteOperationUserManga.push({
              updateMany: {
                filter: { link: link },
                update: [
                  {
                    $set: {
                      title: data.title,
                      imageCover: data.imageCover,
                      source: data.source,
                    },
                  },
                ],
              },
            });
            return data;
          }),
        ),
      );
    }),
  );
  const errors: string[] = [];
  const mangaResults = [];
  for (const source of result) {
    switch (source.status) {
      case 'fulfilled':
        for (const mangas of source.value) {
          switch (mangas.status) {
            case 'rejected':
              errors.push(getErrorMessage(mangas.reason));
              break;
            case 'fulfilled':
              mangaResults.push({
                imageCover: mangas.value.imageCover,
                title: mangas.value.title,
                link: mangas.value.link,
                source: mangas.value.source,
              } as Manga);
              break;
          }
        }
        break;
      case 'rejected':
        errors.push(source.reason);
        break;
    }
  }
  await Promise.all([
    SourceChapter.bulkWrite(bulkWriteOperationSourceChapter),
    SourceManga.bulkWrite(bulkWriteOperationSourceManga),
    UserManga.bulkWrite(bulkWriteOperationUserManga),
  ]);
  res.json(mangaResults);
};

export default Handler.builder()
  .middleware(state)
  .middleware(mongodb())
  .route('POST', post)
  .route('PATCH', patch)
  .build();
