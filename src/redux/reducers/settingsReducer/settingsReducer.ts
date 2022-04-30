import MangaSee from '@services/MangaSee';
import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';

const INITIAL_STATE: SettingsReducerState = {
  showIntroduction: true,
  selectedSource: MangaSee,
  mangaCover: {
    perColumn: 2,
  },
};

const reducer = (state: SettingsReducerState = INITIAL_STATE, action: SettingsReducerAction): SettingsReducerState => {
  switch (action.type) {
    case 'ADJUST_MANGAS_PER_COLUMN':
      return {
        ...state,
        mangaCover: {
          ...state.mangaCover,
          perColumn: action.payload,
        },
      };
    case 'INTRO_DONE':
      return {
        ...state,
        showIntroduction: false,
      };
    case 'SELECT_SOURCE':
      return {
        ...state,
        selectedSource: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
