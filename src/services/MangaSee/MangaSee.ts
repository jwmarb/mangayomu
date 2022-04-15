import { MANGASEE_URL, MANGASEE_GENRES } from '@services/MangaSee/MangaSee.constants';
import {
  Directory,
  HotUpdateJSON,
  LatestJSON,
  MangaSeeFilter,
  MangaSeeManga,
} from '@services/MangaSee/MangaSee.interfaces';
import { processScript } from '@services/MangaSee/MangaSee.utils';
import { MangaHostWithFilters, MangaSortType } from '@services/scraper/scraper.filters';
import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';
import titleIncludes from '@utils/MangaFilters';

class MangaSee extends MangaHostWithFilters<MangaSeeFilter> {
  public constructor() {
    super('MangaSee', MANGASEE_URL, MANGASEE_GENRES);
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

  public async listMangas(): Promise<MangaSeeManga[]> {
    const $ = await super.route('/search');
    const html = $('body').html();
    const { variable } = processScript(html);
    const Directory = variable<Directory[]>('vm.Directory');
    return Promise.resolve<MangaSeeManga[]>(
      Directory.map((x) => ({
        title: x.s,
        link: `https://${super.getLink()}/manga/${x.i}`,
        imageCover: `https://cover.nep.li/cover/${x.i}.jpg`,
        status: {
          scan: x.ss,
          publish: x.ps,
        },
        isHentai: x.h,
        type: x.t,
        genres: x.g,
        yearReleased: x.y,
      }))
    );
  }

  getMeta(manga: Manga) {
    return Promise.resolve({} as any);
  }

  getPages(chapter: MangaChapter) {
    return Promise.resolve([]);
  }

  public async search(query: string, filters?: MangaSeeFilter): Promise<MangaSeeManga[]> {
    const directory = await this.listMangas();
    const filtered = directory.filter(titleIncludes(query));

    return filtered;
  }
}

export default new MangaSee();
