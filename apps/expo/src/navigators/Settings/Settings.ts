import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const SettingsStack = createStackNavigator<SettingsStackParamList>();
export const useSettingsNavigation = () => useNavigation<NavigationProp<SettingsStackParamList>>();

export default SettingsStack;
