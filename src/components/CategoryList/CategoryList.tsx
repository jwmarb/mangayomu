import pixelToNumber from '@utils/pixelToNumber';
import { FlatList } from 'react-native';
import styled, { css } from 'styled-components/native';
export const CategoryList = styled.FlatList.attrs((props) => ({
  contentContainerStyle: {
    paddingHorizontal: pixelToNumber(props.theme.spacing(3)),
  },
}))`` as unknown as typeof FlatList;
