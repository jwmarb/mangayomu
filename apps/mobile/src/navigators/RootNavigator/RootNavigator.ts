import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootNavigator.interfaces';

const RootStack = createNativeStackNavigator<RootStackParamList>();
export default RootStack;
