import { BottomTabHeader, IconButton, Icon, StackTabs } from '@components/core';
import { IconPack, IconProps } from '@components/Icon/Icon.interfaces';
import BottomTab from '@navigators/BottomTab';
import Browse from '@screens/Home/screens/Browse';
import History from '@screens/Home/screens/History';
import MangaLibrary from '@screens/Home/screens/MangaLibrary';
import More from '@screens/Home/screens/More';
import React from 'react';
import { HomeProps } from './Home.interfaces';
import Main from './screens/Explore';

function createTabIcon<T extends IconPack>(bundle: T, name: IconProps<T>['name']) {
  return (props: any) => <Icon {...props} bundle={bundle} name={name} size='tab' />;
}

const HomeScreen: React.FC<HomeProps> = (props) => {
  return (
    <BottomTab.Navigator
      initialRouteName='Explore'
      screenOptions={{
        header: BottomTabHeader,
      }}
      tabBar={StackTabs}>
      <BottomTab.Screen
        component={Main}
        name='Explore'
        options={{ headerTitle: 'Explore', tabBarIcon: createTabIcon('Feather', 'compass') }}
      />
      <BottomTab.Screen
        component={MangaLibrary}
        name='Library'
        options={{
          tabBarIcon: createTabIcon('Feather', 'bookmark'),
        }}
      />
      <BottomTab.Screen
        component={Browse}
        name='Browse'
        options={{ headerTitle: 'Browse', tabBarIcon: createTabIcon('Feather', 'search') }}
      />
      <BottomTab.Screen
        component={History}
        name='History'
        options={{ headerTitle: 'History', tabBarIcon: createTabIcon('Feather', 'clock') }}
      />
      <BottomTab.Screen
        component={More}
        name='More'
        options={{
          headerTitle: 'More',
          tabBarIcon: createTabIcon('MaterialCommunityIcons', 'dots-horizontal'),
          headerLeft: () => null,
        }}
      />
    </BottomTab.Navigator>
  );
};

export default HomeScreen;
