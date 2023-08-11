import {
  Manga,
  MangaChapter,
  MangaMeta,
  MangaMultilingualChapter,
} from '@mangayomu/mangascraper';
import { Handler, ResponseError, Route } from '@mangayomu/request-handler';
import { StatusCodes } from 'http-status-codes';
import {
  Manga as UserManga,
  SourceManga,
  mongodb,
  slugify,
  SourceChapter,
  state,
  getSourceChapterId,
  getSourceMangaId,
} from '@main';
import {
  IMangaSchema,
  ISourceChapterSchema,
  ISourceMangaSchema,
} from '@mangayomu/schemas';

const post: Route = async (req, res) => {
  const data = req.body<MangaMeta<MangaChapter> & Manga>();
  const doc = await SourceManga.findById(getSourceMangaId(data)).exec();

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
          description: data.description,
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
  const mangas = req.body<(MangaMeta<MangaChapter> & Manga)[]>();
  const sourceMangas = await SourceManga.find({
    link: {
      $in: mangas.map((x) => x.link),
    },
    title: {
      $in: mangas.map((x) => x.title),
    },
    source: {
      $in: mangas.map((x) => x.source),
    },
  }).exec();
  if (sourceMangas.length !== mangas.length)
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json(
        ResponseError.from(StatusCodes.UNPROCESSABLE_ENTITY, 'Illegal body'),
      );
  const bulkWriteOperationSourceManga: Parameters<
    typeof SourceManga.bulkWrite<ISourceMangaSchema>
  >[0] = [];
  const bulkWriteOperationUserManga: Parameters<
    typeof UserManga.bulkWrite<IMangaSchema>
  >[0] = [];
  const bulkWriteOperationSourceChapter: Parameters<
    typeof SourceChapter.bulkWrite<ISourceChapterSchema>
  >[0] = [];
  for (const manga of mangas) {
    const { link, source, title, chapters, imageCover, description } = manga;
    const _id = getSourceMangaId(manga);

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      bulkWriteOperationSourceChapter.push({
        updateOne: {
          filter: { _id: getSourceChapterId(manga, chapter) },
          update: {
            _mangaId: link,
            language:
              (chapters[i] as MangaMultilingualChapter).language ?? 'en',
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
              title,
              imageCover,
              link,
              source,
              description,
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
              title: title,
              imageCover: imageCover,
              source: source,
            },
          },
        ],
      },
    });
  }

  await Promise.all([
    SourceChapter.bulkWrite(bulkWriteOperationSourceChapter),
    SourceManga.bulkWrite(bulkWriteOperationSourceManga),
    UserManga.bulkWrite(bulkWriteOperationUserManga),
  ]);
  res.json('success');
};

export default Handler.builder()
  .middleware((req, res, next) =>
    req.method === 'POST' ? state(req, res, next) : next(),
  )
  .middleware(mongodb())
  .route('POST', post)
  .route('PATCH', patch)
  .build();
