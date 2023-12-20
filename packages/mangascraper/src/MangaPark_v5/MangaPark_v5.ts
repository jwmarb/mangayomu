import {
  getV3URL,
  getV5URL,
  mapMultilingualQueryResponse,
  mapMultilingualQueryResponseFallback,
  mapQueryResponse,
  mapQueryResponseFallback,
  OFFICIAL_WORK_STATUS,
  ORDER_BY,
  ORIGINAL_WORK_LANGUAGE,
  TYPE,
  VIEW_CHAPTERS,
} from './MangaPark_v5.helpers';
import {
  MangaParkV5GetComicChapters,
  MangaParkV5GetComicRangeList,
  MangaParkV5GetContentChapterList,
  MangaParkV5HotMangas,
  MangaParkV5MangaMeta,
  MangaParkV5SearchManga,
} from './MangaPark_v5.interfaces';
import { MangaHostWithFilters } from '../scraper/scraper.filters';
import { GetMeta, Manga, MangaChapter } from '../scraper/scraper.interfaces';
import { MangaParkV5Filter, MANGAPARKV5_INFO } from './MangaPark_v5.constants';
import { createWorklet } from '../utils/worklets';

class MangaParkV5 extends MangaHostWithFilters<MangaParkV5Filter> {
  private static API_ROUTE = 'https://mangapark.net/apo/';
  public async getPages(
    chapter: Pick<MangaChapter, 'link'>,
  ): Promise<string[]> {
    const $ = await super.route(chapter);
    const { objs } = JSON.parse($('script[type="qwik/json"]').text());
    const images: string[] = [];
    for (let i = 0; i < objs.length; i++) {
      const val = objs[i];
      if (typeof val === 'string' && val.startsWith('https://'))
        images.push(val);
    }
    const lastImage = images[images.length - 1];
    const eqPos = lastImage.lastIndexOf('=');
    const imgExp = lastImage.substring(eqPos);
    const newArray = [];
    for (let i = 0; i < images.length; i++) {
      const exp = images[i].substring(
        eqPos + images[i].length - lastImage.length,
      );
      if (exp === imgExp) newArray.push(images[i]);
    }
    return newArray;
  }
  public async listRecentlyUpdatedManga(): Promise<Manga[]> {
    const { data } = await super.route<MangaParkV5HotMangas>(
      { link: MangaParkV5.API_ROUTE },
      'POST',
      {
        query:
          'query get_content_browse_latest($select: ComicLatestSelect) {\n  get_content_browse_latest(select: $select) {\n    items {\n      comic {\n        data {\n          name\n          urlPath\n          urlCoverOri\n        }\n      }\n    }\n  }\n}\n',
        variables: {
          select: {
            where: 'release',
            limit: 100,
          },
        },
        operationName: 'get_content_browse_latest',
      },
      { proxyEnabled: false },
    );

    return data.get_content_browse_latest.items.map(
      ({ comic: { data } }): Manga => ({
        imageCover: data.urlCoverOri,
        link: 'https://' + super.getLink() + getV3URL(data.urlPath),
        source: this.name,
        title: data.name,
      }),
    );
  }
  public async listHotMangas(): Promise<Manga[]> {
    const { data } = await super.route<MangaParkV5HotMangas>(
      { link: MangaParkV5.API_ROUTE },
      'POST',
      {
        query:
          'query get_content_browse_latest($select: ComicLatestSelect) {\n  get_content_browse_latest(select: $select) {\n    items {\n      comic {\n        data {\n          name\n          urlPath\n          urlCoverOri\n        }\n      }\n    }\n  }\n}\n',
        variables: {
          select: {
            where: 'popular',
            limit: 100,
          },
        },
        operationName: 'get_content_browse_latest',
      },
      { proxyEnabled: false },
    );

    return data.get_content_browse_latest.items.map(
      ({ comic: { data } }): Manga => ({
        imageCover: data.urlCoverOri,
        link: 'https://' + super.getLink() + getV3URL(data.urlPath),
        source: this.name,
        title: data.name,
      }),
    );
  }
  public async search(
    query: string,
    filters: MangaParkV5Filter,
  ): Promise<Manga[]> {
    if (filters) {
      const {
        data: {
          get_content_browse_search: { items },
        },
      } = await super.route<MangaParkV5SearchManga>(
        { link: MangaParkV5.API_ROUTE },
        'POST',
        {
          operationName: 'get_content_browse_search',
          query:
            'query get_content_browse_search($select: ComicSearchSelect) {\n  get_content_browse_search(select: $select) {\n    items {\n      data {\n        name\n        urlPath\n        imageCoverUrl\n      }\n    }\n  }\n}\n',
          variables: {
            select: {
              chapCount: VIEW_CHAPTERS[filters['Number of Chapters'].value],
              excGenres: filters.Genres.exclude.concat(
                filters.Type.exclude.map((x) => TYPE[x]),
              ),
              incGenres: filters.Genres.include.concat(
                filters.Type.include.map((x) => TYPE[x]),
              ),
              oficStatus:
                OFFICIAL_WORK_STATUS[filters['Original Work Status'].value],
              origLang:
                ORIGINAL_WORK_LANGUAGE[filters['Original Work Language'].value],
              page: super.getPage(),
              sort: ORDER_BY[filters['Order by'].value],
              word: query,
            },
          },
        },
        { proxyEnabled: false },
      );
      return items.map(
        ({ data }): Manga => ({
          imageCover: data.imageCoverUrl,
          link: 'https://' + super.getLink() + getV3URL(data.urlPath),
          source: this.name,
          title: data.name,
        }),
      );
    }
    const {
      data: {
        get_content_browse_search: { items },
      },
    } = await super.route<MangaParkV5SearchManga>(
      { link: MangaParkV5.API_ROUTE },
      'POST',
      {
        operationName: 'get_content_browse_search',
        query:
          'query get_content_browse_search($select: ComicSearchSelect) {\n  get_content_browse_search(select: $select) {\n    items {\n      data {\n        name\n        urlPath\n        imageCoverUrl\n      }\n    }\n  }\n}\n',
        variables: {
          select: {
            chapCount: null,
            excGenres: [],
            incGenres: [],
            oficStatus: null,
            origLang: null,
            page: super.getPage(),
            sort: null,
            word: query,
          },
        },
      },
      { proxyEnabled: false },
    );
    return items.map(
      ({ data }): Manga => ({
        imageCover: data.imageCoverUrl,
        link: 'https://' + super.getLink() + getV3URL(data.urlPath),
        source: this.name,
        title: data.name,
      }),
    );
  }
  public async getMeta(manga: GetMeta): Promise<MangaParkV5MangaMeta & Manga> {
    const comicId = parseInt(
      manga.link.substring(manga.link.lastIndexOf('/') + 1),
    );
    const [unparsedEnglishChapters, unparsedMultilingualChapters, _$] =
      await Promise.all([
        super.route<MangaParkV5GetComicRangeList>(
          { link: MangaParkV5.API_ROUTE },
          'POST',
          {
            operationName: 'get_content_comicChapterRangeList',
            query:
              'query get_content_comicChapterRangeList(\n  $select: Content_ComicChapterRangeList_Select\n) {\n  get_content_comicChapterRangeList(select: $select) {\n    reqRange {\n      x\n      y\n    }\n    missing\n    pager {\n      x\n      y\n    }\n    items {\n      serial\n      chapterNodes {\n        id\n        data {\n          serial\n          dname\n          title\n          urlPath\n          datePublic\n          lang\n          srcTitle\n        }\n\n      }\n    }\n  }\n}',
            variables: {
              select: {
                comicId,
                range: { x: Number.MAX_SAFE_INTEGER, y: 0 },
                isAsc: false,
              },
            },
          },
        ),
        super.route<MangaParkV5GetComicChapters>(
          { link: MangaParkV5.API_ROUTE },
          'POST',
          {
            operationName: 'get_content_comic_chapters',
            query:
              'query get_content_comic_chapters(\n  $comicId: Int!\n  $isPref: Boolean\n  $incLangs: [String]\n  $excLangs: [String]\n) {\n  get_content_comic_chapters(\n    comicId: $comicId\n    isPref: $isPref\n    incLangs: $incLangs\n    excLangs: $excLangs\n  ) {\n    serial\n    chapters {\n      lang\n      cids\n    }\n  }\n}',
            variables: {
              comicId,
              isPref: false,
            },
          },
        ),
        super.route({ link: getV5URL(manga.link) }),
      ]);
    const multilingualChapters =
      await super.route<MangaParkV5GetContentChapterList>(
        { link: MangaParkV5.API_ROUTE },
        'POST',
        {
          operationName: 'get_content_chapter_list',
          query:
            'query get_content_chapter_list($comicId: Int!, $chapterIds: [Int]) {\n  get_content_chapter_list(comicId: $comicId, chapterIds: $chapterIds) {\n    id\n    data {\n      datePublic\n      lang\n      serial\n      dname\n      title\n      urlPath\n    }\n  }\n}',
          variables: {
            comicId,
            chapterIds:
              unparsedMultilingualChapters.data.get_content_comic_chapters.flatMap(
                (x) => x.chapters.flatMap((x) => x.cids),
              ),
          },
        },
      );

    const [getEnglish, getMultilingual] = await Promise.all([
      createWorklet(mapQueryResponse, mapQueryResponseFallback),
      createWorklet(
        mapMultilingualQueryResponse,
        mapMultilingualQueryResponseFallback,
      ),
    ]);

    multilingualChapters.data.get_content_chapter_list.sort((a, b) => {
      if (a.data.lang === b.data.lang) return b.data.serial - a.data.serial;
      return a.data.lang.localeCompare(b.data.lang);
    });

    const [englishChapterObjects, multilingualChapterObjects] =
      await Promise.all([
        getEnglish(unparsedEnglishChapters, this.getLink()),
        getMultilingual(multilingualChapters, this.getLink()),
      ]);

    const genres = _$('div[q\\:key="30_2"] > span')
      .map((_, el) => _$(el).attr('q:key'))
      .toArray();

    const ratingEl = _$('div[q\\:key="VI_2"]');
    const ratingValueWidth = _$(ratingEl.children()[1]).attr('style');
    const ratingValue =
      ratingValueWidth != null
        ? parseFloat(
            ratingValueWidth.substring(
              ratingValueWidth.indexOf(':') + 1,
              ratingValueWidth.length - 1,
            ),
          ) / 10
        : null;
    const ratingCount = parseInt(ratingEl.next().text().split(' ')[0]);

    const titleEl = _$('div.space-y-2.hidden.md\\:block > h3');
    const title = titleEl.text();
    const authors = titleEl.siblings('div[q\\:key="tz_4"]').text().split(' / ');

    const imageCover = _$('img[q\\:key="q1_1"]').attr('src') ?? '';

    const description = _$('div.limit-html-p').text();

    const chapters = englishChapterObjects.concat(multilingualChapterObjects);

    const status = _$('span[q\\:key="Yn_5"]').text();

    return {
      title,
      source: this.name,
      link: manga.link,
      authors,
      description,
      genres,
      rating: {
        value: ratingValue || 'N/A',
        voteCount: ratingCount,
      },
      status: {
        publish: `${status} (Status)`,
      },
      chapters,
      imageCover,
    };
  }
}

export default new MangaParkV5(MANGAPARKV5_INFO);
