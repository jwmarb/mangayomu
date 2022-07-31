import Button from '@components/Button';
import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import { HeaderBuilder } from '@components/Screen/Header/Header.base';
import { Typography } from '@components/Typography';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import TabButton from './TabButton';
import { TabButtonContainer, TabContainer, TabContentContainer, TabSelectedIndicator } from './Tabs.base';
import { TabsContext } from './Tabs.context';
import { TabsProps } from './Tabs.interfaces';

const Tabs: React.FC<TabsProps> = (props) => {
  const { width, height } = useWindowDimensions();
  const { tabIndex, onTabChange, children } = props;
  const [tabs, setTabs] = React.useState<Set<string>>(new Set());
  const [disallowInterruption, setDisallowInterruption] = React.useState<boolean>(true);
  const translateX = useSharedValue(0);
  const tabTranslateX = useSharedValue(0);
  const widthPerButton = React.useMemo(
    () => width / React.Children.count(children),
    [React.Children.count(children), width]
  );
  React.useLayoutEffect(() => {
    translateX.value = withTiming(tabIndex * widthPerButton, { duration: 100, easing: Easing.linear });
    tabTranslateX.value = withTiming(-width * tabIndex, { duration: 200, easing: Easing.linear });
    // return () => {
    //   cancelAnimation(translateX);
    //   cancelAnimation(tabTranslateX);
    // };
  }, [tabIndex]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const tabContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabTranslateX.value }],
  }));

  const theme = useTheme();

  const gesture = React.useMemo(
    () =>
      Gesture.Native()
        .disallowInterruption(true)
        .onEnd(() => {
          console.log('end');
        }),
    []
  );

  function handleOnScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (e.nativeEvent.contentOffset.y === 0) setDisallowInterruption(false);
  }

  React.useEffect(() => {
    if (!disallowInterruption) {
      const timeout = setTimeout(() => setDisallowInterruption(true), 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [disallowInterruption]);

  return (
    <Flex direction='column' grow>
      <HeaderBuilder paper removeStatusBarPadding>
        <Flex grow>
          <TabSelectedIndicator
            numOfChildren={React.Children.count(children)}
            style={style}
            width={width}
            height={height}
          />
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
      <Flex>
        <TabsContext.Provider value={setTabs}>
          <TabContainer style={tabContentStyle}>
            {React.Children.map(children, (child) => (
              <TabContentContainer width={width} height={height}>
                <ScrollView
                  disallowInterruption={disallowInterruption}
                  onMomentumScrollEnd={handleOnScrollEnd}
                  contentContainerStyle={{ paddingBottom: pixelToNumber(theme.spacing(16)) }}>
                  {child}
                </ScrollView>
              </TabContentContainer>
            ))}
          </TabContainer>
        </TabsContext.Provider>
      </Flex>
    </Flex>
  );
};

export default Tabs;
