import { BlurView } from '@react-native-community/blur';
import { StyleSheet, View } from 'react-native';
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
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useThemedProps from '@/hooks/useThemedProps';
import { createStyles, createThemedProps } from '@/utils/theme';

const styles = createStyles((theme) => ({
  text: {
    color:
      theme.mode === 'light'
        ? theme.helpers.getContrastText('rgba(0, 0, 0, 0.36)')
        : theme.helpers.getContrastText('rgba(51, 51, 51, 0.4)'),
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
}));

const themedProps = createThemedProps((theme) => ({
  BlurView: {
    overlayColor:
      theme.mode === 'light' ? 'rgba(0, 0, 0, 0.36)' : 'rgba(51, 51, 51, 0.4)',
    style: StyleSheet.absoluteFill,
    blurType: theme.mode ?? 'light',
    blurRadius: 3,
    reducedTransparencyFallbackColor: 'gray',
  },
}));

export const spoilerElementModel = HTMLElementModel.fromCustomModel({
  tagName: 'spoiler',
  contentModel: HTMLContentModel.block,
});

export const spoilerRenderer: CustomBlockRenderer = ({
  TDefaultRenderer,
  ...defaultRendererProps
}) => {
  const opacity = useSharedValue(1);
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const props = useThemedProps(themedProps, contrast);
  const animatedStyle = useAnimatedStyle(() => ({
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
      <Animated.View style={animatedStyle}>
        <BlurView {...props.BlurView} />
        <View style={style.textContainer}>
          <Text style={style.text}>Reveal spoiler</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
