import { HomeTabParamList } from '@navigators/Home/Home.interfaces';
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
export interface TabProps {
  tabBarIcon: unknown;
  routeName: keyof HomeTabParamList;
  routeKey: string;
  isFocused: boolean;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}
