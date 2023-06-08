import Box from '@components/Box';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { BlurView } from '@react-native-community/blur';
import { StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  CustomBlockRenderer,
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

export const spoilerElementModel = HTMLElementModel.fromCustomModel({
  tagName: 'spoiler',
  contentModel: HTMLContentModel.block,
});

export const spoilerRenderer: CustomBlockRenderer = ({
  TDefaultRenderer,
  ...defaultRendererProps
}) => {
  const opacity = useSharedValue(1);
  const theme = useTheme();
  const style = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFillObject,
    opacity: opacity.value,
  }));
  function handleOnPress() {
    opacity.value = withTiming(0, {
      duration: 100,
      easing: Easing.ease,
    });
  }
  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <TDefaultRenderer {...defaultRendererProps} />
      <Animated.View style={style}>
        <BlurView
          overlayColor="transparent"
          style={StyleSheet.absoluteFill}
          blurType={theme.mode ?? 'light'}
          blurRadius={3}
          reducedTransparencyFallbackColor="gray"
        />
        <Box
          style={StyleSheet.absoluteFill}
          justify-content="center"
          align-items="center"
        >
          <Box
            px="m"
            py="s"
            background-color="rgba(0, 0, 0, 0.2)"
            align-self="center"
            border-radius="@theme"
            box-shadow
          >
            <Text
              color={{
                custom: theme.helpers.getContrastText('rgba(0, 0, 0, 0.2)'),
              }}
            >
              Reveal spoiler
            </Text>
          </Box>
        </Box>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
