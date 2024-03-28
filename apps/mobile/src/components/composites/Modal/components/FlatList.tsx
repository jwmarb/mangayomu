import React from 'react';
import { FlatListProps } from 'react-native';
import { FlatList as NativeFlatList } from 'react-native-gesture-handler';
import { styles } from '@/components/composites/Modal/styles';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';

export default function FlatList<T>(props: FlatListProps<T>) {
  const {
    style: styleProp,
    contentContainerStyle: contentContainerStyleProp,
    ...rest
  } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const flatListStyle = [style.content, styleProp];
  const contentContainerStyle = [
    style.flatListFooter,
    contentContainerStyleProp,
  ];
  return (
    <NativeFlatList
      style={flatListStyle}
      contentContainerStyle={contentContainerStyle}
      {...rest}
    />
  );
}
