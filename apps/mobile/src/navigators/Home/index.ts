import { HomeTabParamList } from '@navigators/Home/Home.interfaces';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export const HomeTabNavigator = createBottomTabNavigator<HomeTabParamList>();
