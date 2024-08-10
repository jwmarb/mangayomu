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
    paddingRight: theme.style.size.xxl,
  },
  circle: {
    backgroundColor: theme.palette.primary.main,
    width: theme.style.size.xxl,
    height: theme.style.size.xxl,
    borderRadius: 100000,
    position: 'absolute',
    right: '50%',
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
  const left = useSharedValue<DimensionValue>('0%');
  const right = useSharedValue<DimensionValue>('100%');
  const { goToPage, goToFirstPage, goToLastPage } = useScrollToPage();
  const [isActivelySliding, toggle] = useBoolean();
  const value =
    readingDirection === ReadingDirection.LEFT_TO_RIGHT
      ? left.value
      : right.value;
  const animatedStyle = useAnimatedStyle(() => ({
    left: value,
  }));
  const followingLineAnimatedStyle = useAnimatedStyle(() => ({
    width: left.value,
    alignSelf:
      readingDirection === ReadingDirection.RIGHT_TO_LEFT
        ? 'flex-end'
        : undefined,
  }));
  const metrics = useMetrics();
  const snapPoints = React.useMemo(() => {
    if (width == null) {
      return [];
    }
    return new Array((metrics?.totalPageCount ?? 1) - 1)
      .fill(0)
      .map((_, i, self) => {
        const partial = i / self.length;
        return (partial - theme.style.size.xxl / width / 2) * 100;
      });
  }, [metrics?.totalPageCount]);

  React.useLayoutEffect(() => {
    if (metrics != null && width != null && !isActivelySliding) {
      const partialLeft =
        (metrics.currentPageNumber - 1) / (metrics.totalPageCount - 1);
      const partialRight =
        (metrics.totalPageCount - metrics.currentPageNumber) /
        (metrics.totalPageCount - 1);
      left.value =
        `${(partialLeft - theme.style.size.xxl / width / 2) * 100}%` as DimensionValue;
      right.value =
        `${(partialRight - theme.style.size.xxl / width / 2) * 100}%` as DimensionValue;
    }
  }, [
    metrics?.currentPageNumber,
    metrics?.totalPageCount,
    width,
    readingDirection,
  ]);

  const handleOnLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setWidth((currentWidth) => (currentWidth == null ? width : currentWidth));
  };

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
          const percentage = (e.x / width) * 100;

          if (percentage <= snapPoints[0]) {
            left.value = `${snapPoints[0]}%`;
            right.value = `${snapPoints[snapPoints.length - 1]}%`;
            runOnJS(
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? goToFirstPage
                : goToLastPage,
            )();
          } else if (percentage >= snapPoints[snapPoints.length - 1]) {
            left.value = `${snapPoints[snapPoints.length - 1]}%`;
            right.value = `${snapPoints[0]}%`;
            runOnJS(
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? goToLastPage
                : goToFirstPage,
            )();
          } else {
            let l = 0,
              r = snapPoints.length - 1;
            while (l <= r) {
              const m = Math.floor((l + r) / 2);
              const snapPoint = snapPoints[m];
              if (Math.abs(percentage - snapPoint) <= 0.1) {
                runOnJS(goToPage)(
                  readingDirection === ReadingDirection.LEFT_TO_RIGHT
                    ? m
                    : metrics.totalPageCount - m - 1,
                );
                left.value = `${readingDirection === ReadingDirection.LEFT_TO_RIGHT ? snapPoint : snapPoints[metrics.totalPageCount - m - 1]}%`;
                right.value = `${readingDirection === ReadingDirection.RIGHT_TO_LEFT ? snapPoint : snapPoints[metrics.totalPageCount - m - 1]}%`;
                return;
              } else if (snapPoint < percentage) {
                l = m + 1;
              } else {
                r = m - 1;
              }
            }
          }
        }),
    [width, metrics, goToFirstPage, goToLastPage, goToPage, readingDirection],
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
          const percentage = (e.x / width) * 100;

          if (percentage <= snapPoints[0]) {
            left.value = `${snapPoints[0]}%`;
            right.value = `${snapPoints[snapPoints.length - 1]}%`;
            runOnJS(
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? goToFirstPage
                : goToLastPage,
            )();
          } else if (percentage >= snapPoints[snapPoints.length - 1]) {
            left.value = `${snapPoints[snapPoints.length - 1]}%`;
            right.value = `${snapPoints[0]}%`;
            runOnJS(
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? goToLastPage
                : goToFirstPage,
            )();
          } else {
            let l = 0,
              r = snapPoints.length - 1;
            while (l <= r) {
              const m = Math.floor((l + r) / 2);
              const snapPoint = snapPoints[m];
              if (snapPoint < percentage) {
                l = m + 1;
              } else {
                r = m - 1;
              }
            }
            runOnJS(goToPage)(
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? l
                : metrics.totalPageCount - l - 1,
            );
            left.value = `${readingDirection === ReadingDirection.LEFT_TO_RIGHT ? snapPoints[l] : snapPoints[metrics.totalPageCount - l - 1]}%`;
            right.value = `${readingDirection === ReadingDirection.RIGHT_TO_LEFT ? snapPoints[l] : snapPoints[metrics.totalPageCount - l - 1]}%`;
          }
        }),
    [width, metrics, goToFirstPage, goToLastPage, goToPage, readingDirection],
  );

  const combinedGestures = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <GestureDetector gesture={combinedGestures}>
      <View style={style.container} onLayout={handleOnLayout}>
        <View style={style.line}>
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
