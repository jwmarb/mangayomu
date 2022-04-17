import { BottomTabHeader, IconButton, Icon, StackTabs } from '@components/core';
import { IconPack, IconProps } from '@components/Icon/Icon.interfaces';
import BottomTab from '@navigators/BottomTab';
import Browse from '@screens/Home/screens/Browse';
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
        options={{ headerTitle: 'Explore', tabBarIcon: createTabIcon('Feather', 'home') }}
      />
      <BottomTab.Screen
        component={Browse}
        name='Library'
        options={{
          headerTitle: 'Library',
          tabBarIcon: createTabIcon('Feather', 'bookmark'),
          headerRight: () => <IconButton icon={<Icon bundle='AntDesign' name='search1' />} />,
        }}
      />
      <BottomTab.Screen
        component={Browse}
        name='Browse'
        options={{ headerTitle: 'Browse', tabBarIcon: createTabIcon('Feather', 'search') }}
      />
      <BottomTab.Screen
        component={Browse}
        name='History'
        options={{ headerTitle: 'History', tabBarIcon: createTabIcon('Feather', 'clock') }}
      />
      <BottomTab.Screen
        component={Browse}
        name='Settings'
        options={{ headerTitle: 'Settings', tabBarIcon: createTabIcon('Feather', 'settings') }}
      />
    </BottomTab.Navigator>
  );
};

export default HomeScreen;
