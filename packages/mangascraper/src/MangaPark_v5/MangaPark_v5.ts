import {
  digitsOnly,
  extractChapterTitle,
  GENRES,
  getV3URL,
  getV5URL,
  OFFICIAL_WORK_STATUS,
  ORDER_BY,
  ORIGINAL_WORK_LANGUAGE,
  parseTimestamp,
  TYPE,
  VIEW_CHAPTERS,
} from './MangaPark_v5.helpers';
import {
  MangaParkV5HotMangas,
  MangaParkV5MangaMeta,
  MangaParkV5NextDataMeta,
  MangaParkV5NextDataReader,
  MangaParkV5SearchManga,
} from './MangaPark_v5.interfaces';
import { MangaHostWithFilters } from '../scraper/scraper.filters';
import {
  Manga,
  MangaChapter,
  MangaMultilingualChapter,
} from '../scraper/scraper.interfaces';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import { MangaParkV5Filter, MANGAPARKV5_INFO } from './MangaPark_v5.constants';

class MangaParkV5 extends MangaHostWithFilters<MangaParkV5Filter> {
  private static API_ROUTE = 'https://mangapark.net/apo/';
  public async getPages(chapter: MangaChapter): Promise<string[]> {
    const _$ = await super.route({ url: chapter.link });
    const $ = await super.route(
      _$('a.btn.btn-outline-info.btn-block').attr('href')!,
    );
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
      { url: MangaParkV5.API_ROUTE },
      'POST',
      {
        query:
          'query get_content_browse_latest($select: ComicLatestSelect) {\n  get_content_browse_latest(select: $select) {\n    items {\n      comic {\n        data {\n          name\n          urlPath\n          imageCoverUrl\n        }\n      }\n    }\n  }\n}\n',
        variables: {
          select: {
            where: 'release',
            limit: 100,
          },
        },
        operationName: 'get_content_browse_latest',
      },
    );

    return data.get_content_browse_latest.items.map(
      ({ comic: { data } }): Manga => ({
        imageCover: data.imageCoverUrl,
        link: 'https://' + super.getLink() + getV3URL(data.urlPath),
        source: this.name,
        title: data.name,
      }),
    );
  }
  public async listHotMangas(): Promise<Manga[]> {
    const { data } = await super.route<MangaParkV5HotMangas>(
      { url: MangaParkV5.API_ROUTE },
      'POST',
      {
        query:
          'query get_content_browse_latest($select: ComicLatestSelect) {\n  get_content_browse_latest(select: $select) {\n    items {\n      comic {\n        data {\n          name\n          urlPath\n          imageCoverUrl\n        }\n      }\n    }\n  }\n}\n',
        variables: {
          select: {
            where: 'popular',
            limit: 100,
          },
        },
        operationName: 'get_content_browse_latest',
      },
    );

    return data.get_content_browse_latest.items.map(
      ({ comic: { data } }, index): Manga => ({
        imageCover: data.imageCoverUrl,
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
        { url: MangaParkV5.API_ROUTE },
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
      { url: MangaParkV5.API_ROUTE },
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
  public async getMeta(manga: Manga): Promise<MangaParkV5MangaMeta & Manga> {
    const $ = await super.route({ url: manga.link });
    const _$ = await super.route({ url: getV5URL(manga.link) });
    const html = _$('script#__NEXT_DATA__').html();
    if (html == null) throw Error('Unknown page');
    const parsedData: MangaParkV5NextDataMeta = JSON.parse(html);
    const [data] = parsedData.props.pageProps.dehydratedState.queries;

    const englishChapters = $('div.d-flex.mt-5:contains("English Chapters")')
      .next()
      .find('div.episode-item');

    const englishChapterAnchorElements = englishChapters
      .find('div.d-flex.align-items-center > a.ms-3.visited[href^="/comic/"]')
      .map((_, el) => ({
        name: extractChapterTitle($(el).text()),
        link: 'https://' + super.getLink() + $(el).attr('href'),
      }))
      .get();

    const englishChapterDates = englishChapters
      .find('i.text-nowrap')
      .map((_, el) => {
        const txt = $(el).text();
        return parseTimestamp(txt);
      });

    const englishChapterObjects: MangaMultilingualChapter[] =
      englishChapterAnchorElements.map(
        ({ link, name }, i) =>
          ({
            link,
            name,
            index: i,
            date: englishChapterDates[i],
            language: 'en',
          } as MangaMultilingualChapter),
      );

    const multilingualEpisodeItemElements = $(
      'div.align-items-center.d-flex.mt-5.justify-content-between:contains("Multilingual Chapters")',
    )
      .next()
      .find('div.scrollable-panel > div#chap-index > div.episode-item');

    const multilingualChapterTitles = multilingualEpisodeItemElements
      .find('div.align-items-center.d-flex:not(.flex-nowrap) > a')
      .map((_, el) => extractChapterTitle($(el).text()))
      .get();

    const multilingualChapterDates = multilingualEpisodeItemElements
      .find('div.flex-nowrap > i.text-nowrap')
      .map((_, el) => parseTimestamp($(el).text()))
      .get();

    const referenceMultilingualChapter: Record<
      string,
      { title: string; dateUpdated: string }
    > = multilingualChapterTitles.reduce((prev, curr, i) => {
      const chapterNum = curr.substring(curr.lastIndexOf(' ') + 1);
      return {
        ...prev,
        [chapterNum]: {
          title: curr,
          dateUpdated: multilingualChapterDates[i],
        },
      };
    }, {});

    const multilingualChapterObjects: MangaMultilingualChapter[] =
      multilingualEpisodeItemElements
        .find('div.d-flex.flex-fill[style="height: 24px;"] > div > div > a')
        .map((i, el) => {
          const href: string = $(el).attr('href')!;
          const { title, dateUpdated } =
            referenceMultilingualChapter[
              digitsOnly(
                href.substring(
                  href.lastIndexOf('/') + 1,
                  href.lastIndexOf('-'),
                ),
              )
            ];
          const isoCode = href.substring(
            href.lastIndexOf('-') + 1,
            href.lastIndexOf('-') + 3,
          );
          return {
            index: i,
            name: `${title} (${languages[isoCode as ISOLangCode].name})`,
            language: isoCode,
            date: dateUpdated,
            link: 'https://' + super.getLink() + href,
          } as MangaMultilingualChapter;
        })
        .get();

    const genres = data.state.data.data.genres;

    const ratingValue = data.state.data.data.stat_score_bay;

    const authors = data.state.data.data.authors;

    const imageCover = data.state.data.data.urlCoverOri;

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
      chapters: [...englishChapterObjects, ...multilingualChapterObjects],
      imageCover,
    };
  }
}

export default new MangaParkV5(MANGAPARKV5_INFO);
