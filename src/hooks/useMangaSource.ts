import { AppState } from '@redux/store';
import MangaHost from '@services/scraper/scraper.abstract';
import { useSelector } from 'react-redux';

/**
 * Use the selected manga source
 * @returns Returns the current selected manga source
 */

export default function useMangaSource(src?: string) {
  if (src == null) {
    const name = useSelector((state: AppState) => (state.settings.selectedSource as any).name);
    return MangaHost.availableSources.get(name)!;
    /**
     * This can never return undefined because  all classes extending MangaHost will require a name
     * Additionally, when MangaHost constructor is called, it will append the manga host name anyways
     */
  }
  return MangaHost.availableSources.get(src)!;
}
