import { Manga, MangaHost } from '@mangayomu/mangascraper';
import { Handler, ResponseError, Route } from '@mangayomu/request-handler';
import { StatusCodes } from 'http-status-codes';

const post: Route = async (req, res) => {
  const manga = req.body<Manga>();
  const host = MangaHost.sourcesMap.get(manga.source);
  if (host == null)
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json(
        ResponseError.from(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `${host} does not exist as a source`,
        ),
      );
  const meta = await host.getMeta(manga);
  res.json(meta);
};

export default Handler.builder().route('POST', post).build();
