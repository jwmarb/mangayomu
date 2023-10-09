import { MANGASEE_INFO, MangaSeeFilter } from './MangaSee.constants';
import {
  CurChapter,
  Directory,
  HotUpdateJSON,
  LatestJSON,
  MainEntityJSON,
  MangaSeeChapterJSON,
  MangaSeeManga,
  MangaSeeMangaMeta,
} from './MangaSee.interfaces';
import {
  extractDataFromApplicationLDJson,
  parseMangaSeeDate,
  processScript,
} from './MangaSee.utils';
import { MangaHostWithFilters } from '../scraper/scraper.filters';
import { Manga, MangaChapter } from '../scraper/scraper.interfaces';
import { binary, StringComparator } from '@mangayomu/algorithms';
import { titleIncludes } from '../filter';
import { sortChapters } from '../scraper/scraper.helpers';

class MangaSee extends MangaHostWithFilters<MangaSeeFilter> {
  private memoizedDir: MangaSeeManga[] | null = null;
  private imageURLBase: string | null = null;
  private getImageCover(html: string | null, indexName: string) {
    if (this.imageURLBase == null) {
      if (html == null) throw Error('HTML cannot be null to get image cover');
      const linkURL = html.match(/https:\/\/.*\/{{Result.i}}.jpg/g);
      if (linkURL == null) throw Error('Image URL base is null');
      this.imageURLBase = linkURL[0];
    }

    return this.imageURLBase.replace(/{{Result\.i}}/g, indexName);
  }
  public async listRecentlyUpdatedManga(): Promise<Manga[]> {
    const $ = await super.route('/');
    const html = $('body').html();
    const { variable, fn } = processScript(html);
    const LatestJSON = await variable<LatestJSON[]>('vm.LatestJSON');

    return Promise.resolve<Manga[]>(
      LatestJSON.map((x, i) => ({
        link: `https://${super.getLink()}/manga/${x.IndexName}`,
        title: x.SeriesName,
        imageCover: this.getImageCover(html, x.IndexName),
        source: this.name,
      })),
    );
  }

  public async listHotMangas(): Promise<Manga[]> {
    const $ = await super.route('/');
    const html = $('body').html();
    const { variable } = processScript(html);
    const HotUpdateJSON = await variable<HotUpdateJSON[]>('vm.HotUpdateJSON');
    return Promise.resolve<Manga[]>(
      HotUpdateJSON.map((x, i) => ({
        link: `https://${super.getLink()}/manga/${x.IndexName}`,
        title: x.SeriesName,
        imageCover: this.getImageCover(html, x.IndexName),
        source: this.name,
      })),
    );
  }

  public async listMangas(): Promise<MangaSeeManga[]> {
    if (this.memoizedDir == null) {
      const $ = await super.route('/search');
      const html = $('body').html();
      const { variable } = processScript(html);
      const Directory = await variable<Directory[]>('vm.Directory');
      const result = Directory.map((x, i) => ({
        title: x.s,
        link: `https://${super.getLink()}/manga/${x.i}`,
        imageCover: this.getImageCover(html, x.i),
        status: {
          scan: x.ss,
          publish: x.ps,
        },
        isHentai: x.h,
        type: x.t,
        genres: x.g,
        yearReleased: x.y,
        source: this.name,
        officialTranslation: x.o === 'yes' ? true : false,
        altTitles: x.al,
        lt: parseInt(x.lt),
        v: parseInt(x.v),
        vm: parseInt(x.vm),
      }));
      return result;
    }
    return this.memoizedDir;
  }

  public async getMeta(
    manga: Pick<Manga, 'link'> | { html: string; link: string },
  ): Promise<MangaSeeMangaMeta & Manga> {
    const $ = await super.route(manga);

    const html = $.html();

    const { mainEntity: data } =
      await extractDataFromApplicationLDJson<MainEntityJSON>(html);
    const { variable, fn } = processScript(html);
    const Chapters = await variable<MangaSeeChapterJSON[]>('vm.Chapters');
    const ChapterDisplay = await fn<(e: string) => string>('vm.ChapterDisplay');

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
    const IndexName = await variable<string>('vm.IndexName');
    const description = $('span.mlabel').siblings('div.Content').text();
    const yearReleased = $('a[href*="/search/?year="]').text();
    const [scanStatus, publishStatus] = $('a[href*="/search/?status="]')
      .map((_, el) => $(el).text())
      .get();
    const type = $('a[href*="/search/?type="]').text();
    const imageCover = $('img.img-fluid.bottom-5').attr('src')!;
    const chapters = Chapters.map((chapter, index) => ({
      date: parseMangaSeeDate(chapter.Date),
      name: `${chapter.Type != '' ? chapter.Type : 'Chapter'} ${ChapterDisplay(
        chapter.Chapter,
      )}`,
      link: `https://${super.getLink()}/read-online/${IndexName}${ChapterURLEncode(
        chapter.Chapter,
      )}`,
      index,
    })) as MangaChapter[];
    sortChapters(chapters);

    return {
      source: this.name,
      title: data.name,
      link: manga.link,
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
      chapters,
      imageCover,
    };
  }

