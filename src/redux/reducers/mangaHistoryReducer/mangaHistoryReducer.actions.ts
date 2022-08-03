import { MangaHistoryObject } from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer.interfaces';
import { AppDispatch } from '@redux/store';

export const removeFromHistory = (sectionListDataIndex: number, itemToRemove: MangaHistoryObject) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'REMOVE_FROM_HISTORY', sectionListDataIndex, itemToRemove });
  };
};
