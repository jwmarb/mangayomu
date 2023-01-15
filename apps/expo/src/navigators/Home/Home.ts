import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from '@navigators/Home/Home.interfaces';

const HomeStack = createStackNavigator<HomeStackParamList>();

export default HomeStack;
