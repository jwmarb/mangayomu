import { MutableSortFilter } from '@mangayomu/schema-creator';
import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Freeze } from 'react-freeze';
import PressableComponent from '@/components/primitives/Pressable';
import { AnimatedIcon } from '@/components/primitives/Icon';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import useBoolean from '@/hooks/useBoolean';
import {
  SORT_ITEM_HEIGHT,
  useSortDispatcher,
} from '@/screens/SourceBrowser/components/shared';

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

type SortPorps = {
  title: string;
  sort: MutableSortFilter<string>;
};

function Sort(props: SortPorps) {
  const { title, sort } = props;
  const setSort = useSortDispatcher();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const opacity = useSharedValue(1);
  const rotate = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [0, 90]),
  );
  const iconRotate = useSharedValue(0);

  const [hidden, toggle] = useBoolean(false);

  const animatedIconStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: rotate.value + 'deg' }],
    }),
    [],
  );

  const animatedIconIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: iconRotate.value + 'deg' }],
  }));

  const handleOnPress = React.useCallback(
    (item: string) => {
      setSort({ item, title });
    },
    [setSort],
  );

  function toggleRotation() {
    toggle();
  }

  React.useEffect(() => {
    if (hidden) {
      opacity.value = withTiming(0, { duration: 150 });
    } else {
      opacity.value = withTiming(1, { duration: 150 });
    }
    return () => {
      cancelAnimation(opacity);
    };
  }, [hidden]);
  React.useEffect(() => {
    if (sort.reversed) {
      iconRotate.value = withTiming(180, { duration: 100 });
    } else {
      iconRotate.value = withTiming(0, { duration: 100 });
    }
    return () => {
      cancelAnimation(iconRotate);
    };
  }, [sort.reversed]);

  return (
    <>
      <Pressable onPress={toggleRotation} style={style.container}>
        <Text>{title}</Text>
        <AnimatedIcon
          style={animatedIconStyle}
          type="icon"
          name="chevron-right"
        />
      </Pressable>
      <Freeze freeze={hidden}>
        {sort.options.map((x) => (
          <SortOption
            key={x}
            item={x}
            onPress={handleOnPress}
            selected={x === sort.value}
            style={animatedIconIndicatorStyle}
          />
        ))}
      </Freeze>
    </>
  );
}

const SortOption = React.memo(
  (props: {
    selected?: boolean;
    item: string;
    onPress: (id: string) => void;
    style?: StyleProp<ViewStyle>;
  }) => {
    const { item, onPress, selected, style: styleProp } = props;
    const contrast = useContrast();
    const style = useStyles(styles, contrast);
    function handleOnPress() {
      onPress(item);
    }

    const color = selected ? 'primary' : 'textSecondary';
    const animatedIconStyle = [
      selected ? style.selected : style.notSelected,
      styleProp,
    ];
    return (
      <PressableComponent onPress={handleOnPress} style={style.item}>
        <AnimatedIcon
          color={color}
          style={animatedIconStyle}
          type="icon"
          name="arrow-up"
        />
        <Text color={color} bold={selected}>
          {item}
        </Text>
      </PressableComponent>
    );
  },
);

export default React.memo(Sort);
