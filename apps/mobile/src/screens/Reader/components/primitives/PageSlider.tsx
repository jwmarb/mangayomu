import useBoolean from '@/hooks/useBoolean';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useTheme from '@/hooks/useTheme';
import { ReadingDirection } from '@/models/schema';
import { useReadingDirection } from '@/screens/Reader/context';
import useMetrics from '@/screens/Reader/hooks/useMetrics';
import useScrollToPage from '@/screens/Reader/hooks/useScrollToPage';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { DimensionValue, LayoutChangeEvent, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const styles = createStyles((theme) => ({
  container: {
    flexGrow: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.style.size.l,
  },
  circle: {
    backgroundColor: theme.palette.primary.main,
    width: theme.style.size.l,
    height: theme.style.size.l,
    borderRadius: 100000,
    position: 'absolute',
    transform: [{ translateX: -theme.style.size.l / 2 }], // Anchor point to center
  },
  line: {
    backgroundColor: theme.palette.divider,
    flexGrow: 1,
    height: theme.style.size.s,
    borderRadius: theme.style.size.s,
    justifyContent: 'center',
  },
  followingLine: {
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    height: theme.style.size.s,
    borderTopLeftRadius: theme.style.size.s,
    borderBottomLeftRadius: theme.style.size.s,
  },
}));

export default function PageSlider() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const [width, setWidth] = React.useState<number | null>(null); // null meaning not initialized
  const readingDirection = useReadingDirection();
  const theme = useTheme();
  const { goToPage, goToFirstPage, goToLastPage } = useScrollToPage();
  const [isActivelySliding, toggle] = useBoolean();
  const left = useSharedValue<DimensionValue>(0);
  const lineWidth = useSharedValue<DimensionValue>(0);
  const animatedStyle = useAnimatedStyle(() => ({
    left: left.value,
  }));
  const followingLineAnimatedStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
    alignSelf:
      readingDirection === ReadingDirection.RIGHT_TO_LEFT
        ? 'flex-end'
        : undefined,
  }));
  const metrics = useMetrics();

  React.useLayoutEffect(() => {
    if (metrics != null && width != null) {
      let percentPosition: number;

      const width =
        (metrics.currentPageNumber - 1) / (metrics.totalPageCount - 1);

      if (readingDirection === ReadingDirection.LEFT_TO_RIGHT) {
        percentPosition = width;
      } else {
        percentPosition =
          (metrics.totalPageCount - metrics.currentPageNumber) /
          (metrics.totalPageCount - 1);
      }
      left.value = (percentPosition * 100 + '%') as DimensionValue;
      lineWidth.value = (width * 100 + '%') as DimensionValue;
      // const partialRight =
      //   (metrics.totalPageCount - metrics.currentPageNumber) /
      //   (metrics.totalPageCount - 1);
      // left.value =
      //   `${(partialLeft - theme.style.size.xxl / width / 2) * 100}%` as DimensionValue;
      // right.value =
      //   `${(partialRight - theme.style.size.xxl / width / 2) * 100}%` as DimensionValue;
    }
  }, [
    metrics?.currentPageNumber,
    metrics?.totalPageCount,
    width,
    readingDirection,
  ]);

  const handleOnLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setWidth(width);
  };

  const onBeginning = React.useCallback(() => {
    if (readingDirection === ReadingDirection.LEFT_TO_RIGHT) {
      goToFirstPage();
    } else {
      goToLastPage();
    }
  }, [readingDirection, goToFirstPage, goToLastPage]);

  const onEnd = React.useCallback(() => {
    if (readingDirection === ReadingDirection.RIGHT_TO_LEFT) {
      goToFirstPage();
    } else {
      goToLastPage();
    }
  }, [readingDirection, goToFirstPage, goToLastPage]);

  const onPage = React.useCallback(
    (page: number) => {
      if (readingDirection === ReadingDirection.LEFT_TO_RIGHT) {
        goToPage(page);
      } else if (metrics?.totalPageCount != null) {
        goToPage(metrics?.totalPageCount - page - 1);
      }
    },
    [readingDirection, goToPage],
  );

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onEnd(() => {
          runOnJS(toggle)(false);
        })
        .onChange((e) => {
          runOnJS(toggle)(true);
          if (width == null || metrics == null) {
            return;
          }

          if (e.x <= 0) {
            runOnJS(onBeginning)();
          } else if (e.x >= width) {
            runOnJS(onEnd)();
          } else {
            const pos = Math.min(Math.max(0, e.x), width);
            const page = Math.round((pos / width) * metrics.totalPageCount);
            runOnJS(onPage)(page);
          }
        }),
    [width, metrics, onEnd, onBeginning],
  );

  const tapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .onEnd(() => {
          runOnJS(toggle)(false);
        })
        .onBegin((e) => {
          if (width == null || metrics == null) {
            return;
          }
          runOnJS(toggle)(true);
          if (e.x <= 0) {
            runOnJS(onBeginning)();
          } else if (e.x >= width) {
            runOnJS(onEnd)();
          } else {
            const pos = Math.min(Math.max(0, e.x), width);
            const page = Math.round((pos / width) * metrics.totalPageCount);
            runOnJS(onPage)(page);
          }
        }),
    [width, metrics, goToFirstPage, goToLastPage, goToPage, readingDirection],
  );

  const combinedGestures = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <GestureDetector gesture={combinedGestures}>
      <View style={style.container}>
        <View style={style.line} onLayout={handleOnLayout}>
          {width != null && (
            <>
              <Animated.View style={[style.circle, animatedStyle]} />
              <Animated.View
                style={[style.followingLine, followingLineAnimatedStyle]}
              />
            </>
          )}
        </View>
      </View>
    </GestureDetector>
  );
}
