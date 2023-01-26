import Box from '@components/Box';
import Tab from '@components/NavTabs/Tab';
import { HomeTabParamList } from '@navigators/Home/Home.interfaces';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';

const NavTabs: React.FC<BottomTabBarProps> = (props) => {
  const { state, navigation } = props;
  return (
    <Box
      overflow="hidden"
      flex-direction="row"
      background-color="paper"
      position="absolute"
      bottom={0}
      border-radius={{
        tl: '@theme',
        tr: '@theme',
      }}
      maxWidth={moderateScale(480)}
      align-self="center"
    >
      {state.routes.map((route, index) => (
        <Tab
          key={route.key}
          routeName={route.name as keyof HomeTabParamList}
          isFocused={index === state.index}
          navigation={navigation}
        />
      ))}
    </Box>
  );
};

export default NavTabs;
