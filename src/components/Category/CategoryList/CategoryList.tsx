import { CategoryListProps } from '@components/Category/CategoryList/CategoryList.interfaces';
import Spacer from '@components/Spacer';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import pixelToNumber from '@utils/pixelToNumber';
import withAnimatedMounting from '@utils/withAnimatedMounting';
import React from 'react';
import { FlatList, FlatListProps } from 'react-native';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
const BaseList = styled.FlatList.attrs((props) => ({
  contentContainerStyle: {
    paddingHorizontal: pixelToNumber(props.theme.spacing(3)),
  },
}))``;

export default function CategoryListBase<T = any>(props: FlatListProps<T> & CategoryListProps) {
  const { spacing = 2 } = props;
  const style = useAnimatedMounting();
  const Separator = React.useCallback(() => <Spacer x={spacing} />, [spacing]);

  return (
    <Animated.View style={style}>
      <BaseList {...(props as any)} ItemSeparatorComponent={Separator} />
    </Animated.View>
  );
}
