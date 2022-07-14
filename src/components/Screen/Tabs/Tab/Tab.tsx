import Icon from '@components/Icon';
import { TabProps } from '@components/Screen/Tabs/Tab/Tab.interfaces';
import { TabButtonBase, TabContainer } from '@components/Screen/Tabs/Tabs.base';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import React from 'react';
import { useTheme } from 'styled-components/native';

const Tab: React.FC<TabProps> = (props) => {
  const { tabBarIcon, routeName, routeKey, navigation, isFocused } = props;
  const theme = useTheme();
  const TabIcon = tabBarIcon as React.FC<Omit<React.ComponentProps<typeof Icon>, 'bundle' | 'name'>>;
  const color = React.useMemo(() => (isFocused ? 'primary' : 'disabled'), [isFocused]);
  const onPress = React.useCallback(() => {
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate({ name: routeName, params: undefined });
    }
  }, [navigation.emit, navigation.navigate, isFocused, routeKey, routeName]);

  return React.useMemo(
    () => (
      <TabButtonBase onPress={onPress}>
        <TabContainer>
          {TabIcon && (
            <>
              <TabIcon color={color} />
              <Spacer y={1} />
            </>
          )}
          <Typography variant='bottomtab' color={color}>
            {routeName}
          </Typography>
        </TabContainer>
      </TabButtonBase>
    ),
    [isFocused, theme]
  );
};

export default Tab;
