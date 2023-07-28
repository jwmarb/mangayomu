import { Manga, MangaHost } from '@mangayomu/mangascraper';
import { Handler, ResponseError, Route } from '@mangayomu/request-handler';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import puppeteer from 'puppeteer';

const post: Route = async (req, res) => {
  const manga = req.body<Manga>();
  const client = await puppeteer.launch({ headless: false });
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
  await page.goto(manga.link, { waitUntil: 'domcontentloaded' });

  await page.addScriptTag({
    path: path.resolve(
      '..',
      '..',
      'packages',
      'mangascraper',
      'bundle',
      'index.bundle.js',
    ),
  });

  const data = await page.evaluate((t) => {
    console.log(window.MangaHost);
    return 0;
  }, MangaHost);

  const meta = await host.getMeta(manga);
  await wait(async () => {
    await client.close();
  }, 10000);
  res.json(meta);
};

const wait = (fn: () => void, ms: number) =>
  new Promise<void>((res) => {
    setTimeout(() => {
      fn();
      res();
    }, ms);
  });

export default Handler.builder().route('POST', post).build();
