import Button from '@components/Button';
import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import { HeaderBuilder } from '@components/Screen/Header/Header.base';
import { Typography } from '@components/Typography';
import React from 'react';
import { Dimensions } from 'react-native';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import TabButton from './TabButton';
import { TabButtonContainer, TabContainer, TabContentContainer, TabSelectedIndicator } from './Tabs.base';
import { TabsContext } from './Tabs.context';
import { TabsProps } from './Tabs.interfaces';
const { width } = Dimensions.get('window');

const Tabs: React.FC<TabsProps> = (props) => {
  const { tabIndex, onTabChange, children } = props;
  const [tabs, setTabs] = React.useState<Set<string>>(new Set());
  const translateX = useSharedValue(0);
  const tabTranslateX = useSharedValue(0);
  const widthPerButton = React.useMemo(() => width / React.Children.count(children), [React.Children.count(children)]);
  React.useLayoutEffect(() => {
    translateX.value = withTiming(tabIndex * widthPerButton, { duration: 100, easing: Easing.ease });
    tabTranslateX.value = withTiming(-width * tabIndex, { duration: 100, easing: Easing.ease });
  }, [tabIndex]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const tabContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabTranslateX.value }],
  }));
  return (
    <Flex direction='column' grow>
      <HeaderBuilder paper removeStatusBarPadding>
        <Flex grow>
          <TabSelectedIndicator numOfChildren={React.Children.count(children)} style={style} />
          {Array.from(tabs).map((tabName, i) => (
            <TabButton
              width={widthPerButton}
              key={tabName}
              tabName={tabName}
              onPress={onTabChange}
              index={i}
              selected={i === tabIndex}
            />
          ))}
        </Flex>
      </HeaderBuilder>
      <TabsContext.Provider value={setTabs}>
        <TabContainer style={tabContentStyle}>
          {React.Children.map(children, (child) => (
            <TabContentContainer>{child}</TabContentContainer>
          ))}
        </TabContainer>
      </TabsContext.Provider>
    </Flex>
  );
};

export default Tabs;
