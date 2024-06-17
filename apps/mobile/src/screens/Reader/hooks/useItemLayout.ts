import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Data } from '@/screens/Reader/Reader';

export default function useItemLayout() {
  const { width } = useWindowDimensions();
  const getItemLayout = React.useCallback(
    (_: ArrayLike<Data> | null | undefined, index: number) => ({
      index,
      length: width,
      offset: width * index,
    }),
    [width],
  );

  return getItemLayout;
}
