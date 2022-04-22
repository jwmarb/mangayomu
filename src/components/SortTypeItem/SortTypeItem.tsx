import Icon from '@components/Icon';
import ListItem from '@components/List/ListItem';
import { SortTypeItemProps } from '@components/SortTypeItem/SortTypeItem.interfaces';
import React from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const SortTypeItem: React.FC<SortTypeItemProps> = (props) => {
  const { selected, sortBy, reverse, setReverse, setSort } = props;
  const rotate = useSharedValue(0);
  useDerivedValue(() => {
    if (reverse) rotate.value = withTiming(180, { duration: 200, easing: Easing.linear });
    else rotate.value = withTiming(0, { duration: 200, easing: Easing.linear });
  }, [reverse]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value + 'deg' }],
  }));

  return (
    <ListItem
      title={sortBy}
      onPress={() => {
        if (selected) setReverse((p) => !p);
        else setSort(sortBy);
      }}
      typographyProps={{ color: selected ? 'primary' : 'textPrimary' }}
      adornment={
        selected ? (
          <Animated.View style={style}>
            <Icon bundle='Feather' name='arrow-up' color='primary' />
          </Animated.View>
        ) : (
          <View style={{ opacity: 0 }}>
            <Icon bundle='Feather' name='arrow-up' color='primary' />
          </View>
        )
      }
    />
  );
};

export default React.memo(SortTypeItem);
