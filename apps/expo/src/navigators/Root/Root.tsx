import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const RootStack = createStackNavigator<RootStackParamList>();

export const useRootNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();

export default RootStack;
