import ButtonBase from '@components/Button/ButtonBase';
import Icon from '@components/Icon';
import { TabButtonBase, TabContainer, TabsContainer } from '@components/Screen/Tabs/Tabs.base';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';

const Tabs: React.FC<BottomTabBarProps> = (props) => {
  const { navigation, descriptors, state } = props;

  return (
    <TabsContainer>
      {state.routes.map((route, index) => {
        const {
          options,
          route: { params },
        } = descriptors[route.key];
        const tabBarIcon: unknown = options.tabBarIcon;
        const TabIcon = tabBarIcon as React.FC<Omit<React.ComponentProps<typeof Icon>, 'bundle' | 'name'>>;
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const color = isFocused ? 'primary' : 'disabled';
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, params });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabButtonBase onPress={onPress} key={route.key}>
            <TabContainer>
              {TabIcon && (
                <>
                  <TabIcon color={color} />
                  <Spacer y={1} />
                </>
              )}
              <Typography variant='bottomtab' color={color}>
                {label}
              </Typography>
            </TabContainer>
          </TabButtonBase>
        );
      })}
    </TabsContainer>
  );
};

export default (props: BottomTabBarProps) => <Tabs {...props} />;
