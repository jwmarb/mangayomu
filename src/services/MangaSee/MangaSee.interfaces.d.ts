export interface FullDirectory {
  AllGenres: string[];
  Directory: {
    /**
     * Short for genres. Number corresponds with key
     */
    g: number[];

    /**
     * same as IndexName
     */
    i: string;

    /**
     * same as Series
     */
    s: string;

    /**
     * manga status
     */
    st: string;
  }[];
}

export interface TopTenJSON {
  IndexName: string;
  SeriesName: string;
}

export interface HotUpdateJSON {
  Chapter: string;
  Date: string;
  IndexName: string;
  IsEdd: boolean;
  SeriesID: string;
  SeriesName: string;
}

export interface LatestJSON {
  Chapter: string;
  Date: string;
  Genres: string;
  IndexName: string;
  IsEdd: boolean;
  ScanStatus: string;
  SeriesID: string;
  SeriesName: string;
}

export interface NewSeriesJSON {
  IndexName: string;
  SeriesName: string;
}
