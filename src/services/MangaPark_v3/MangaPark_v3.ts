import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';
import { MangaParkV3Filter, MANGAPARKV3_INFO } from './MangaPark_v3.constants';

class MangaParkV3 extends MangaHostWithFilters<MangaParkV3Filter> {
  public getPages(chapter: MangaChapter): Promise<string[]> {
    return Promise.resolve([]);
  }
  public search(query: string, filters?: MangaParkV3Filter): Promise<any> {
    return Promise.resolve([]);
  }
  public getMeta(manga: Manga): Promise<any> {
    return Promise.resolve({});
  }
}

export default new MangaParkV3(MANGAPARKV3_INFO);
