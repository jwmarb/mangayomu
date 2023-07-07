import NavTabs from './NavTabs';
export default NavTabs;
import { HomeTabParamList } from '@navigators/Home/Home.interfaces';
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
export interface TabProps {
  routeName: keyof HomeTabParamList;
  isFocused: boolean;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}
