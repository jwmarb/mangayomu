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
  MangaParkV5NextDataMeta,
  MangaParkV5NextDataReader,
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
    const html = $('script#__NEXT_DATA__').html();
    if (html == null) throw Error('HTML is null');
    const meta: MangaParkV5NextDataReader = JSON.parse(html);
    const { httpLis, wordLis } =
      meta.props.pageProps.dehydratedState.queries[0].state.data.data.imageSet;
    const images: string[] = [];
    for (let i = 0; i < httpLis.length; i++) {
      images.push(httpLis[i] + '?' + wordLis[i]);
    }
    return images;
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
    const html = _$('script#__NEXT_DATA__').html();
    if (html == null) throw Error('Unknown page');
    const parsedData: MangaParkV5NextDataMeta = JSON.parse(html);
    const [data] = parsedData.props.pageProps.dehydratedState.queries;

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

    const genres = data.state.data.data.genres;

    const ratingValue = data.state.data.data.stat_score_bay;

    const authors = data.state.data.data.authors ?? [];

    const imageCover = data.state.data.data.urlCoverOri;

    const chapters = englishChapterObjects.concat(multilingualChapterObjects);

    return {
      title: data.state.data.data.name,
      source: this.name,
      link: manga.link,
      authors,
      description: data.state.data.data.summary.code,
      genres,
      rating: {
        value: ratingValue || 'N/A',
        voteCount: data.state.data.data.stat_count_vote,
      },
      status: {
        publish: `${
          data.state.data.data.originalStatus[0].toUpperCase() +
          data.state.data.data.originalStatus.substring(1)
        } (Status)`,
      },
      chapters,
      imageCover,
    };
  }
}

export default new MangaParkV5(MANGAPARKV5_INFO);