  async getPages(chapter: Pick<MangaChapter, 'link'>) {
    const $ = await super.route(chapter);
    const html = $.html();
    const { variable } = processScript(html);
    const CurChapter = await variable<CurChapter>('vm.CurChapter');
    const IndexName = await variable<string>('vm.IndexName');
    const CurPathName = await variable<string>('vm.CurPathName');
    const numOfPages = parseInt(CurChapter.Page);
    const PageImage = function (PageString: number) {
      const s = '000' + PageString;
      return s.substring(s.length - 3);
    };
    const ChapterImage = function (ChapterString: string) {
      const Chapter = ChapterString.slice(1, -1);
      const Odd = ChapterString[ChapterString.length - 1];
      if (Odd === '0') {
        return Chapter;
      } else {
        return Chapter + '.' + Odd;
      }
    };
    const pages: string[] = [];

    for (let i = 1; i <= numOfPages; i++) {
      pages.push(
        `https://${CurPathName}/manga/${IndexName}/${
          CurChapter.Directory === '' ? '' : `${CurChapter.Directory}/`
        }${ChapterImage(CurChapter.Chapter)}-${PageImage(i)}.png`,
      );
    }

    return Promise.resolve(pages);
  }

  public async search(
    query: string,
    filters?: MangaSeeFilter,
  ): Promise<MangaSeeManga[]> {
    const directory = await this.listMangas();
    const withTitle = titleIncludes(query);

    if (filters) {
      const withIncludingGenre = (manga: MangaSeeManga) => {
        if (filters.Genres == null || filters.Genres.include.length === 0)
          return true;
        for (let i = 0; i < filters.Genres.include.length; i++) {
          if (
            binary.search(
              manga.genres,
              filters.Genres.include[i],
              StringComparator,
            ) !== -1
          )
            return true;
        }
        return false;
      };
      const withExcludingGenre = (manga: MangaSeeManga) => {
        if (filters.Genres == null) return true;
        for (let i = 0; i < filters.Genres.exclude.length; i++) {
          if (
            binary.search(
              manga.genres,
              filters.Genres.exclude[i],
              StringComparator,
            ) !== -1
          )
            return false;
        }
        return true;
      };

      const withScanStatus = (manga: MangaSeeManga) => {
        if (
          filters['Scan Status'] == null ||
          filters['Scan Status'].value === 'Any'
        )
          return true;
        return filters['Scan Status'].value === manga.status.scan;
      };

      const withPublishStatus = (manga: MangaSeeManga) => {
        if (
          filters['Publish Status'] == null ||
          filters['Publish Status'].value === 'Any'
        )
          return true;
        return filters['Publish Status'].value === manga.status.publish;
      };

      const withOfficialTranslation = (manga: MangaSeeManga) => {
        if (filters['Official Translation'] == null) return true;
        if (filters['Official Translation'].value == 'Any') return true;
        return manga.officialTranslation;
      };

      const filtered = directory.filter(
        (manga) =>
          withOfficialTranslation(manga) &&
          withPublishStatus(manga) &&
          withScanStatus(manga) &&
          withIncludingGenre(manga) &&
          withExcludingGenre(manga) &&
          withTitle(manga),
      );

      const createSort = (
        compareFn: (a: MangaSeeManga, b: MangaSeeManga) => number,
      ) => {
        if (filters['Sort By'] != null && filters['Sort By'].reversed)
          return (a: MangaSeeManga, b: MangaSeeManga) => -compareFn(a, b);
        return compareFn;
      };

      const getSort = () => {
        if (filters['Sort By'] == null) return undefined;
        switch (filters['Sort By'].value) {
          case 'Alphabetical':
            return createSort((a: MangaSeeManga, b: MangaSeeManga) =>
              a.title.localeCompare(b.title),
            );
          case 'Year Released':
            return createSort(
              (a: MangaSeeManga, b: MangaSeeManga) =>
                parseInt(b.yearReleased) - parseInt(a.yearReleased),
            );
          case 'Popularity (All Time)':
            return createSort(
              (a: MangaSeeManga, b: MangaSeeManga) => b.v - a.v,
            );
          case 'Popularity (Monthly)':
            return createSort(
              (a: MangaSeeManga, b: MangaSeeManga) => b.vm - a.vm,
            );
          case 'Recently Released Chapter':
            return createSort(
              (a: MangaSeeManga, b: MangaSeeManga) => b.lt - a.lt,
            );
        }
      };

      return filtered.sort(getSort());
    }
    const filtered = directory.filter(withTitle);
    return filtered;
  }
}

export default new MangaSee(MANGASEE_INFO);
