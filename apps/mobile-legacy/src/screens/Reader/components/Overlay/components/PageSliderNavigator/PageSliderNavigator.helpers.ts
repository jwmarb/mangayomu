import { AppState } from '@redux/main';

export function shouldHidePageNavigator(state: AppState) {
  return (
    state.reader.pages.length === 0 ||
    (state.reader.pages.length === 1 &&
      state.reader.pages[0].type === 'CHAPTER_ERROR')
  );
}
