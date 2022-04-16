import { AppState } from '@redux/store';
import MangaHost from '@services/scraper/scraper.abstract';
import { useSelector } from 'react-redux';

export { default as MangaSee } from '../MangaSee';

/**
 * Use the selected manga source
 * @returns Returns the current selected manga source
 */
export function useMangaSource() {
  const name = useSelector((state: AppState) => state.settings.selectedSource.name);
  return MangaHost.availableSources.get(name)!;
  /**
   * This can never return undefined because  all classes extending MangaHost will require a name
   * Additionally, when MangaHost constructor is called, it will append the manga host name anyways
   */
}
