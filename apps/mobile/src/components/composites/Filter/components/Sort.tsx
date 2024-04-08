import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSortOption } from '@/components/composites/Filter/context';
import { AnimatedIcon } from '@/components/primitives/Icon';
import Pressable from '@/components/primitives/Pressable';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { SORT_ITEM_HEIGHT } from '@/screens/SourceBrowser/components/shared';
import { createStyles } from '@/utils/theme';

export type SortProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  selected: boolean;
  reversed: boolean;
  title?: string;
  style?: StyleProp<ViewStyle>;
};

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal * 2,
    paddingVertical: theme.style.container.paddingVertical,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.style.size.m,
  },
  item: {
    paddingRight: theme.style.screen.paddingHorizontal * 2,
    paddingLeft: theme.style.screen.paddingHorizontal * 4,
    height: SORT_ITEM_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0,
    gap: theme.style.size.m,
    // paddingVertical: theme.style.size.l,
  },
  notSelected: {
    opacity: 0,
  },
  selected: {
    opacity: 1,
  },
}));

function Sort(props: SortProps) {
  const { title, value, selected, style: styleProp, reversed } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const onPress = useSortOption();
  const iconRotate = useSharedValue(0);
  const animatedIconIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: iconRotate.value + 'deg' }],
  }));

  React.useEffect(() => {
    if (reversed) {
      iconRotate.value = withTiming(180, { duration: 100 });
    } else {
      iconRotate.value = withTiming(0, { duration: 100 });
    }
    return () => {
      cancelAnimation(iconRotate);
    };
  }, [reversed]);

  function handleOnPress() {
    if (onPress != null)
      onPress({
        type: 'sort',
        value,
        reversed: selected ? !reversed : reversed,
      });
  }

  const color = selected ? 'primary' : 'textSecondary';
  const animatedIconStyle = [
    selected ? style.selected : style.notSelected,
    animatedIconIndicatorStyle,
  ];

  return (
    <Pressable onPress={handleOnPress} style={style.item}>
      <AnimatedIcon
        color={color}
        style={animatedIconStyle}
        type="icon"
        name="arrow-up"
      />
      <Text color={color} bold={selected}>
        {title ?? value}
      </Text>
    </Pressable>
  );
}

export default React.memo(Sort);
