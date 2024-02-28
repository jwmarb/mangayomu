import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '@navigators/Home/Home.interfaces';

const useTabNavigation = () =>
  useNavigation<BottomTabNavigationProp<HomeTabParamList>>();

export default useTabNavigation;
