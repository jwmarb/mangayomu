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
  const SPOILER_COLOR =
    theme.mode === 'light' ? 'rgba(0, 0, 0, 0.36)' : 'rgba(51, 51, 51, 0.4)';
  const SPOILER_CONTRAST_COLOR = theme.helpers.getContrastText(SPOILER_COLOR);
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
          overlayColor={SPOILER_COLOR}
          style={StyleSheet.absoluteFill}
          blurType={theme.mode ?? 'light'}
          blurRadius={3}
          reducedTransparencyFallbackColor="gray"
        />
        <Box
          style={StyleSheet.absoluteFill}
          justify-content="center"
          align-items="center"
          overflow="visible"
        >
          <Text
            color={{
              custom: SPOILER_CONTRAST_COLOR,
            }}
          >
            Reveal spoiler
          </Text>
        </Box>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
