import { AppDispatch } from '@redux/store';
import { Manga } from '@services/scraper/scraper.interfaces';

export const addToLibrary = (mangaKey: string) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'ADD_TO_LIBRARY', payload: mangaKey });
  };
};

export const removeFromLibrary = (mangaKey: string) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'REMOVE_FROM_LIBRARY', payload: mangaKey });
  };
};
