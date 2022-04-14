import MangaHost from '@services/scraper/scraper.abstract';
import { Manga, MangaChapter, MangaMeta } from '@services/scraper/scraper.interfaces';

const MANGASEE_URL = 'https://mangasee123.com/';

class MangaSee extends MangaHost {
  public constructor(link: string) {
    super(link);
  }

  public listMangas(): Promise<Manga[] | null> {
    return super.route('/');
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
