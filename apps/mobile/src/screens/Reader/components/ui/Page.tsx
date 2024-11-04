import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { Dimensions, useWindowDimensions, View } from 'react-native';
import Image from '@/components/primitives/Image';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Progress from '@/components/primitives/Progress';
import useBoolean from '@/hooks/useBoolean';
import {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import { getImageDimensions, ResolvedImageAsset } from '@/utils/image';
import { useReadingDirection } from '@/screens/Reader/context';
import { ReadingDirection } from '@/models/schema';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import GestureManager from '@/screens/Reader/helpers/GestureManager';

export type PageProps = {
  type: 'PAGE';
  source: ResolvedImageAsset;
  chapter: MangaChapter;
  page: number;
};

const { width, height } = Dimensions.get('window');

const styles = createStyles((theme) => ({
  image: {
    width,
    height,
    resizeMode: 'contain',
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const MIN_SCALE = 1;
const MAX_SCALE = 10;
const VELOCITY_FACTOR = 0.2;

export default React.memo(function Page(props: PageProps) {
  const { source } = props;
  const style = useStyles(styles);

  const [loading, toggle] = useBoolean(true);
  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions();
  const readingDirection = useReadingDirection();
  const width = useSharedValue<number>(deviceWidth);
  const height = useSharedValue<number>(
    source.height * (deviceWidth / source.width),
  );
  const x = useSharedValue<number>(0);
  const y = useSharedValue<number>(0);
  const borderX = useSharedValue<number>(0);
  const borderY = useSharedValue<number>(0);
  const scale = useSharedValue<number>(1);
  const [panEnabled, togglePanEnabled] = useBoolean(false);

  useAnimatedReaction(
    () => scale.value,
    (currentValue) => {
      // Calculate the border limits for panning
      borderX.value =
        (width.value * scale.value - width.value) / (2 * scale.value);
      borderY.value =
        (height.value * scale.value - height.value) / (2 * scale.value);

      // Update the X and Y translation values, ensuring they stay within the calculated borders
      x.value = Math.max(Math.min(borderX.value, x.value), -borderX.value);
      y.value = Math.max(Math.min(borderY.value, y.value), -borderY.value);
      runOnJS(togglePanEnabled)(currentValue !== MIN_SCALE);
    },
  );

  function handleOnLoadEnd() {
    toggle(false);
  }

  const imageStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    alignSelf:
      readingDirection !== ReadingDirection.WEBTOON ? 'center' : 'auto',
    transform: [
      { scale: scale.value },
      { translateX: x.value },
      { translateY: y.value },
    ],
  }));

  React.useEffect(() => {
    const subscription = GestureManager.subscribe(source);

    subscription.on('onDoubleTap', (e) => {
      'worklet';
      scale.value = withTiming(1, { duration: 200 });
      x.value = withTiming(0, { duration: 200 });
      y.value = withTiming(0, { duration: 200 });
    });

    subscription.on('onPinchChange', (e) => {
      'worklet';
      scale.value = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, scale.value * e.scaleChange),
      );
    });

    subscription.on('onFlatListInteraction', () => {
      'worklet';
      runOnJS(togglePanEnabled)(scale.value > MIN_SCALE);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [source]);

  const panGesture = React.useMemo(() => {
    const gesture = Gesture.Pan()
      .onStart(() => {
        runOnJS(togglePanEnabled)(scale.value > MIN_SCALE);
      })
      .onChange((e) => {
        // Update the X and Y translation values, ensuring they stay within the calculated borders
        x.value = Math.max(
          Math.min(borderX.value, x.value + e.changeX / scale.value),
          -borderX.value,
        );
        y.value = Math.max(
          Math.min(borderY.value, y.value + e.changeY / scale.value),
          -borderY.value,
        );

        // Apply a "slippery sliding" effect to the pan
        y.value = withDecay({
          clamp: [-borderY.value, borderY.value],
          velocity: e.velocityY,
          velocityFactor: VELOCITY_FACTOR,
        });
        x.value = withDecay({
          clamp: [-borderX.value, borderX.value],
          velocity: e.velocityX,
          velocityFactor: VELOCITY_FACTOR,
        });
      })
      .onFinalize(() => {
        if (
          (x.value === borderX.value || x.value === -borderX.value) &&
          scale.value > 1
        ) {
          runOnJS(togglePanEnabled)(false);
        }
      })
      .enabled(panEnabled);

    if (!panEnabled) {
      gesture.simultaneousWithExternalGesture(
        GestureManager.getPinchGesture(),
        GestureManager.getFlatListGesture(),
      );
    } else {
      gesture.simultaneousWithExternalGesture(GestureManager.getPinchGesture());
    }

    return gesture;
  }, [panEnabled]);

  return (
    <>
      {loading && (
        <View style={style.progress}>
          <Progress size="large" />
        </View>
      )}
      <GestureDetector gesture={panGesture}>
        <Image source={source} style={imageStyle} onLoadEnd={handleOnLoadEnd} />
      </GestureDetector>
    </>
  );
});
