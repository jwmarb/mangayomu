import MangaSee from '@services/MangaSee';
import { RFValue } from 'react-native-responsive-fontsize';
import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';

const INITIAL_STATE: SettingsReducerState = {
  showIntroduction: true,
  selectedSource: MangaSee,
  mangaCover: {
    perColumn: 2,
    fontSize: RFValue(13),
  },
};

const reducer = (state: SettingsReducerState = INITIAL_STATE, action: SettingsReducerAction): SettingsReducerState => {
  switch (action.type) {
    case 'ADJUST_MANGAS_TITLES_PER_COLUMN':
      return {
        ...state,
        mangaCover: {
          ...state.mangaCover,
          fontSize: action.payload,
        },
      };
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
