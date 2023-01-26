import { MangaHost } from '@mangayomu/mangascraper';
import { AppState } from '@redux/main';

/**
 * Get the MangaHost from redux or not. Comes with safety from edge cases.
 * @param state The App state from redux
 * @param overrideSource Name of a different source. Use this parameter if the code does not need to use the user-defined selected source.
 * @returns
 */
export default function getMangaHost(state: AppState, overrideSource?: string) {
  const p = MangaHost.getAvailableSources();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (overrideSource != null) return p.get(overrideSource)!;
  if (state.host.name == null) return null;
  return p.get(state.host.name);
}
