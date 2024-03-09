// This is the root navigator for all screens
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
};

export type RootStackProps<K extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, K>;

export const RootStack = createNativeStackNavigator<RootStackParamList>();
