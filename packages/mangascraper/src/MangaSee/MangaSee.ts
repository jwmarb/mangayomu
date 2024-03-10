import {
  extractDataFromApplicationLDJson,
  parseMangaSeeDate,
  processScript,
} from './MangaSee.utils';
import {
  CurChapter,
  Directory,
  HotUpdateJSON,
  LatestJSON,
  MainEntityJSON,
  MangaSeeChapterJSON,
} from './MangaSee.interfaces';
import MangaSource from '../scraper/scraper';
import { Manga, MangaChapter } from '../scraper/scraper.interfaces';
import { MANGASEE_INFO, MangaSeeFilter } from './MangaSee.constants';
import { AscendingStringComparator, add, binary } from '@mangayomu/algorithms';

type TMangaMeta = MainEntityJSON & {
  link: string;
  chapters: MangaSeeChapterJSON[];
  description: string;
  imageCover?: string;
  yearReleased: string;
  scanStatus: string;
  publishStatus: string;
  IndexName: string;
  type: string;
};

type TManga = LatestJSON | HotUpdateJSON | Directory;
type TChapter = MangaSeeChapterJSON;

class MangaSee extends MangaSource<
  TManga,
  TMangaMeta,
  TChapter,
  MangaSeeFilter
> {
  private imageURLBase: string | null = null;
  private html: string | null = null;
  private _directory: Directory[] | null = null;

  // Taken directly from https://mangasee123.com
  private ChapterDisplay = function (e: string) {
    const t = parseInt(e.slice(1, -1));
    const n = e[e.length - 1];
    return '0' === n ? t : t + '.' + n;
  };

  // Taken directly from https://mangasee123.com
  private ChapterURLEncode: (e: string) => string = function (ChapterString) {
    let Index = '';
    const IndexString = ChapterString.substring(0, 1);
    if (IndexString !== '1') {
      Index = '-index-' + IndexString;
    }

    const Chapter = parseInt(ChapterString.slice(1, -1));

    let Odd = '';
    const OddString = ChapterString[ChapterString.length - 1];
    if (OddString !== '0') {
      Odd = '.' + OddString;
    }

    return '-chapter-' + Chapter + Odd + Index;
  };

  // Taken directly from https://mangasee123.com
  private PageImage = function (PageString: number) {
    const s = '000' + PageString;
    return s.substring(s.length - 3);
  };

  // Taken directly from https://mangasee123.com
  private ChapterImage = function (ChapterString: string) {
    const Chapter = ChapterString.slice(1, -1);
    const Odd = ChapterString[ChapterString.length - 1];
    if (Odd === '0') {
      return Chapter;
    } else {
      return Chapter + '.' + Odd;
    }
  };

  private async directory() {
    if (this._directory != null) return this._directory;

    const $ = await super.route('/search');
    const html = $('body').html();
    const { variable } = processScript(html);
    this._directory = await variable<Directory[]>('vm.Directory');
    return this._directory;
  }
  private getImageCover(indexName: string) {
    if (this.imageURLBase == null) {
      if (this.html == null)
        throw Error('HTML cannot be null to get image cover');
      const linkURL = this.html.match(/https:\/\/.*\/{{Result.i}}.jpg/g);
      if (linkURL == null) throw Error('Image URL base is null');
      this.imageURLBase = linkURL[0];
    }

    return this.imageURLBase.replace(/{{Result\.i}}/g, indexName);
  }

  public async latest(signal?: AbortSignal) {
    const $ = await super.route('/', signal);
    const html = $('body').html();
    this.html = html;
    const { variable } = processScript(html);
    const LatestJSON = await variable<LatestJSON[]>('vm.LatestJSON');
    return LatestJSON;
  }
  public async trending(signal?: AbortSignal | undefined) {
    const $ = await super.route('/', signal);
    const html = $('body').html();
    this.html = html;
    const { variable } = processScript(html);
    const HotUpdateJSON = await variable<LatestJSON[]>('vm.HotUpdateJSON');
    return HotUpdateJSON;
  }
  public toManga(tmanga: TManga): Manga {
    if (typeof tmanga !== 'object' || tmanga == null)
      throw new Error('Invalid `toManga` argument');

    if (
      'IndexName' in tmanga &&
      typeof tmanga.IndexName === 'string' &&
      'SeriesName' in tmanga &&
      typeof tmanga.SeriesName === 'string'
    ) {
      return {
        link: `https://${this.URL.hostname}/manga/${tmanga.IndexName}`,
        title: tmanga.SeriesName,
        imageCover: this.getImageCover(tmanga.IndexName),
        source: this.NAME,
        language: this.DEFAULT_LANGUAGE,
      };
    }

    if (
      's' in tmanga &&
      typeof tmanga.s === 'string' &&
      'i' in tmanga &&
      typeof tmanga.i === 'string' &&
      'a' in tmanga &&
      Array.isArray(tmanga.a)
    ) {
      return {
        link: `https://${this.URL.hostname}/manga/${tmanga.i}`,
        title: tmanga.s,
        imageCover: this.getImageCover(tmanga.i),
        source: this.NAME,
        language: this.DEFAULT_LANGUAGE,
      };
    }

    throw new Error('Invalid `toManga` argument');
  }
  public toChapter(tchapter: TChapter, tmangameta: TMangaMeta): MangaChapter {
    return {
      date: parseMangaSeeDate(tchapter.Date),
      name: `${
        tchapter.Type != '' ? tchapter.Type : 'Chapter'
      } ${this.ChapterDisplay(tchapter.Chapter)}`,
      link: `https://${this.URL.host}/read-online/${
        tmangameta.IndexName
      }${this.ChapterURLEncode(tchapter.Chapter)}`,
      index: 0,
    };
  }
  public async search(
    query: string,
    signal?: AbortSignal | undefined,
    filters?: MangaSeeFilter,
  ): Promise<TManga[]> {
    const directory = await this.directory();
    const sanitizedTitle = query.trim().toLowerCase();
    if (filters != null) {
      const withIncludingGenre = (manga: Directory) => {
        if (filters.Genres == null || filters.Genres.include.length === 0)
          return true;
        for (let i = 0; i < filters.Genres.include.length; i++) {
          if (
            binary.search(
              manga.g,
              filters.Genres.include[i],
              AscendingStringComparator,
            ) !== -1
          )
            return true;
        }
        return false;
      };
      const withExcludingGenre = (manga: Directory) => {
        if (filters.Genres == null) return true;
        for (let i = 0; i < filters.Genres.exclude.length; i++) {
          if (
            binary.search(
              manga.g,
              filters.Genres.exclude[i],
              AscendingStringComparator,
            ) !== -1
          )
            return false;
        }
        return true;
      };

      const withScanStatus = (manga: Directory) => {
        if (
          filters['Scan Status'] == null ||
          filters['Scan Status'].value === 'Any'
        )
          return true;
        return filters['Scan Status'].value === manga.ss;
      };

      const withPublishStatus = (manga: Directory) => {
        if (
          filters['Publish Status'] == null ||
          filters['Publish Status'].value === 'Any'
        )
          return true;
        return filters['Publish Status'].value === manga.ps;
      };

      const withOfficialTranslation = (manga: Directory) => {
        if (filters['Official Translation'] == null) return true;
        if (filters['Official Translation'].value == 'Any') return true;
        return manga.o === 'yes';
      };

      const createSort = (
        compareFn: (a: Directory, b: Directory) => number,
      ) => {
        if (filters['Sort By'] != null && filters['Sort By'].reversed)
          return (a: Directory, b: Directory) => -compareFn(a, b);
        return compareFn;
      };

      const sortBy = (function () {
        if (filters['Sort By'] == null) return undefined;
        switch (filters['Sort By'].value) {
          case 'Alphabetical':
            return createSort((a, b) => a.s.localeCompare(b.s));
          case 'Year Released':
            return createSort((a, b) => parseInt(b.y) - parseInt(a.y));
          case 'Popularity (All Time)':
            return createSort((a, b) => parseInt(b.v) - parseInt(a.v));
          case 'Popularity (Monthly)':
            return createSort((a, b) => parseInt(b.vm) - parseInt(a.vm));
          case 'Recently Released Chapter':
            return createSort((a, b) => b.lt - a.lt);
        }
      })();
      const filtered: Directory[] = [];

      for (let i = 0; i < directory.length; i++) {
        if (
          withOfficialTranslation(directory[i]) &&
          withPublishStatus(directory[i]) &&
          withScanStatus(directory[i]) &&
          withIncludingGenre(directory[i]) &&
          withExcludingGenre(directory[i]) &&
          directory[i].s.trim().toLowerCase().includes(sanitizedTitle)
        ) {
          if (sortBy == null) filtered.push(directory[i]);
          else add(filtered, directory[i], sortBy);
        }
      }
      return filtered;
    }

    const filtered: TManga[] = [];
    for (let i = 0; i < directory.length; i++) {
      if (directory[i].s.trim().toLowerCase().includes(sanitizedTitle))
        filtered.push(directory[i]);
    }
    return filtered;
  }
  public async pages(
    payload: Pick<MangaChapter, 'link'>,
    signal?: AbortSignal | undefined,
  ): Promise<string[]> {
    const $ = await super.route(payload, signal);
    const html = $.html();
    const { variable } = processScript(html);
    const CurChapter = await variable<CurChapter>('vm.CurChapter');
    const IndexName = await variable<string>('vm.IndexName');
    const CurPathName = await variable<string>('vm.CurPathName');
    const numOfPages = parseInt(CurChapter.Page);

    const pages: string[] = [];

    for (let i = 1; i <= numOfPages; i++) {
      pages.push(
        `https://${CurPathName}/manga/${IndexName}/${
          CurChapter.Directory === '' ? '' : `${CurChapter.Directory}/`
        }${this.ChapterImage(CurChapter.Chapter)}-${this.PageImage(i)}.png`,
      );
    }

    return pages;
  }

  public async meta(payload: Pick<Manga, 'link'>, signal?: AbortSignal) {
    const $ = await super.route(payload, signal);

    const html = $.html();
    const { variable } = processScript(html);
    const Chapters = await variable<MangaSeeChapterJSON[]>('vm.Chapters');
    const IndexName = await variable<string>('vm.IndexName');
    const description = $('span.mlabel').siblings('div.Content').text();
    const yearReleased = $('a[href*="/search/?year="]').text();
    const [scanStatus, publishStatus] = $('a[href*="/search/?status="]')
      .map((_, el) => $(el).text())
      .get();
    const type = $('a[href*="/search/?type="]').text();
    const imageCover = $('img.img-fluid.bottom-5').attr('src');
    const data = await extractDataFromApplicationLDJson<TMangaMeta>(html);

    data.link = payload.link;
    data.chapters = Chapters;
    data.IndexName = IndexName;
    data.description = description;
    data.yearReleased = yearReleased;
    data.scanStatus = scanStatus;
    data.publishStatus = publishStatus;
    data.imageCover = imageCover;
    data.type = type;
    return data;
  }

  public toMangaMeta(tmangameta: TMangaMeta) {
    return {
      title: tmangameta.mainEntity.name,
      altTitles: tmangameta.mainEntity.alternateName,
      authors: tmangameta.mainEntity.author,
      date: {
        modified: tmangameta.mainEntity.dateModified,
        published: tmangameta.mainEntity.datePublished,
      },
      genres: tmangameta.mainEntity.genre,
      source: this.NAME,
      link: tmangameta.link,
      chapters: tmangameta.chapters,
      description: tmangameta.description,
      imageCover: tmangameta.imageCover,
      yearReleased: tmangameta.yearReleased,
      status: {
        scan: tmangameta.scanStatus
          .toLowerCase()
          .substring(0, tmangameta.scanStatus.indexOf(' ')),
        publish: tmangameta.publishStatus
          .toLowerCase()
          .substring(0, tmangameta.publishStatus.indexOf(' ')),
      },
    };
  }
}

export default new MangaSee(MANGASEE_INFO);
