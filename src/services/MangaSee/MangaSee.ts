import { MANGASEE_INFO } from '@services/MangaSee/MangaSee.constants';
import {
  Directory,
  HotUpdateJSON,
  LatestJSON,
  MainEntityJSON,
  MangaSeeChapterJSON,
  MangaSeeFilter,
  MangaSeeManga,
  MangaSeeMangaMeta,
} from '@services/MangaSee/MangaSee.interfaces';
import { extractDataFromApplicationLDJson, parseMangaSeeDate, processScript } from '@services/MangaSee/MangaSee.utils';
import { MangaHostWithFilters, MangaSortType } from '@services/scraper/scraper.filters';
import { Manga, MangaChapter, MangaMeta } from '@services/scraper/scraper.interfaces';
import { binary, StringComparator } from '@utils/Algorithms';
import { titleIncludes } from '@utils/MangaFilters';
import { parse } from 'date-fns';

class MangaSee extends MangaHostWithFilters<MangaSeeFilter> {
  private memo: MangaSeeManga[] | null = null;
  public async listRecentlyUpdatedManga(): Promise<Manga[]> {
    const $ = await super.route('/');
    const html = $('body').html();
    const { variable, fn } = processScript(html);
    const LatestJSON = variable<LatestJSON[]>('vm.LatestJSON');

    return Promise.resolve<Manga[]>(
      LatestJSON.map((x) => ({
        link: `https://${super.getLink()}/manga/${x.IndexName}`,
        title: x.SeriesName,
        imageCover: `https://cover.nep.li/cover/${x.IndexName}.jpg`,
        source: super.getName(),
      }))
    );
  }

  public async listHotMangas(): Promise<Manga[]> {
    const $ = await super.route('/');
    const html = $('body').html();
    const { variable, fn } = processScript(html);
    const HotUpdateJSON = variable<HotUpdateJSON[]>('vm.HotUpdateJSON');
    return Promise.resolve<Manga[]>(
      HotUpdateJSON.map((x) => ({
        link: `https://${super.getLink()}/manga/${x.IndexName}`,
        title: x.SeriesName,
        imageCover: `https://cover.nep.li/cover/${x.IndexName}.jpg`,
        source: super.getName(),
      }))
    );
  }

  public async listMangas(): Promise<MangaSeeManga[]> {
    if (this.memo == null) {
      const $ = await super.route('/search');
      const html = $('body').html();
      const { variable } = processScript(html);
      const Directory = variable<Directory[]>('vm.Directory');
      const result = Directory.map((x) => ({
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
        source: super.getName(),
        officialTranslation: x.o === 'yes' ? true : false,
      }));
      this.memo = result;
      return result;
    }
    return this.memo;
  }

  public async getMeta(manga: Manga): Promise<MangaSeeMangaMeta> {
    const $ = await super.route({ url: manga.link });
    const html = $.html();
    const { mainEntity: data } = extractDataFromApplicationLDJson<MainEntityJSON>(html);
    const { variable, fn } = processScript(html);
    const Chapters = variable<MangaSeeChapterJSON[]>('vm.Chapters');
    const ChapterDisplay = fn<(e: string) => string>('vm.ChapterDisplay');

    /**
     * Taken directly from https://mangasee123.com
     */
    const ChapterURLEncode = new Function(`var v = function(ChapterString){
      Index = "";
      var IndexString = ChapterString.substring(0, 1);
      if(IndexString != 1){
        Index = "-index-"+IndexString;
      }

      var Chapter = parseInt(ChapterString.slice(1,-1));

      var Odd = "";
      var OddString = ChapterString[ChapterString.length -1];
      if(OddString != 0){
        Odd = "." + OddString;
      }
      
      return "-chapter-" + Chapter + Odd + Index;
    }; return v`)();
    const IndexName = variable<string>('vm.IndexName');
    const description = $('span.mlabel').siblings('div.Content').text();
    const yearReleased = $('a[href*="/search/?year="]').text();
    const [scanStatus, publishStatus] = $('a[href*="/search/?status="]')
      .map((_, el) => $(el).text())
      .get();
    const type = $('a[href*="/search/?type="]').text();

    return {
      authors: data.author,
      genres: data.genre,
      description,
      yearReleased,
      type,
      status: {
        scan: scanStatus,
        publish: publishStatus,
      },
      date: {
        modified: parseMangaSeeDate(data.dateModified),
        published: parseMangaSeeDate(data.datePublished),
      },
      chapters: Chapters.map((chapter, index) => ({
        date: parseMangaSeeDate(chapter.Date),
        name: `${chapter.Type != '' ? chapter.Type : 'Chapter'} ${ChapterDisplay(chapter.Chapter)}`,
        link: `https://${super.getLink()}/read-online/${IndexName}${ChapterURLEncode(chapter.Chapter)}`,
        index,
      })),
    };
  }

  getPages(chapter: MangaChapter) {
    return Promise.resolve([]);
  }

  public async search(query: string, filters?: MangaSeeFilter): Promise<MangaSeeManga[]> {
    const directory = await this.listMangas();
    const withTitle = titleIncludes(query);

    if (filters) {
      const withIncludingGenre = (manga: MangaSeeManga) => {
        for (let i = 0; i < filters.genres.include.length; i++) {
          if (binary.search(manga.genres, filters.genres.include[i], StringComparator) !== -1) return true;
        }
        return false;
      };
      const withExcludingGenre = (manga: MangaSeeManga) => {
        for (let i = 0; i < filters.genres.exclude.length; i++) {
          if (binary.search(manga.genres, filters.genres.exclude[i], StringComparator) !== -1) return false;
        }
        return true;
      };

      const withStatus = (manga: MangaSeeManga) => {
        if (filters.status) {
          return filters.status === manga.status.publish;
        }

        return true;
      };

      const withOfficialTranslation = (manga: MangaSeeManga) => {
        if (filters.officialTranslation == null) return true;
        return filters.officialTranslation === manga.officialTranslation;
      };

      const filtered = directory.filter(
        (manga) =>
          withIncludingGenre(manga) &&
          withExcludingGenre(manga) &&
          withTitle(manga) &&
          withStatus(manga) &&
          withOfficialTranslation(manga)
      );
      return filtered;
    }
    const filtered = directory.filter(withTitle);
    return filtered;
  }
}

export default new MangaSee(MANGASEE_INFO);
