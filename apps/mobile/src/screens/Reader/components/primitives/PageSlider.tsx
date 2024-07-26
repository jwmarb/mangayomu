import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useTheme from '@/hooks/useTheme';
import useMetrics from '@/screens/Reader/hooks/useMetrics';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { DimensionValue, LayoutChangeEvent, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
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
}));

export default function PageSlider() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const [width, setWidth] = React.useState<number | null>(null); // null meaning not initialized
  const theme = useTheme();
  const left = useSharedValue<DimensionValue>('0%');
  const animatedStyle = useAnimatedStyle(() => ({
    left: left.value,
  }));
  const metrics = useMetrics();

  React.useEffect(() => {
    if (metrics != null && width != null) {
      const partial =
        (metrics.currentPageNumber - 1) / (metrics.totalPageCount - 1);
      left.value =
        `${(partial - theme.style.size.xxl / width / 2) * 100}%` as DimensionValue;
    }
  }, [metrics?.currentPageNumber, metrics?.totalPageCount, width]);

  const handleOnLayout = (e: LayoutChangeEvent) => {
    setWidth((currentWidth) =>
      currentWidth == null ? e.nativeEvent.layout.width : currentWidth,
    );
  };

  return (
    <View style={style.container} onLayout={handleOnLayout}>
      <View style={style.line}>
        {width != null && (
          <Animated.View style={[style.circle, animatedStyle]} />
        )}
      </View>
    </View>
  );
}
