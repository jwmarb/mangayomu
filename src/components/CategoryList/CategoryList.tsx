import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { FlatList, FlatListProps } from 'react-native';
import styled, { css } from 'styled-components/native';
const BaseList = styled.FlatList.attrs((props) => ({
  contentContainerStyle: {
    paddingHorizontal: pixelToNumber(props.theme.spacing(3)),
  },
}))``;

export function CategoryList<T = any>(props: FlatListProps<T>) {
  return <BaseList {...(props as any)} />;
}
