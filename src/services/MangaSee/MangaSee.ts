import { FullDirectory, HotUpdateJSON, LatestJSON } from '@services/MangaSee/MangaSee.interfaces';
import { processScript } from '@services/MangaSee/MangaSee.utils';
import MangaHost from '@services/scraper/scraper.abstract';
import { Manga, MangaChapter, MangaMeta } from '@services/scraper/scraper.interfaces';

const MANGASEE_URL = 'https://mangasee123.com/';

class MangaSee extends MangaHost {
  public constructor(link: string) {
    super(link);
  }

  public async listRecentlyUpdatedManga(): Promise<Manga[] | null> {
    const $ = await super.route('/');
    const html = $('body').html();
    const { variable, fn } = processScript(html);
    const ChapterURLEncode = fn<(indexName: string) => string>('vm.ChapterURLEncode');
    const LatestJSON = variable<LatestJSON[]>('vm.LatestJSON');

    return Promise.resolve<Manga[]>(
      LatestJSON.map((x) => ({
        link: `https://${super.getLink()}/read-online/${x.IndexName}${ChapterURLEncode(x.Chapter)}`,
        title: x.SeriesName,
        imageCover: `https://cover.nep.li/cover/${x.IndexName}.jpg`,
      }))
    );
  }

  public async listHotMangas(): Promise<Manga[] | null> {
    const $ = await super.route('/');
    const html = $('body').html();
    const { variable, fn } = processScript(html);
    const ChapterURLEncode = fn<(indexName: string) => string>('vm.ChapterURLEncode');
    const HotUpdateJSON = variable<HotUpdateJSON[]>('vm.HotUpdateJSON');
    return Promise.resolve<Manga[]>(
      HotUpdateJSON.map((x) => ({
        link: `https://${super.getLink()}/read-online/${x.IndexName}${ChapterURLEncode(x.Chapter)}`,
        title: x.SeriesName,
        imageCover: `https://cover.nep.li/cover/${x.IndexName}.jpg`,
      }))
    );
  }

  public async listMangas(): Promise<Manga[] | null> {
    const $ = await super.route('/directory');
    const html = $('body').html();
    const { variable } = processScript(html);
    const FullDirectory = variable<FullDirectory>('vm.FullDirectory');
    return Promise.resolve<Manga[]>(
      FullDirectory.Directory.map((x) => ({
        title: x.s,
        link: `https://${super.getLink()}/manga/${x.i}`,
        imageCover: `https://cover.nep.li/cover/${x.i}.jpg`,
      }))
    );
  }

  getMeta(manga: Manga) {
    return Promise.resolve({} as any);
  }

  getPages(chapter: MangaChapter) {
    return Promise.resolve([]);
  }

  public search<T extends Record<string, unknown>, R extends Manga>(query: string, filters: T): Promise<R[]> {
    return Promise.resolve([]);
  }
}

export default new MangaSee(MANGASEE_URL);
