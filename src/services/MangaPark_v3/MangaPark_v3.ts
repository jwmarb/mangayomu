import { digitsOnly, extractChapterTitle, parseTimestamp } from '@services/MangaPark_v3/MangaPark_v3.helpers';
import { MangaParkV3MangaMeta } from '@services/MangaPark_v3/MangaPark_v3.interfaces';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import { Manga, MangaChapter, MangaMultilingualChapter } from '@services/scraper/scraper.interfaces';
import { binary } from '@utils/Algorithms';
import { Cheerio, Element } from 'cheerio';
import { sub } from 'date-fns';
import { MangaParkV3Filter, MANGAPARKV3_INFO } from './MangaPark_v3.constants';

class MangaParkV3 extends MangaHostWithFilters<MangaParkV3Filter> {
  public getPages(chapter: MangaChapter): Promise<string[]> {
    return Promise.resolve([]);
  }
  public async search(query: string, filters?: MangaParkV3Filter): Promise<Manga[]> {
    const $ = await super.route(`/search?word=${encodeURIComponent(query)}&page=${super.getPage()}`);
    const listElements = $('div#search-list').children();
    return listElements
      .map((_, el) => {
        return {
          link: `https://${super.getLink()}${$(el).find('a').attr('href')!}`,
          imageCover: $(el).find('img').attr('src')!,
          source: super.getName(),
          title: $(el).children('div').children('a').text().trim(),
        } as Manga;
      })
      .get();
  }
  public async getMeta(manga: Manga): Promise<MangaParkV3MangaMeta> {
    const $ = await super.route({ url: manga.link });
    const englishChapters = $('div#chap-index').find('div.episode-serial').parent().children('div.episode-item');
    const englishChapterTitles = englishChapters
      .map((_, el) => extractChapterTitle($(el).find('span.d-md-none').parent().text()))
      .get();
    const englishChapterPaths = englishChapters.map((_, el) => $(el).find('a').attr('href')).get();
    const englishChapterDates = englishChapters.find('i.text-nowrap').map((_, el) => {
      const txt = $(el).text();
      return parseTimestamp(txt);
    });
    const englishChapterObjects: MangaMultilingualChapter[] = englishChapterPaths.map(
      (x, i) =>
        ({
          link: 'https://' + super.getLink() + x,
          name: englishChapterTitles[i],
          index: i,
          date: englishChapterDates[i],
          language: 'en',
        } as MangaMultilingualChapter)
    );

    let memoized: Record<string, string> = {};

    const multilingualChapterObjects: MangaMultilingualChapter[] = $(
      'div.episode-list > div.scrollable-panel > div#chap-index > div.episode-number'
    )
      .parent()
      .children('div.episode-item')
      .find('div.flex-fill > div > div > a[href^="/comic/"]')
      .map((i, el) => {
        const href = $(el).attr('href')!;
        const chapterTitle = extractChapterTitle($(el).text());
        const isoCode = href.substring(href.lastIndexOf('-') + 1, href.lastIndexOf('-') + 3);
        const date = (() => {
          if (memoized[chapterTitle] == null) {
            const t = parseTimestamp(
              $(el).parent().parent().parent().siblings('div.flex-nowrap').children('i.text-nowrap').text()
            );
            memoized[chapterTitle] = t;
            return t;
          }
          return memoized[chapterTitle];
        })();
        return {
          name: chapterTitle,
          language: isoCode,
          date,
          link: 'https://' + super.getLink() + href,
        } as MangaMultilingualChapter;
      })
      .get();

    console.log(memoized);

    const genres = $('b.text-muted:contains("Genres:")')
      .siblings('span')
      .text()
      .trim()
      .split(/\n\s+,\s+/);

    const ratingValue = parseFloat($('div.rating-display > div > b').text());

    return {
      description:
        $('div#limit-height-body-descr')
          .children('div.limit-html')
          .html()
          ?.replace(/<br[^>]*>/gi, '\n') ?? 'This manga has no description.',
      genres,
      rating: {
        value: !Number.isNaN(ratingValue) ? ratingValue : 'N/A',
        voteCount: parseInt(
          $('div.rating-display > div > div > div.rate-star').siblings('small').text().replace(/\D/g, '')
        ),
      },
      status: {
        publish: $('b.text-muted:contains("Official status:")').siblings().text(),
      },
      chapters: [...englishChapterObjects, ...multilingualChapterObjects],
    };
  }
}

export default new MangaParkV3(MANGAPARKV3_INFO);
