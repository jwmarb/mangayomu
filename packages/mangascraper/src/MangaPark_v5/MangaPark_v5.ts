import { ISOLangCode } from '@mangayomu/language-codes';
import MangaSource from '../scraper/scraper';
import { Manga, MangaChapter } from '../scraper/scraper.interfaces';
import { MANGAPARKV5_INFO, MangaParkV5Filter } from './MangaPark_v5.constants';
import {
  MANGAPARK_LANG,
  OFFICIAL_WORK_STATUS,
  ORDER_BY,
  TYPE,
  VIEW_CHAPTERS,
} from './MangaPark_v5.helpers';
import {
  MangaParkV5GetChapterNode,
  MangaParkV5GetComicRangeList,
  MangaParkV5HotMangas,
  MangaParkV5SearchManga,
} from './MangaPark_v5.interfaces';

type TManga =
  MangaParkV5HotMangas['data']['get_latestReleases']['items'][number];

type TMangaMeta = MangaParkV5GetComicRangeList;

type TChapter =
  MangaParkV5GetComicRangeList['data']['get_comicChapterList'][number];

class MangaParkV5 extends MangaSource<
  TManga,
  TMangaMeta,
  TChapter,
  MangaParkV5Filter
> {
  private static API_ROUTE = 'https://mangapark.net/apo/';

  public async latest(signal?: AbortSignal | undefined): Promise<TManga[]> {
    const { data } = await super.route<MangaParkV5HotMangas>(
      { link: MangaParkV5.API_ROUTE },
      signal,
      'POST',
      {
        query:
          'query get_latestReleases($select: LatestReleases_Select) {\n  get_latestReleases(select: $select) {\n    items {\n      data {\n        name\n        tranLang\n        urlPath\n        urlCoverOri\n      }\n    }\n  }\n}',
        variables: {
          select: {
            where: 'popular',
            init: 0,
            size: 120,
            page: 1,
          },
        },
      },
      { proxyEnabled: false },
    );
    return data.get_latestReleases.items;
  }

  public async trending(signal?: AbortSignal | undefined): Promise<TManga[]> {
    const { data } = await super.route<MangaParkV5HotMangas>(
      { link: MangaParkV5.API_ROUTE },
      signal,
      'POST',
      {
        query:
          'query get_latestReleases($select: LatestReleases_Select) {\n  get_latestReleases(select: $select) {\n    items {\n      data {\n        name\n        tranLang\n        urlPath\n        urlCoverOri\n      }\n    }\n  }\n}',
        variables: {
          select: {
            where: 'release',
            init: 0,
            size: 120,
            page: 1,
          },
        },
      },
      { proxyEnabled: false },
    );
    return data.get_latestReleases.items;
  }

  public async pages(
    payload: Pick<MangaChapter, 'link'>,
    signal?: AbortSignal | undefined,
  ): Promise<string[]> {
    let chapterNodeId = payload.link.substring(
      payload.link.lastIndexOf('/') + 1,
    );
    chapterNodeId = chapterNodeId.substring(0, chapterNodeId.indexOf('-'));
    const pages = await super.route<MangaParkV5GetChapterNode>(
      { link: MangaParkV5.API_ROUTE },
      signal,
      'POST',
      {
        operationName: 'get_chapterNode',
        query:
          'query get_chapterNode($getChapterNodeId: ID!) {\n  get_chapterNode(id: $getChapterNodeId) {\n    data {\n      imageFile {\n        urlList\n      }\n    }\n  }\n}',
        variables: {
          getChapterNodeId: chapterNodeId,
        },
      },
      { proxyEnabled: false },
    );
    return pages.data.get_chapterNode.data.imageFile.urlList;
  }

  public async meta(
    payload: Pick<Manga, 'link'>,
    signal?: AbortSignal | undefined,
  ): Promise<MangaParkV5GetComicRangeList> {
    const comicId = parseInt(
      payload.link.substring(payload.link.lastIndexOf('/') + 1),
    );
    const meta = await super.route<MangaParkV5GetComicRangeList>(
      { link: MangaParkV5.API_ROUTE },
      signal,
      'POST',
      {
        query:
          'query Get_comicChapterList($comicId: ID!, $getComicNodeId: ID!) {\n  \n  get_comicChapterList(comicId: $comicId) {\n    data {\n      dname\n      urlPath\n      dateCreate\n      title\n    }\n  }\n  get_comicNode(id: $getComicNodeId) {\n    data {\n      authors\n      genres\n      name\n      originalStatus\n      score_bay\n      summary\n      uploadStatus\n      urlCoverOri\n      urlPath\n      votes\n      tranLang\n    }\n  }\n}',
        variables: {
          comicId,
          getComicNodeId: comicId,
        },
        operationName: 'Get_comicChapterList',
      },
    );

    return meta;
  }

  public async search(
    query: string,
    page: number,
    signal?: AbortSignal | undefined,
    filters?: MangaParkV5Filter,
  ): Promise<TManga[]> {
    if (filters) {
      const {
        data: {
          get_searchComic: { items },
        },
      } = await super.route<MangaParkV5SearchManga>(
        { link: MangaParkV5.API_ROUTE },
        signal,
        'POST',
        {
          operationName: 'get_searchComic',
          query:
            'query get_searchComic($select: SearchComic_Select) {\n  get_searchComic(select: $select) {\n    items {\n      data {\n        tranLang\n        name\n        urlCoverOri\n        urlPath\n      }\n    }\n  }\n}',
          variables: {
            select: {
              chapCount: VIEW_CHAPTERS[filters['Number of Chapters'].value],
              excGenres: filters.Genres.exclude.concat(
                filters.Type.exclude.map((x) => TYPE[x]),
              ),
              incGenres: filters.Genres.include.concat(
                filters.Type.include.map((x) => TYPE[x]),
              ),
              size: 120,
              origStatus:
                OFFICIAL_WORK_STATUS[filters['Original Work Status'].value],
              siteStatus:
                OFFICIAL_WORK_STATUS[filters['MangaPark Upload Status'].value],
              incOLangs: MANGAPARK_LANG[filters['Original Work Language'].value]
                ? [MANGAPARK_LANG[filters['Original Work Language'].value]]
                : [],
              incTLangs: MANGAPARK_LANG[
                filters['Translated Work Language'].value
              ]
                ? [MANGAPARK_LANG[filters['Original Work Language'].value]]
                : [],
              page,
              sortby: ORDER_BY[filters['Order by'].value],
              word: query,
            },
          },
        },
        { proxyEnabled: false },
      );
      return items;
    }
    const {
      data: {
        get_searchComic: { items },
      },
    } = await super.route<MangaParkV5SearchManga>(
      { link: MangaParkV5.API_ROUTE },
      signal,
      'POST',
      {
        operationName: 'get_searchComic',
        query:
          'query get_searchComic($select: SearchComic_Select) {\n  get_searchComic(select: $select) {\n    items {\n      data {\n        name\n        urlCoverOri\n        urlPath\n      }\n    }\n  }\n}',
        variables: {
          select: {
            page,
            size: 120,
            word: query,
          },
        },
      },
      { proxyEnabled: false },
    );
    return items;
  }

  public toChapter(tchapter: {
    data: {
      dname: string;
      urlPath: string;
      dateCreate: number;
      title: string | null;
    };
  }): MangaChapter {
    return {
      date: tchapter.data.dateCreate,
      link: `https://${this.URL.hostname}${tchapter.data.urlPath}`,
      name: tchapter.data.dname,
      subname: tchapter.data.title,
      index: 0,
    };
  }

  public toManga(tmanga: TManga): Manga {
    return {
      title: tmanga.data.name,
      language: tmanga.data.tranLang as ISOLangCode,
      link: `https://${this.URL.hostname}${tmanga.data.urlPath}`,
      source: this.NAME,
      imageCover: tmanga.data.urlCoverOri,
    };
  }

  public toMangaMeta(tmangameta: MangaParkV5GetComicRangeList) {
    return {
      title: tmangameta.data.get_comicNode.data.name,
      source: this.NAME,
      link: `https://${this.URL.hostname}${tmangameta.data.get_comicNode.data.urlPath}`,
      authors: tmangameta.data.get_comicNode.data.authors,
      description: tmangameta.data.get_comicNode.data.summary,
      genres: tmangameta.data.get_comicNode.data.genres,
      language: tmangameta.data.get_comicNode.data.tranLang as ISOLangCode,
      rating: {
        value: tmangameta.data.get_comicNode.data.score_bay,
        voteCount: tmangameta.data.get_comicNode.data.votes,
      },
      status: {
        publish: tmangameta.data.get_comicNode.data.originalStatus,
        scan: tmangameta.data.get_comicNode.data.uploadStatus,
      },
      chapters: tmangameta.data.get_comicChapterList,
      imageCover: tmangameta.data.get_comicNode.data.urlCoverOri,
    };
  }
}

export default new MangaParkV5({ ...MANGAPARKV5_INFO, name: 'MangaPark v5' });
