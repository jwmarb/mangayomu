import { BottomTabNavigationOptions, BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { BottomTabDescriptor } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';

export interface TabProps {
  tabBarIcon: unknown;
  routeName: string;
  routeKey: string;
  isFocused: boolean;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}
