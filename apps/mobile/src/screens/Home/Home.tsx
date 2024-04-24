import React from 'react';
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Explore from '@/screens/Home/tabs/Explore';
import Sources from '@/screens/Home/tabs/Sources';
import BottomTab from '@/screens/Home/components/BottomTab';
import Browse from '@/screens/Home/tabs/Browse';
import Library from '@/screens/Home/tabs/Library';

export type HomeStackParamList = {
  Explore: undefined;
  Sources: undefined;
  Browse: undefined;
  Library: undefined;
};

export type HomeStackProps<K extends keyof HomeStackParamList> =
  BottomTabScreenProps<HomeStackParamList, K>;

const HomeStack = createBottomTabNavigator<HomeStackParamList>();

export default function Home() {
  return (
    <HomeStack.Navigator tabBar={BottomTab}>
      <HomeStack.Screen name="Explore" component={Explore} />
      <HomeStack.Screen name="Library" component={Library} />
      <HomeStack.Screen name="Browse" component={Browse} />
      <HomeStack.Screen name="Sources" component={Sources} />
    </HomeStack.Navigator>
  );
}
