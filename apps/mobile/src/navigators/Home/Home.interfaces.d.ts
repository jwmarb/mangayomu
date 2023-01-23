import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type HomeTabParamList = {
  Explore: undefined;
  Library: undefined;
  History: undefined;
  Settings: undefined;
};

export type HomeTabProps<T extends keyof HomeTabParamList> =
  BottomTabScreenProps<HomeTabParamList, T>;