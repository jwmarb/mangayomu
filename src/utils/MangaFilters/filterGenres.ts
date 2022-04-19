import { Manga, WithGenres, WithGenresFilter } from '@services/scraper/scraper.interfaces';
import { binary, StringComparator } from '@utils/Algorithms';

export default function filterGenres(mangas: (Manga & WithGenres)[], obj: WithGenresFilter) {
  const { include, exclude } = obj.genres;
  return mangas.filter(
    (manga) =>
      !manga.genres.some((genre) => exclude.some((exclusive) => exclusive === genre)) &&
      manga.genres.some((genre) => include.some((inclusive) => inclusive === genre))
  );
}
