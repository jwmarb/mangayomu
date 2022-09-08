import {
  MangaMeta,
  MangaMultilingualChapter,
  WithAuthors,
  WithGenres,
  WithRating,
  WithStatus,
} from '@services/scraper/scraper.interfaces';

export type MangaParkV3MangaMeta = MangaMeta<MangaMultilingualChapter> &
  WithGenres &
  WithStatus &
  WithRating &
  WithAuthors;

export type MangaParkV3HotMangas = {
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

export type MangaParkV3NextData = {
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
                  text: string;
                };
                stat_score_bay: number;
                stat_count_vote: number;
              };
            };
          };
        }[];
      };
    };
  };
};
