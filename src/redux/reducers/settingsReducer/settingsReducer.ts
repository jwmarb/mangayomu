import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';

const INITIAL_STATE: SettingsReducerState = {
  showIntroduction: true,
};

const reducer = (state: SettingsReducerState = INITIAL_STATE, action: SettingsReducerAction): SettingsReducerState => {
  switch (action.type) {
    case 'INTRO_DONE':
      return {
        ...state,
        showIntroduction: false,
      };
    default:
      return state;
  }
};

export default reducer;
