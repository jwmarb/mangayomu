import Spacer from '@components/Spacer';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { FlatList, FlatListProps } from 'react-native';
import styled, { css } from 'styled-components/native';
const BaseList = styled.FlatList.attrs((props) => ({
  contentContainerStyle: {
    paddingHorizontal: pixelToNumber(props.theme.spacing(3)),
  },
}))``;

const Separator = () => <Spacer x={2} />;

export function CategoryList<T = any>(props: FlatListProps<T>) {
  return <BaseList {...(props as any)} ItemSeparatorComponent={Separator} />;
}
