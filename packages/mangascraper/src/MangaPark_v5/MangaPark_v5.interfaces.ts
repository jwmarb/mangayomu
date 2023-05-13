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
            imageCoverUrl: string;
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
                authors: string[];
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
