import {
  Manga,
  WithGenres,
  WithHentai,
  WithStatus,
  WithType,
  WithYearReleased,
} from '@services/scraper/scraper.interfaces';

class MangaValidator {
  public hasGenres(manga: any): manga is WithGenres {
    return 'genre' in manga;
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
