import {
  MangaMeta,
  MangaMultilingualChapter,
  WithAuthors,
  WithGenres,
  WithRating,
  WithStatus,
} from '../scraper/scraper.interfaces';

export type MangaParkV5MangaMeta = MangaMeta<MangaMultilingualChapter> &
  WithGenres &
  WithStatus &
  WithRating &
  WithAuthors;

export type MangaParkV5SearchManga = {
  data: {
    get_content_browse_search: {
      items: {
        data: {
          name: string;
          urlPath: string;
          imageCoverUrl: string;
        };
      }[];
    };
  };
};

export type MangaParkV5HotMangas = {
  data: {
    get_content_browse_latest: {
      items: {
        comic: {
          data: {
            name: string;
            urlPath: string;
            urlCoverOri: string;
          };
        };
      }[];
    };
  };
};

export type MangaParkV5NextDataMeta = {
  props: {
    pageProps: {
      dehydratedState: {
        queries: {
          state: {
            data: {
              id: number;
              data: {
                authors: string[] | null;
                originalStatus: string;
                summary: {
                  code: string;
                };
                stat_score_bay: number;
                stat_count_vote: number;
                genres: string[];
                urlCoverOri: string;
                name: string;
              };
            };
          };
        }[];
      };
    };
  };
};

export type MangaParkV5NextDataReader = {
  props: {
    pageProps: {
      dehydratedState: {
        queries: {
          state: {
            data: {
              data: {
                imageSet: {
                  httpLis: string[];
                  wordLis: string[];
                };
              };
            };
          };
        }[];
      };
    };
  };
};

/**
 * For ENGLISH chapters only
 */
export type MangaParkV5GetComicRangeList = {
  data: {
    get_content_comicChapterRangeList: {
      items: {
        /**
         * Serial # of chapter matches with its index
         * Except it's in ascending order, where the last element is the earliest/oldest chapter
         * while index 0 is the latest/most recent chapter
         */
        serial: number;
        /**
         * Different chapter nodes correspond with a different source. Each chapter node will
         * always have at least one chapter node. A `chapterNode` holding more than one element
         * indicates that the chapter is held in different servers
         */
        chapterNodes: {
          id: number;
          data: {
            // Serial # of chapter
            serial: number;
            // Database name
            dname: string;
            title: string;
            // the slug to the chapter
            urlPath: string;
            lang: string;
            datePublic: number;
            // the name of the source serving this chapter (e.g. Duck)
            srcTitle: string;
          };
        }[];
      }[];

      /**
       * Indicates the range of the pagination (a.k.a # of chapters returned from query)
       */
      reqRange: { x: number; y: number };
      // The pagination to be used to get the chapters
      pager: null | { x: number; y: number }[];
    };
  };
};

/**
 * For MULTILINGUAL chapters only
 */
export type MangaParkV5GetComicChapters = {
  data: {
    get_content_comic_chapters: {
      serial: number;
      chapters: {
        lang: string;
        cids: number[];
      }[];
    }[];
  };
};

export type MangaParkV5GetContentChapterList = {
  data: {
    get_content_chapter_list: {
      id: number;
      data: {
        datePublic: number;
        lang: string;
        serial: number;
        dname: string;
        title: string;
        urlPath: string;
      };
    }[];
  };
};
