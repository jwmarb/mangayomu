import { Manga, MangaHost } from '@mangayomu/mangascraper';
import { Handler, ResponseError, Route } from '@mangayomu/request-handler';
import { StatusCodes } from 'http-status-codes';
import { launchPuppeteer } from '@mangayomu/puppeteer';
import { getErrorMessage } from '@main';

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
  try {
    const data = await host.getMeta(manga);
    res.json(data);
  } catch (e) {
    console.error(
      `Failed using fetch implementation. Got error: ${getErrorMessage(e)}`,
    );
    const client = await launchPuppeteer();
    const pages = await client.pages();
    const page = pages[0];
    await page.exposeFunction('x', () => {
      return host.getMeta(manga);
    });

    await page.goto(`https://${host.link}/dsa98e87213u21uyh7uyh3yhu`, {
      waitUntil: 'domcontentloaded',
    });

    const data = await page.evaluate(() => {
      return (
        window as typeof window & {
          x: () => Promise<ReturnType<MangaHost['getMeta']>>;
        }
      ).x();
    });
    await client.close();

    res.json(data);
  }
};

export default Handler.builder().route('POST', post).build();
