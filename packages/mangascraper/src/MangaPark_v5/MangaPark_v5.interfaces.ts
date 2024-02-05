import {
  Manga,
  MangaChapter,
  MangaMeta,
  WithAuthors,
  WithGenres,
  WithRating,
  WithStatus,
} from '../scraper/scraper.interfaces';

export type MangaParkV5MangaMeta = Manga &
  MangaMeta<MangaChapter> &
  WithGenres &
  WithStatus &
  WithRating &
  WithAuthors;

export type MangaParkV5SearchManga = {
  data: {
    get_searchComic: {
      items: {
        data: {
          name: string;
          urlPath: string;
          urlCoverOri: string;
          tranLang: string;
        };
      }[];
    };
  };
};

export type MangaParkV5HotMangas = {
  data: {
    get_latestReleases: {
      items: {
        data: {
          name: string;
          urlPath: string;
          urlCoverOri: string;
          tranLang: string;
        };
      }[];
    };
  };
};

export type MangaParkV5GetChapterNode = {
  data: {
    get_chapterNode: {
      data: {
        imageFile: {
          urlList: string[];
        };
      };
    };
  };
};

export type MangaParkV5GetComicRangeList = {
  data: {
    get_comicChapterList: {
      data: {
        dname: string;
        urlPath: string;
        dateCreate: number;
        title: string | null;
      };
    }[];
    get_comicNode: {
      data: {
        urlCoverOri: string;
        urlPath: string;
        name: string;
        genres: string[];
        authors: string[];
        score_bay: number;
        summary: string;
        uploadStatus: string;
        votes: number;
        originalStatus: string;
        tranLang: string;
      };
    };
  };
};
