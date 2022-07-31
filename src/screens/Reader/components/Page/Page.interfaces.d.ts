import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';

export interface PageProps {
  uri: string;
  width: number;
  height: number;
  manga: Manga;
  chapter: MangaChapter;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  isOfFirstChapter?: boolean;
}

export type PagePanGestureContext = {
  translateX: number;
  translateY: number;
  calculatedWidth: number;
  calculatedHeight: number;
  shouldStopX: number;
  shouldStopY: number;
};

export type PagePinchGestureContext = {
  scale: number;
  startScale: number;
  beginningFocalX: number;
  beginningFocalY: number;
};

export type PanResponderContext = {
  zoomLastDistance: number;
  zoomCurrentDistance: number;
  startScale: number;
  translateX: number;
  translateY: number;
  calculatedWidth: number;
  calculatedHeight: number;
  shouldStopX: number;
  shouldStopY: number;
};
