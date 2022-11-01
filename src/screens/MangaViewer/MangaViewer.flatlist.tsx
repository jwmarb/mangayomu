import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';

export const keyExtractor = (item: ReadingChapterInfo & { manga: Manga }, index: number) => item.link + index;
