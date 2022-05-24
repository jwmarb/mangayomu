import { AppDispatch } from '@redux/store';
import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';

export const checkAll = (val: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SELECT', checked: val });
  };
};

export const exitSelectionMode = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'EXIT_SELECTION_MODE' });
  };
};

export const enterSelectionMode = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'ENTER_SELECTION_MODE' });
  };
};
