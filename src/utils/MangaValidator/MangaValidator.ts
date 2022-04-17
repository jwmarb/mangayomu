import {
  Manga,
  WithAuthors,
  WithDate,
  WithGenres,
  WithHentai,
  WithStatus,
  WithType,
  WithYearReleased,
} from '@services/scraper/scraper.interfaces';
import { ADULT_GENRES } from '@utils/MangaValidator/MangaValidator.constants';

class MangaValidator {
  public hasDate(manga: any): manga is WithDate {
    return 'date' in manga;
  }
  /**
   * Check if there are 18+ genres
   * @param genres The genres of the manga
   * @returns Returns whether or not the manga is NSFW
   */
  public isNSFW(genres: string[]): boolean {
    /**
     * This for loop has a time complexity of O(N^2)
     * This should be _good_ enough for small arrays
     */
    for (let i = 0; i < genres.length; i++) {
      for (let x = 0; x < ADULT_GENRES.length; x++) {
        if (genres[i].toLowerCase() === ADULT_GENRES[x].toLowerCase()) return true;
      }
    }
    return false;
  }
  public hasAuthors(manga: any): manga is WithAuthors {
    return 'authors' in manga;
  }
  public hasGenres(manga: any): manga is WithGenres {
    return 'genres' in manga;
  }

  public isManga(obj: any): obj is Manga {
    return 'title' in obj && 'imageCover' in obj && 'link' in obj;
  }

  public hasHentai(manga: any): manga is WithHentai {
    return 'isHentai' in manga;
  }

  public hasType(manga: any): manga is WithType {
    return 'type' in manga;
  }

  public hasStatus(manga: any): manga is WithStatus {
    return 'status' in manga;
  }

  public hasYearReleased(manga: any): manga is WithYearReleased {
    return 'yearReleased' in manga;
  }
}

export default new MangaValidator();
