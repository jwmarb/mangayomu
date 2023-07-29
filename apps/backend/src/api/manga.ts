import { Manga, MangaHost } from '@mangayomu/mangascraper';
import { Handler, ResponseError, Route } from '@mangayomu/request-handler';
import { StatusCodes } from 'http-status-codes';
import puppeteer from 'puppeteer';

const post: Route = async (req, res) => {
  const manga = req.body<Manga>();
  const client = await puppeteer.launch({ headless: 'new' });
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
  const pages = await client.pages();
  const page = pages[0];
  await page.exposeFunction('x', () => {
    return host.getMeta(manga);
  });

  await page.goto(manga.link, { waitUntil: 'domcontentloaded' });

  const data = await page.evaluate(() => {
    return (
      window as typeof window & {
        x: () => Promise<ReturnType<MangaHost['getMeta']>>;
      }
    ).x();
  });

  res.json(data);
};

export default Handler.builder().route('POST', post).build();
