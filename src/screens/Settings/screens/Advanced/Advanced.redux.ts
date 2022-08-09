import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import { toggleAdvancedSetting } from '@redux/reducers/settingsReducer';
import { simulateNewChapters } from '@redux/reducers/mangaReducer';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';
import { StackScreenProps } from '@react-navigation/stack';

const mapStateToProps = (state: AppState, props: StackScreenProps<SettingsStackParamList, 'Advanced'>) => ({
  ...props,
  useRecyclerListView: state.settings.advanced.useRecyclerListView,
  debugging: state.settings.advanced.enableDebugging,
});

const connector = connect(mapStateToProps, { toggleAdvancedSetting, simulateNewChapters });

export type ConnectedAdvancedProps = ConnectedProps<typeof connector>;

export default connector;
