import { ListRenderItem } from 'react-native';
import { Genre } from '@components/core';

export const keyExtractor = (item: string) => item;
export const renderItem: ListRenderItem<string> = (p) => {
  return <Genre genre={p.item} />;
};
