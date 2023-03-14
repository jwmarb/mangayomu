import React from 'react';
import { useWindowDimensions } from 'react-native';
import FastImage, {
  FastImageProps,
  OnLoadEvent,
} from 'react-native-fast-image';
import { ChapterPageProps } from './ChapterPage.interfaces';
import WebView from 'react-native-webview';
import Box, { AnimatedBox } from '@components/Box';
import Text from '@components/Text';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import { StatusBar } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

const AnimatedFastImage = Animated.createAnimatedComponent(
  FastImage as React.FC<FastImageProps>,
);

const ChapterPage: React.FC<ChapterPageProps> = (props) => {
  const { width, height } = useWindowDimensions();
  const { tapGesture } = props;
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  }>({ width, height });
  const scale = React.useMemo(
    () => width / imageDimensions.width,
    [width, imageDimensions.width],
  );
  const opacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(1);
  const style = React.useMemo(
    () => ({
      width,
      height:
        scale *
        (StatusBar.currentHeight
          ? StatusBar.currentHeight + imageDimensions.height
          : imageDimensions.height),
    }),
    [imageDimensions, scale, width],
  );
  const animatedMountStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const fastImageStyle = React.useMemo(
    () => [style, animatedMountStyle],
    [style, animatedMountStyle],
  );
  const animatedLoadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));
  const { page } = props.page;
  function handleOnLoadEnd() {
    opacity.value = 1;
    loadingOpacity.value = 0;
  }
  function handleOnLoad(e: OnLoadEvent) {
    setImageDimensions({
      width: e.nativeEvent.width,
      height: e.nativeEvent.height,
    });
  }
  return (
    <GestureDetector gesture={tapGesture}>
      <Box align-self="center">
        <AnimatedFastImage
          source={{ uri: page }}
          style={fastImageStyle}
          resizeMode="contain"
          onLoadEnd={handleOnLoadEnd}
          onLoad={handleOnLoad}
        />
        <AnimatedBox
          position="absolute"
          align-items="center"
          flex-grow
          top={0}
          left={0}
          right={0}
          bottom={0}
          justify-content="center"
          style={animatedLoadingStyle}
        >
          <Progress />
        </AnimatedBox>
      </Box>
    </GestureDetector>
  );
};

export default React.memo(ChapterPage);
