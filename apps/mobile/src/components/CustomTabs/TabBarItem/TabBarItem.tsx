import Box from '@components/Box';
import Pressable from '@components/Pressable';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

function TabBarItem(props: {
  numOfRoutes: number;
  jumpTo: (key: string) => void;
  routeTitle?: string;
  routeKey: string;
  focused: boolean;
}) {
  const { numOfRoutes, routeTitle, focused, jumpTo, routeKey } = props;
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const color = useDerivedValue(() =>
    interpolateColor(
      focused ? 1 : 0,
      [0, 1],
      [theme.palette.text.secondary, theme.palette.primary.main],
    ),
  );
  const style = useAnimatedStyle(() => ({
    color: color.value,
  }));
  const pressableStyle = { width: width / numOfRoutes };
  function handleOnPress() {
    jumpTo(routeKey);
  }
  return (
    <Pressable
      color="primary"
      borderless
      onPress={handleOnPress}
      style={pressableStyle}
    >
      <Box m="m">
        <Text
          as={Animated.Text}
          align="center"
          bold
          style={style}
          variant="button"
        >
          {routeTitle}
        </Text>
      </Box>
    </Pressable>
  );
}

export default React.memo(TabBarItem);
