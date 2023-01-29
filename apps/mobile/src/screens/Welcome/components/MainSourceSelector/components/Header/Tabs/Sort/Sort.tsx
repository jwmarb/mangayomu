import Box from '@components/Box';
import Icon from '@components/Icon';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { AppState } from '@redux/main';
import { SORT_HOSTS_BY } from '@redux/slices/host';
import { setSort, toggleReverse } from '@redux/slices/mainSourceSelector';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { connect, ConnectedProps } from 'react-redux';

const data = Object.keys(SORT_HOSTS_BY) as (keyof typeof SORT_HOSTS_BY)[];
const renderItem: ListRenderItem<keyof typeof SORT_HOSTS_BY> = ({ item }) => (
  <Item title={item} />
);
const keyExtractor = (item: string) => item;

const Sort: React.FC = () => {
  return (
    <BottomSheetFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

const _Item: React.FC<ConnectedItemProps> = (props) => {
  const theme = useTheme();
  const textColor = useDerivedValue(() =>
    interpolateColor(
      props.isSelected ? 1 : 0,
      [0, 1],
      [theme.palette.text.secondary, theme.palette.primary.main],
    ),
  );
  const rotation = useSharedValue(props.reversed ? 180 : 0);
  const textStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotation.value + 'deg' }],
    opacity: props.isSelected ? 1 : 0,
  }));

  React.useEffect(() => {
    if (props.reversed)
      rotation.value = withTiming(180, { duration: 150, easing: Easing.ease });
    else rotation.value = withTiming(0, { duration: 150, easing: Easing.ease });
  }, [props.reversed]);

  function handleOnPress() {
    if (!props.isSelected) props.change();
    else props.toggleReverse();
  }
  return (
    <RectButton onPress={handleOnPress}>
      <Stack p="m" space="m" flex-direction="row" align-items="center">
        <Animated.View style={iconStyle}>
          <Icon type="font" name="arrow-up" color="primary" />
        </Animated.View>
        <Text as={Animated.Text} style={textStyle}>
          {props.title}
        </Text>
      </Stack>
    </RectButton>
  );
};

const mapStateToProps = (
  state: AppState,
  props: { title: keyof typeof SORT_HOSTS_BY },
) => ({
  reversed: state.mainSourceSelector.reversed,
  isSelected: state.mainSourceSelector.sort === props.title,
  title: props.title,
});

const itemConnector = connect(mapStateToProps, (dispatch, props) => ({
  change: () => dispatch(setSort(props.title)),
  toggleReverse: () => dispatch(toggleReverse()),
}));

type ConnectedItemProps = ConnectedProps<typeof itemConnector>;

const Item = itemConnector(React.memo(_Item));

export default Sort;
