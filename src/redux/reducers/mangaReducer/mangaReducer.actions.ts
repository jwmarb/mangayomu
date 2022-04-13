import { MangaMeta } from '@services/scraper/scraper.interfaces';
import { Dispatch } from 'redux';
import { MangaReducerAction } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';

export function viewManga(meta: MangaMeta) {
  return (dispatch: Dispatch<MangaReducerAction>) => {
    dispatch({ type: 'VIEW_MANGA', payload: meta });
  };
}
