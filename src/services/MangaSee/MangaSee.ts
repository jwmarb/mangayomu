import MangaHost from '@services/scraper/scraper.abstract';

const MANGASEE_URL = 'https://mangasee123.com/';

class MangaSee extends MangaHost {}

export default new MangaSee(MANGASEE_URL);
