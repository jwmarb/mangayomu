import Box from '@components/Box';
import Tab from '@components/NavTabs/Tab';
import { useTheme } from '@emotion/react';
import { HomeTabParamList } from '@navigators/Home/Home.interfaces';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';

const NavTabs: React.FC<BottomTabBarProps> = (props) => {
  const { state, descriptors, navigation } = props;
  const theme = useTheme();
  return (
    <Box
      overflow="hidden"
      flex-direction="row"
      background-color={theme.palette.background.paper}
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
          routeKey={route.key}
          routeName={route.name as keyof HomeTabParamList}
          isFocused={index === state.index}
          tabBarIcon={descriptors[route.key].options.tabBarIcon}
          navigation={navigation}
        />
      ))}
    </Box>
  );
};

export default (props: BottomTabBarProps) => <NavTabs {...props} />;
