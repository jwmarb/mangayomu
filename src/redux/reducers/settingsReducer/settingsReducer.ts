import MangaSee from '@services/MangaSee';
import { RFValue } from 'react-native-responsive-fontsize';
import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';

export enum ReaderBackgroundColor {
  GRAY = 'Gray',
  BLACK = 'Black',
  WHITE = 'White',
}

const INITIAL_STATE: SettingsReducerState = {
  showIntroduction: true,
  selectedSource: MangaSee,
  mangaCover: {
    perColumn: 2,
    fontSize: RFValue(13),
  },
  reader: {
    backgroundColor: ReaderBackgroundColor.BLACK,
    keepDeviceAwake: true,
    preferredReadingDirection: 'Left to right',
    showPageNumber: true,
    skipChaptersMarkedRead: true,
  },
};

const reducer = (state: SettingsReducerState = INITIAL_STATE, action: SettingsReducerAction): SettingsReducerState => {
  switch (action.type) {
    case 'CHANGE_BACKGROUND_COLOR':
      return {
        ...state,
        reader: {
          ...state.reader,
          backgroundColor: action.color,
        },
      };
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
