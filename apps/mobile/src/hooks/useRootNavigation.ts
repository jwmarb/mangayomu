import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const useRootNavigation = () =>
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();

export default useRootNavigation;
