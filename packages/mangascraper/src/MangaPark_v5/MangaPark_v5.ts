import {
  getV3URL,
  OFFICIAL_WORK_STATUS,
  ORDER_BY,
  MANGAPARK_LANG,
  TYPE,
  VIEW_CHAPTERS,
  compressURL,
} from './MangaPark_v5.helpers';
import {
  MangaParkV5GetChapterNode,
  MangaParkV5GetComicRangeList,
  MangaParkV5HotMangas,
  MangaParkV5MangaMeta,
  MangaParkV5SearchManga,
} from './MangaPark_v5.interfaces';
import { MangaHostWithFilters } from '../scraper/scraper.filters';
import { GetMeta, Manga, MangaChapter } from '../scraper/scraper.interfaces';
import { MangaParkV5Filter, MANGAPARKV5_INFO } from './MangaPark_v5.constants';
import { ISOLangCode } from '@mangayomu/language-codes';

class MangaParkV5 extends MangaHostWithFilters<MangaParkV5Filter> {
  private static API_ROUTE = 'https://mangapark.net/apo/';
  public async getPages(
    chapter: Pick<MangaChapter, 'link'>,
  ): Promise<string[]> {
    const chapterNodeId = chapter.link.substring(
      chapter.link.lastIndexOf('/') + 1,
    );
    const pages = await super.route<MangaParkV5GetChapterNode>(
      { link: MangaParkV5.API_ROUTE },
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
    // const $ = await super.route(chapter);
    // const { objs } = JSON.parse($('script[type="qwik/json"]').text());
    // const images: string[] = [];
    // for (let i = 0; i < objs.length; i++) {
    //   const val = objs[i];
    //   if (typeof val === 'string' && val.startsWith('https://'))
    //     images.push(val);
    // }
    // const lastImage = images[images.length - 1];
    // const eqPos = lastImage.lastIndexOf('=');
    // const imgExp = lastImage.substring(eqPos);
    // const newArray = [];
    // for (let i = 0; i < images.length; i++) {
    //   const exp = images[i].substring(
    //     eqPos + images[i].length - lastImage.length,
    //   );
    //   if (exp === imgExp) newArray.push(images[i]);
    // }
    // return newArray;
    return pages.data.get_chapterNode.data.imageFile.urlList;
  }
  public async listRecentlyUpdatedManga(): Promise<Manga[]> {
    const { data } = await super.route<MangaParkV5HotMangas>(
      { link: MangaParkV5.API_ROUTE },
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

    return data.get_latestReleases.items.map(
      ({ data }): Manga => ({
        imageCover: data.urlCoverOri,
        link: 'https://' + super.getLink() + getV3URL(data.urlPath),
        source: this.name,
        title: data.name,
        language: data.tranLang as ISOLangCode,
      }),
    );
  }
  public async listHotMangas(): Promise<Manga[]> {
    const { data } = await super.route<MangaParkV5HotMangas>(
      { link: MangaParkV5.API_ROUTE },
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

    return data.get_latestReleases.items.map(
      ({ data }): Manga => ({
        imageCover: data.urlCoverOri,
        link: 'https://' + super.getLink() + getV3URL(data.urlPath),
        source: this.name,
        title: data.name,
        language: data.tranLang as ISOLangCode,
      }),
    );
  }
  public async search(
    query: string,
    filters?: MangaParkV5Filter,
  ): Promise<Manga[]> {
    if (filters) {
      const {
        data: {
          get_searchComic: { items },
        },
      } = await super.route<MangaParkV5SearchManga>(
        { link: MangaParkV5.API_ROUTE },
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
              page: super.getPage(),
              sortby: ORDER_BY[filters['Order by'].value],
              word: query,
            },
          },
        },
        { proxyEnabled: false },
      );
      return items.map(
        ({ data }): Manga => ({
          imageCover: data.urlCoverOri,
          link: 'https://' + super.getLink() + getV3URL(data.urlPath),
          source: this.name,
          title: data.name,
          language: data.tranLang as ISOLangCode,
        }),
      );
    }
    const {
      data: {
        get_searchComic: { items },
      },
    } = await super.route<MangaParkV5SearchManga>(
      { link: MangaParkV5.API_ROUTE },
      'POST',
      {
        operationName: 'get_searchComic',
        query:
          'query get_searchComic($select: SearchComic_Select) {\n  get_searchComic(select: $select) {\n    items {\n      data {\n        name\n        urlCoverOri\n        urlPath\n      }\n    }\n  }\n}',
        variables: {
          select: {
            page: super.getPage(),
            size: 120,
            word: query,
          },
        },
      },
      { proxyEnabled: false },
    );
    return items.map(
      ({ data }): Manga => ({
        imageCover: data.urlCoverOri,
        link: 'https://' + super.getLink() + getV3URL(data.urlPath),
        source: this.name,
        title: data.name,
        language: data.tranLang as ISOLangCode,
      }),
    );
  }
  public async getMeta(manga: GetMeta): Promise<MangaParkV5MangaMeta & Manga> {
    const comicId = parseInt(
      manga.link.substring(manga.link.lastIndexOf('/') + 1),
    );
    const meta = await super.route<MangaParkV5GetComicRangeList>(
      { link: MangaParkV5.API_ROUTE },
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

    const chapters: MangaChapter[] = [];

    for (let i = meta.data.get_comicChapterList.length - 1; i >= 0; i--) {
      const ch = meta.data.get_comicChapterList[i];
      chapters.push({
        date: new Date(ch.data.dateCreate).toString(),
        index: meta.data.get_comicChapterList.length - 1 - i,
        link: compressURL('https://' + super.getLink() + ch.data.urlPath),
        name: ch.data.dname,
        subname: ch.data.title,
      });
    }

    return {
      title: meta.data.get_comicNode.data.name,
      source: this.name,
      link: manga.link,
      authors: meta.data.get_comicNode.data.authors,
      description: meta.data.get_comicNode.data.summary,
      genres: meta.data.get_comicNode.data.genres,
      language: meta.data.get_comicNode.data.tranLang as ISOLangCode,
      rating: {
        value: meta.data.get_comicNode.data.score_bay,
        voteCount: meta.data.get_comicNode.data.votes,
      },
      status: {
        publish: meta.data.get_comicNode.data.originalStatus,
        scan: meta.data.get_comicNode.data.uploadStatus,
      },
      chapters,
      imageCover: meta.data.get_comicNode.data.urlCoverOri,
    };
  }
}

export default new MangaParkV5(MANGAPARKV5_INFO);
