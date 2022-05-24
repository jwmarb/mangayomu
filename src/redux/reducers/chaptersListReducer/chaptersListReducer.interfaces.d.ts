import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';

export interface ChaptersListReducerState {
  checkAll: boolean | null;
  mode: ChapterPressableMode;
}

export type ChaptersListReducerAction =
  | { type: 'SELECT'; checked: boolean | null }
  | { type: 'EXIT_SELECTION_MODE' }
  | { type: 'ENTER_SELECTION_MODE' };
